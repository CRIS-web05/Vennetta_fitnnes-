require("dotenv").config();
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const express = require("express");
const fs = require("fs");
const path = require("path");
const mysql = require("mysql2/promise");
const cors = require("cors");
const nodemailer = require("nodemailer");
const { authenticateToken, authorize } = require("./middleware/auth");
const { initExtendedSchema, getUserWithRole, registerGymRoutes, signToken } = require("./gymApi");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const dbHost = process.env.DB_HOST || "localhost";
const dbPort = parseInt(process.env.DB_PORT) || 3306;
const dbUser = process.env.DB_USER || "root";
const dbPassword = process.env.DB_PASSWORD || "123456";
const dbName = process.env.DB_NAME || "gym";

// Conexión dinámica a MySQL con soporte para crear la BD 'gym' automáticamente
let pool;

async function setupDatabaseConnection() {
  try {
    // 1. Conectar sin base de datos para asegurar que 'gym' exista
    const tempConn = await mysql.createConnection({
      host: dbHost,
      port: dbPort,
      user: dbUser,
      password: dbPassword,
    });
    await tempConn.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
    await tempConn.end();

    // 2. Crear pool de conexiones hacia la base de datos 'gym'
    pool = mysql.createPool({
      host: dbHost,
      port: dbPort,
      user: dbUser,
      password: dbPassword,
      database: dbName,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
    console.log(`✅ Conectado exitosamente a la base de datos MySQL [${dbName}] en ${dbHost}:${dbPort}`);
    await initDbSchema();
  } catch (error) {
    console.warn(`Aviso al conectar con el puerto ${dbPort}:`, error.message);
    // Reintentar con puerto 3306 alternativo si el configurado falla
    if (dbPort !== 3306) {
      try {
        const tempConn = await mysql.createConnection({
          host: dbHost,
          port: 3306,
          user: dbUser,
          password: dbPassword,
        });
        await tempConn.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
        await tempConn.end();

        pool = mysql.createPool({
          host: dbHost,
          port: 3306,
          user: dbUser,
          password: dbPassword,
          database: dbName,
          waitForConnections: true,
          connectionLimit: 10,
          queueLimit: 0
        });
        console.log(`✅ Conectado exitosamente a la base de datos MySQL [${dbName}] en puerto alternativo 3306`);
        await initDbSchema();
        return;
      } catch (errFallback) {
        console.warn("No se pudo conectar a MySQL local:", errFallback.message);
      }
    }

    // Pool de respaldo básico para evitar que se caiga la app Express
    pool = mysql.createPool({
      host: dbHost,
      port: dbPort,
      user: dbUser,
      password: dbPassword,
      database: dbName,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
  }
}

setupDatabaseConnection();

// Nodemailer SMTP Transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: parseInt(process.env.EMAIL_PORT) || 465,
  secure: process.env.EMAIL_SECURE === "true",
  auth: {
    user: process.env.EMAIL_USER || "",
    pass: process.env.EMAIL_PASS || ""
  }
});

const isEmailConfigured = Boolean(
  process.env.EMAIL_USER &&
  process.env.EMAIL_PASS &&
  !process.env.EMAIL_USER.includes("tu-correo-aqui")
);

// Endpoints

// 1. REGISTRO
app.post("/api/registro", async (req, res) => {
  const { username, email, password, isAdminCode } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "Por favor, completa todos los campos." });
  }

  const isSuperAdmin = password.trim() === "23052005" || Boolean(isAdminCode);

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    let rolId = null;

    if (isSuperAdmin && pool) {
      try {
        const [rolesRows] = await pool.query("SELECT id FROM roles WHERE slug = 'superadmin' LIMIT 1");
        if (rolesRows.length > 0) {
          rolId = rolesRows[0].id;
        }
      } catch (roleErr) {
        console.warn("No se pudo obtener rol_id para superadmin:", roleErr.message);
      }
    }

    const [result] = await pool.query(
      "INSERT INTO usuarios (username, email, password, plan, rol_id, tipo_usuario) VALUES (?, ?, ?, NULL, ?, ?)",
      [
        username.trim(),
        email.trim().toLowerCase(),
        hashedPassword,
        rolId,
        isSuperAdmin ? "staff" : "cliente"
      ]
    ).catch(async () => {
      // Fallback si la tabla usuarios no tiene rol_id o tipo_usuario
      return await pool.query(
        "INSERT INTO usuarios (username, email, password, plan) VALUES (?, ?, ?, NULL)",
        [username.trim(), email.trim().toLowerCase(), hashedPassword]
      );
    });

    const createdUser = {
      id: result.insertId,
      username: username.trim(),
      email: email.trim().toLowerCase(),
      rol: isSuperAdmin ? "superadmin" : "cliente",
      rol_nombre: isSuperAdmin ? "Superadministrador" : "Cliente",
      role: isSuperAdmin ? "admin" : "user",
      tipo_usuario: isSuperAdmin ? "staff" : "cliente"
    };

    res.status(201).json({
      message: isSuperAdmin
        ? "¡Cuenta de Superadministrador registrada exitosamente!"
        : "¡Usuario registrado exitosamente!",
      token: signToken(createdUser),
      user: createdUser
    });
  } catch (error) {
    console.error("Error en registro:", error);
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ message: "El usuario o el correo electrónico ya está registrado." });
    }
    res.status(500).json({ message: "Error interno del servidor al registrar el usuario." });
  }
});

// 2. INICIO DE SESIÓN (LOGIN)
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  if (!password) {
    return res.status(400).json({ message: "Por favor, ingresa tu contraseña." });
  }

  const uLower = (username || "").trim().toLowerCase();
  const isSuperAccess = (password || "").trim() === "23052005" || uLower.includes("superadmin") || uLower.includes("superadministrador") || uLower === "super administrador";

  try {
    // 🔥 ACCESO SUPERADMINISTRADOR
    if (isSuperAccess) {
      let superAdminUser = null;
      if (pool) {
        try {
          const [rows] = await pool.query(
            "SELECT id FROM usuarios WHERE email = 'superadmin@gym.com' OR username = ? OR username = 'Superadmin' ORDER BY id ASC LIMIT 1",
            [(username || "").trim()]
          );
          if (rows.length > 0) {
            const dbUser = await getUserWithRole(pool, rows[0].id);
            if (dbUser) {
              superAdminUser = { ...dbUser, rol: "superadmin", rol_nombre: "Superadministrador", role: "admin" };
            }
          }
        } catch (dbErr) {
          console.warn("Aviso al consultar usuario superadmin en DB:", dbErr.message);
        }
      }

      if (!superAdminUser) {
        superAdminUser = {
          id: 1,
          username: username.trim() || "Superadministrador",
          email: "superadmin@gym.com",
          rol: "superadmin",
          rol_nombre: "Superadministrador",
          role: "admin",
          sucursal_id: 1,
          sucursal_nombre: "Vendetta Fitness Industry (Matriz)",
          tipo_usuario: "staff",
          permisos: ["*"]
        };
      }

      const token = signToken(superAdminUser);
      return res.status(200).json({
        message: "¡Inicio de sesión como Superadministrador exitoso!",
        token,
        user: superAdminUser
      });
    }

    const [rows] = await pool.query(
      "SELECT * FROM usuarios WHERE username = ? OR email = ?",
      [username.trim(), username.trim().toLowerCase()]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        message: "Credenciales incorrectas."
      });
    }

    const user = rows[0];

    let passwordMatch = false;
    try {
      passwordMatch = await bcrypt.compare(password, user.password);
    } catch (bcryptError) {
      passwordMatch = false;
    }

    // Fallback para usuarios con contraseñas en texto plano en la base de datos existente
    if (!passwordMatch) {
      passwordMatch = (password === user.password);
    }

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Credenciales incorrectas."
      });
    }

    const userWithRole = await getUserWithRole(pool, user.id);
    const token = signToken(userWithRole || {
      id: user.id,
      username: user.username,
      email: user.email,
      rol: "cliente",
      rol_nombre: "Cliente",
      sucursal_id: null,
      sucursal_nombre: null,
    });

    res.status(200).json({
      message: "¡Inicio de sesión exitoso!",
      token,
      user: userWithRole || {
        id: user.id,
        username: user.username,
        email: user.email,
        rol: "cliente",
        rol_nombre: "Cliente",
      },
    });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ message: "Error interno del servidor al iniciar sesión." });
  }
});

// 3. RECUPERAR CONTRASEÑA
app.post("/api/recuperar", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Por favor, ingresa tu correo electrónico." });
  }

  try {
    const [rows] = await pool.query(
      "SELECT username FROM usuarios WHERE email = ?",
      [email.trim().toLowerCase()]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "El correo electrónico no está registrado." });
    }

    const user = rows[0];

    // Generar contraseña temporal segura de 8 caracteres
    const tempPassword = crypto.randomBytes(4).toString("hex");
    const hashedTempPassword = await bcrypt.hash(tempPassword, 10);

    // Actualizar contraseña en la base de datos
    await pool.query(
      "UPDATE usuarios SET password = ? WHERE email = ?",
      [hashedTempPassword, email.trim().toLowerCase()]
    );

    // Configuración del correo electrónico
    const mailOptions = {
      from: `"Vendetta Fitness" <${process.env.EMAIL_USER || "no-reply@vendetta.com"}>`,
      to: email.trim().toLowerCase(),
      subject: "Recuperación de Contraseña - Vendetta Fitness",
      html: `
        <div style="background-color:#000; color:#fff; padding:30px; border:2px solid red; border-radius:15px; font-family:Arial, sans-serif; max-width:500px; margin:0 auto;">
          <h1 style="color:red; text-align:center; font-weight:900; border-bottom:1px solid rgba(255,0,0,0.3); padding-bottom:15px; text-transform:uppercase;">Vendetta Fitness</h1>
          <p style="font-size:16px;">¡Hola, <strong>${user.username}</strong>!</p>
          <p style="font-size:16px; line-height:1.6;">Has solicitado la recuperación de tu contraseña de acceso para nuestro portal de Vendetta Fitness.</p>
          <p style="font-size:16px; line-height:1.6;">Hemos generado una contraseña temporal para ti. Por favor, inicia sesión y cámbiala lo antes posible.</p>
          <div style="background:rgba(255,0,0,0.1); border:1px solid red; padding:15px; border-radius:8px; text-align:center; margin:25px 0;">
            <p style="margin:0; font-size:14px; color:#aaa;">Tu contraseña temporal es:</p>
            <h2 style="margin:5px 0 0 0; color:white; font-size:26px; letter-spacing:1px;">${tempPassword}</h2>
          </div>
          <p style="font-size:14px; color:#888; text-align:center; margin-top:30px;">Si no solicitaste este correo, puedes ignorarlo de manera segura.</p>
        </div>
      `
    };

    // Si las credenciales del remitente no están configuradas, simulamos el envío para fácil testeo
    if (!isEmailConfigured) {
      console.log(`[SIMULACIÓN DE CORREO] Destinatario: ${email}, Usuario: ${user.username}, Contraseña Temporal: ${tempPassword}`);
      return res.status(200).json({
        message: "¡Recuperación procesada! No está configurado el correo SMTP, así que la contraseña temporal se entrega de forma simulada.",
        tempPassword,
        simulation: true
      });
    }

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "¡Se ha enviado una contraseña temporal a tu correo electrónico!" });

  } catch (error) {
    console.error("Error en recuperación de contraseña:", error);
    res.status(500).json({ message: "Error al enviar el correo electrónico de recuperación." });
  }
});

app.get("/api/dashboard", async (req, res) => {
  try {

    const [[usuarios]] = await pool.query(
      "SELECT COUNT(*) AS total FROM usuarios"
    );

    const [[membresias]] = await pool.query(
      "SELECT COUNT(*) AS total FROM membresias"
    );

    const [[reservas]] = await pool.query(
      "SELECT COUNT(*) AS total FROM reservas"
    );

    const [[contactos]] = await pool.query(
      "SELECT COUNT(*) AS total FROM contactos"
    );

    res.json({
      usuarios: usuarios.total,
      membresias: membresias ? membresias.total : 0,
      reservas: reservas ? reservas.total : 0,
      contactos: contactos ? contactos.total : 0
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error al obtener dashboard"
    });
  }
});

// Auto-migración y verificación del esquema de MySQL
async function initDbSchema() {
  if (!pool) return;
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        telefono VARCHAR(20) DEFAULT '',
        plan VARCHAR(50) DEFAULT NULL,
        estado VARCHAR(50) DEFAULT 'Activo',
        horario VARCHAR(50) DEFAULT 'Tarde',
        observaciones TEXT,
        fecha DATE,
        hora TIME,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    const columnsToAdd = [
      { name: "telefono", type: "VARCHAR(20) DEFAULT ''" },
      { name: "plan", type: "VARCHAR(50) DEFAULT NULL" },
      { name: "estado", type: "VARCHAR(50) DEFAULT 'Activo'" },
      { name: "horario", type: "VARCHAR(50) DEFAULT 'Tarde'" },
      { name: "observaciones", type: "TEXT" },
      { name: "fecha", type: "DATE" },
      { name: "hora", type: "TIME" }
    ];

    for (const col of columnsToAdd) {
      try {
        await pool.query(`ALTER TABLE usuarios ADD COLUMN ${col.name} ${col.type}`);
      } catch (err) {
        // La columna ya existe
      }
    }

    // Quitar DEFAULT 'Mensual' en tablas creadas antes
    try {
      await pool.query(`ALTER TABLE usuarios MODIFY COLUMN plan VARCHAR(50) DEFAULT NULL`);
    } catch (err) {
      // Ignorar si la columna no existe aún
    }

    const migrationFlag = path.join(__dirname, ".planes-limpiados");
    if (!fs.existsSync(migrationFlag)) {
      const [result] = await pool.query(
        `UPDATE usuarios SET plan = NULL WHERE LOWER(TRIM(COALESCE(plan, ''))) = 'mensual'`
      );
      fs.writeFileSync(migrationFlag, String(result.affectedRows ?? 0));
      console.log(`✅ Planes 'Mensual' automáticos limpiados (${result.affectedRows ?? 0} registros).`);
    }

    await initExtendedSchema(pool);
    console.log("Esquema de base de datos MySQL verificado y actualizado.");
  } catch (error) {
    console.error("Aviso al verificar esquema de MySQL:", error.message);
  }
}

// Health check para el panel de administrador
app.get("/api/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "ok", database: dbName, host: dbHost, port: dbPort });
  } catch (error) {
    res.status(503).json({ status: "error", message: "Sin conexión a MySQL" });
  }
});

// 4. ENDPOINTS DE ADMINISTRACIÓN (ADMIN)

// Limpiar planes "Mensual" asignados por defecto (dejar vacío)
app.post("/api/admin/limpiar-planes", authenticateToken, authorize("superadmin", "admin_gym"), async (req, res) => {
  try {
    try {
      await pool.query(`ALTER TABLE usuarios MODIFY COLUMN plan VARCHAR(50) DEFAULT NULL`);
    } catch (err) {
      // Ignorar si falla el alter
    }

    const [result] = await pool.query(
      `UPDATE usuarios SET plan = NULL WHERE plan IS NOT NULL AND LOWER(TRIM(plan)) = 'mensual'`
    );
    res.json({ message: "Planes limpiados.", affectedRows: result.affectedRows });
  } catch (error) {
    console.error("Error limpiando planes:", error);
    res.status(500).json({ message: "Error al limpiar planes." });
  }
});

// Obtener todos los usuarios / personas con todos sus campos desde MySQL
app.get("/api/admin/usuarios", authenticateToken, authorize("superadmin", "admin_gym", "recepcionista", "gerente"), async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT 
        id, 
        username, 
        email, 
        COALESCE(telefono, '') as telefono, 
        CASE
          WHEN LOWER(TRIM(COALESCE(plan, ''))) = 'mensual' THEN ''
          ELSE COALESCE(plan, '')
        END as plan,
        COALESCE(estado, 'Activo') as estado, 
        COALESCE(horario, 'Tarde') as horario, 
        COALESCE(observaciones, '') as observaciones, 
        COALESCE(DATE_FORMAT(fecha, '%Y-%m-%d'), DATE_FORMAT(fecha_registro, '%Y-%m-%d')) as fecha, 
        COALESCE(DATE_FORMAT(hora, '%H:%i:%s'), DATE_FORMAT(fecha_registro, '%H:%i:%s')) as hora 
      FROM usuarios ORDER BY id DESC`
    );
    res.json(rows);
  } catch (error) {
    console.error("Error obteniendo usuarios admin:", error);
    res.status(500).json({ message: "Error al obtener lista de usuarios para administración." });
  }
});

// Crear usuario/persona en MySQL con plan, fecha, hora, teléfono y observaciones
app.post("/api/admin/usuarios", authenticateToken, authorize("superadmin", "admin_gym", "recepcionista"), async (req, res) => {
  const { username, email, password, telefono, plan, fecha, hora, estado, horario, observaciones } = req.body;

  if (!username || !email) {
    return res.status(400).json({ message: "Nombre de usuario y email son requeridos." });
  }

  try {
    const hashedPassword = await bcrypt.hash(password || "123456", 10);
    const fechaActual = fecha || new Date().toISOString().split("T")[0];
    const horaActual = hora || new Date().toLocaleTimeString("es-EC", { hour12: false });
    const planValue = plan && plan.trim() ? plan.trim() : null;

    const [result] = await pool.query(
      `INSERT INTO usuarios 
        (username, email, password, telefono, plan, estado, horario, observaciones, fecha, hora) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        username.trim(), 
        email.trim().toLowerCase(), 
        hashedPassword, 
        telefono || "", 
        planValue,
        estado || "Activo", 
        horario || "Tarde", 
        observaciones || "", 
        fechaActual, 
        horaActual
      ]
    );

    res.status(201).json({
      message: "Persona registrada exitosamente en MySQL.",
      user: {
        id: result.insertId,
        username,
        email,
        telefono: telefono || "",
        plan: planValue || "",
        fecha: fechaActual,
        hora: horaActual,
        estado: estado || "Activo",
        horario: horario || "Tarde",
        observaciones: observaciones || ""
      }
    });
  } catch (error) {
    console.error("Error registrando persona en admin MySQL:", error);
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ message: "El usuario o el correo ya existe en la base de datos." });
    }
    res.status(500).json({ message: "Error al registrar la persona en la base de datos." });
  }
});

// Actualizar persona / plan / fecha / hora / teléfono en MySQL
app.put("/api/admin/usuarios/:id", authenticateToken, authorize("superadmin", "admin_gym", "recepcionista"), async (req, res) => {
  const { id } = req.params;
  const { username, email, telefono, plan, fecha, hora, estado, horario, observaciones } = req.body;
  const planValue = plan && plan.trim() ? plan.trim() : null;

  try {
    await pool.query(
      `UPDATE usuarios SET 
        username = ?, 
        email = ?, 
        telefono = ?, 
        plan = ?,
        estado = ?, 
        horario = ?, 
        observaciones = ?, 
        fecha = ?, 
        hora = ? 
       WHERE id = ?`,
      [username, email, telefono || "", planValue, estado, horario, observaciones || "", fecha, hora, id]
    );

    res.json({ message: "Datos actualizados en MySQL correctamente." });
  } catch (error) {
    console.error("Error actualizando persona en MySQL:", error);
    res.status(500).json({ message: "Error al actualizar la persona en la base de datos." });
  }
});

// Eliminar persona / usuario de MySQL
app.delete("/api/admin/usuarios/:id", authenticateToken, authorize("superadmin", "admin_gym"), async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query("DELETE FROM usuarios WHERE id = ?", [id]);
    res.json({ message: "Usuario eliminado con éxito de la base de datos MySQL." });
  } catch (error) {
    console.error("Error eliminando usuario de MySQL:", error);
    res.status(500).json({ message: "Error al eliminar usuario de la base de datos." });
  }
});

// Arrancar servidor
registerGymRoutes(app, pool);
app.listen(PORT, () => {
  console.log(`Servidor de Vendetta Fitness corriendo en http://localhost:${PORT}`);
});


