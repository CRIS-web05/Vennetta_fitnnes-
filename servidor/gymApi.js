const bcrypt = require("bcrypt");
const { ROLES } = require("./roles");
const { authenticateToken, authorize, signToken } = require("./middleware/auth");

async function initExtendedSchema(pool) {
  if (!pool) return;

  await pool.query(`
    CREATE TABLE IF NOT EXISTS roles (
      id INT AUTO_INCREMENT PRIMARY KEY,
      slug VARCHAR(50) NOT NULL UNIQUE,
      nombre VARCHAR(100) NOT NULL,
      descripcion TEXT,
      permisos JSON,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS sucursales (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nombre VARCHAR(100) NOT NULL,
      direccion TEXT,
      telefono VARCHAR(20) DEFAULT '',
      horario_apertura TIME DEFAULT '06:00:00',
      horario_cierre TIME DEFAULT '22:00:00',
      lat DECIMAL(10,8) DEFAULT NULL,
      lng DECIMAL(11,8) DEFAULT NULL,
      es_matriz TINYINT(1) DEFAULT 0,
      activa TINYINT(1) DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS rutinas (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nombre VARCHAR(150) NOT NULL,
      descripcion TEXT,
      sucursal_id INT,
      entrenador_id INT DEFAULT NULL,
      nivel ENUM('Principiante','Intermedio','Avanzado') DEFAULT 'Intermedio',
      duracion_minutos INT DEFAULT 60,
      activa TINYINT(1) DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (sucursal_id) REFERENCES sucursales(id) ON DELETE SET NULL
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS rutina_horarios (
      id INT AUTO_INCREMENT PRIMARY KEY,
      rutina_id INT NOT NULL,
      dia_semana ENUM('Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo') NOT NULL,
      hora_inicio TIME NOT NULL,
      hora_fin TIME NOT NULL,
      cupo_maximo INT DEFAULT 20,
      FOREIGN KEY (rutina_id) REFERENCES rutinas(id) ON DELETE CASCADE
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS ejercicios (
      id INT AUTO_INCREMENT PRIMARY KEY,
      rutina_id INT NOT NULL,
      nombre VARCHAR(150) NOT NULL,
      series INT DEFAULT 3,
      repeticiones VARCHAR(50) DEFAULT '12',
      descanso_seg INT DEFAULT 60,
      orden INT DEFAULT 0,
      FOREIGN KEY (rutina_id) REFERENCES rutinas(id) ON DELETE CASCADE
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS emprendedores (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nombre VARCHAR(100) NOT NULL,
      email VARCHAR(100) NOT NULL,
      telefono VARCHAR(20) DEFAULT '',
      ciudad VARCHAR(100) DEFAULT '',
      inversion_estimada VARCHAR(50) DEFAULT '',
      mensaje TEXT,
      estado ENUM('Nuevo','Contactado','En evaluación','Aprobado','Rechazado') DEFAULT 'Nuevo',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS membresias (
      id INT AUTO_INCREMENT PRIMARY KEY,
      usuario_id INT,
      plan VARCHAR(50),
      fecha_inicio DATE,
      fecha_fin DATE,
      estado VARCHAR(50) DEFAULT 'Activa',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS reservas (
      id INT AUTO_INCREMENT PRIMARY KEY,
      usuario_id INT,
      rutina_id INT,
      fecha DATE,
      hora TIME,
      estado VARCHAR(50) DEFAULT 'Confirmada',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS contactos (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nombre VARCHAR(100),
      email VARCHAR(100),
      mensaje TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS checkins (
      id INT AUTO_INCREMENT PRIMARY KEY,
      usuario_id INT NOT NULL,
      sucursal_id INT,
      tipo ENUM('entrada','salida') DEFAULT 'entrada',
      fecha DATE NOT NULL,
      hora TIME NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Eliminar tablas no deseadas de MySQL
  try {
    await pool.query("DROP TABLE IF EXISTS evaluaciones_nutricionales");
    await pool.query("DROP TABLE IF EXISTS mediciones_entrenamiento");
  } catch (dropErr) {
    console.warn("Aviso al eliminar tablas deshabilitadas:", dropErr.message);
  }

  await pool.query(`
    CREATE TABLE IF NOT EXISTS transacciones_finanzas (
      id INT AUTO_INCREMENT PRIMARY KEY,
      usuario_id INT DEFAULT NULL,
      tipo ENUM('ingreso','egreso') DEFAULT 'ingreso',
      categoria VARCHAR(100) DEFAULT 'Membresía',
      monto DECIMAL(10,2) NOT NULL,
      descripcion TEXT,
      metodo_pago VARCHAR(50) DEFAULT 'Efectivo',
      fecha DATE NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  const userCols = [
    { name: "rol_id", type: "INT DEFAULT NULL" },
    { name: "sucursal_id", type: "INT DEFAULT NULL" },
    { name: "tipo_usuario", type: "ENUM('cliente','staff') DEFAULT 'cliente'" },
  ];
  for (const col of userCols) {
    try {
      await pool.query(`ALTER TABLE usuarios ADD COLUMN ${col.name} ${col.type}`);
    } catch {
      // columna ya existe
    }
  }

  // Asegurar columnas y relaciones para tipo_pago, cliente, emprendedores, colaborador, contactos
  const extraCols = [
    { table: 'transacciones_finanzas', col: 'codigo_tipo_pago', type: 'BIGINT(20) UNSIGNED DEFAULT 1' },
    { table: 'cliente', col: 'usuario_id', type: 'INT DEFAULT NULL' },
    { table: 'emprendedores', col: 'usuario_id', type: 'INT DEFAULT NULL' },
    { table: 'colaborador', col: 'usuario_id', type: 'INT DEFAULT NULL' },
    { table: 'contactos', col: 'usuario_id', type: 'INT DEFAULT NULL' }
  ];
  for (const item of extraCols) {
    try {
      await pool.query(`ALTER TABLE ${item.table} ADD COLUMN ${item.col} ${item.type}`);
    } catch {
      // columna ya existe
    }
  }

  for (const rol of ROLES) {
    await pool.query(
      `INSERT INTO roles (slug, nombre, descripcion, permisos) VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE nombre=VALUES(nombre), descripcion=VALUES(descripcion), permisos=VALUES(permisos)`,
      [rol.slug, rol.nombre, rol.descripcion, JSON.stringify(rol.permisos)]
    );
  }

  const [[matrizCount]] = await pool.query("SELECT COUNT(*) AS c FROM sucursales WHERE es_matriz = 1");
  if (matrizCount.c === 0) {
    await pool.query(
      `INSERT INTO sucursales (nombre, direccion, telefono, horario_apertura, horario_cierre, es_matriz, activa)
       VALUES (?, ?, ?, ?, ?, 1, 1)`,
      [
        "Vendetta Fitness Industry (Matriz)",
        "Av. 13 de junio y Av. Equinoccial, Edificio Equinoccial Center, Quito",
        "0987654321",
        "06:00:00",
        "22:00:00",
      ]
    );
  }

  const [[superadminRole]] = await pool.query("SELECT id FROM roles WHERE slug = 'superadmin'");
  const [[clienteRole]] = await pool.query("SELECT id FROM roles WHERE slug = 'cliente'");
  const [[entrenadorRole]] = await pool.query("SELECT id FROM roles WHERE slug = 'entrenador'");
  const [[matriz]] = await pool.query("SELECT id FROM sucursales WHERE es_matriz = 1 LIMIT 1");

  const hashedPassword = await bcrypt.hash("23052005", 10);

  // 1. Asegurar usuario Superadministrador principal
  const [[adminUser]] = await pool.query("SELECT id FROM usuarios WHERE email = 'admin@gym.com' OR username = 'admin' LIMIT 1");
  if (!adminUser) {
    await pool.query(
      `INSERT INTO usuarios (username, email, password, telefono, plan, estado, horario, observaciones, rol_id, sucursal_id, tipo_usuario)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        "admin",
        "admin@gym.com",
        hashedPassword,
        "0987654321",
        "Anual",
        "Activo",
        "Mañana",
        "Superadministrador principal del gimnasio",
        superadminRole?.id || 1,
        matriz?.id || 1,
        "staff"
      ]
    );
    console.log("✅ Usuario Superadmin por defecto (clave: 23052005) creado.");
  } else if (superadminRole) {
    await pool.query(
      `UPDATE usuarios SET rol_id = ?, sucursal_id = ?, tipo_usuario = 'staff' WHERE id = ?`,
      [superadminRole.id, matriz?.id || 1, adminUser.id]
    );
  }

  // 2. Sembrar Cuentas de Entrenadores por defecto
  if (entrenadorRole) {
    const [[entrenadorCount]] = await pool.query("SELECT COUNT(*) AS c FROM usuarios WHERE rol_id = ?", [entrenadorRole.id]);
    if (entrenadorCount.c === 0) {
      const defaultTrainers = [
        { username: "Carlos Mendoza (Entrenador)", email: "carlos.entrenador@gym.com", telefono: "0991234567", horario: "Mañana", obs: "Especialista en Hipertrofia y Fuerza" },
        { username: "María Fernández (Entrenadora)", email: "maria.entrenador@gym.com", telefono: "0997654321", horario: "Tarde", obs: "Especialista en Funcional y Cardio" },
        { username: "Alex Fitness (Entrenador)", email: "alex.entrenador@gym.com", telefono: "0998887766", horario: "Noche", obs: "Especialista en Definición y Calistenia" },
      ];
      for (const t of defaultTrainers) {
        await pool.query(
          `INSERT INTO usuarios (username, email, password, telefono, plan, estado, horario, observaciones, rol_id, sucursal_id, tipo_usuario)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE rol_id=VALUES(rol_id)`,
          [
            t.username,
            t.email,
            hashedPassword,
            t.telefono,
            "Staff Entrenador",
            "Activo",
            t.horario,
            t.obs,
            entrenadorRole.id,
            matriz?.id || 1,
            "staff"
          ]
        );
      }
      console.log("✅ Cuentas de Entrenadores creadas exitosamente.");
    }
  }

  // 3. Sembrar Rutinas con Horarios y Ejercicios por defecto
  const [[rutinasCount]] = await pool.query("SELECT COUNT(*) AS c FROM rutinas");
  if (rutinasCount.c === 0) {
    const [[carlosTrainer]] = await pool.query("SELECT id FROM usuarios WHERE email = 'carlos.entrenador@gym.com' LIMIT 1");
    const trainerId = carlosTrainer ? carlosTrainer.id : null;
    const sucursalId = matriz ? matriz.id : 1;

    // Rutina 1: Hipertrofia
    const [res1] = await pool.query(
      `INSERT INTO rutinas (nombre, descripcion, sucursal_id, entrenador_id, nivel, duracion_minutos, activa)
       VALUES (?, ?, ?, ?, ?, ?, 1)`,
      ["Rutina Hipertrofia & Fuerza (Pecho y Tríceps)", "Enfoque en ganancia de masa muscular y desarrollo de fuerza máxima.", sucursalId, trainerId, "Avanzado", 75]
    );
    const r1Id = res1.insertId;
    await pool.query(
      `INSERT INTO rutina_horarios (rutina_id, dia_semana, hora_inicio, hora_fin, cupo_maximo) VALUES 
       (?, 'Lunes', '07:00:00', '08:15:00', 20),
       (?, 'Miércoles', '07:00:00', '08:15:00', 20),
       (?, 'Viernes', '07:00:00', '08:15:00', 20)`,
      [r1Id, r1Id, r1Id]
    );
    await pool.query(
      `INSERT INTO ejercicios (rutina_id, nombre, series, repeticiones, descanso_seg, orden) VALUES
       (?, 'Press de Banca Plano con Barra', 4, '8-10', 90, 1),
       (?, 'Press Inclinado con Mancuernas', 4, '10-12', 75, 2),
       (?, 'Aperturas en Polea Alta', 3, '12-15', 60, 3),
       (?, 'Fondos en Paralelas (Tríceps)', 3, '10-12', 60, 4),
       (?, 'Extensión de Tríceps en Polea Alta', 4, '12', 60, 5)`,
      [r1Id, r1Id, r1Id, r1Id, r1Id]
    );

    // Rutina 2: Resistencia & Funcional
    const [res2] = await pool.query(
      `INSERT INTO rutinas (nombre, descripcion, sucursal_id, entrenador_id, nivel, duracion_minutos, activa)
       VALUES (?, ?, ?, ?, ?, ?, 1)`,
      ["Rutina Resistencia & Funcional High-Intensity", "Circuito de alta intensidad para tonificación, quema de grasa y agilidad.", sucursalId, trainerId, "Intermedio", 60]
    );
    const r2Id = res2.insertId;
    await pool.query(
      `INSERT INTO rutina_horarios (rutina_id, dia_semana, hora_inicio, hora_fin, cupo_maximo) VALUES 
       (?, 'Martes', '09:00:00', '10:00:00', 18),
       (?, 'Jueves', '09:00:00', '10:00:00', 18),
       (?, 'Sábado', '10:00:00', '11:00:00', 25)`,
      [r2Id, r2Id, r2Id]
    );
    await pool.query(
      `INSERT INTO ejercicios (rutina_id, nombre, series, repeticiones, descanso_seg, orden) VALUES
       (?, 'Kettlebell Swings', 4, '20', 45, 1),
       (?, 'Burpees con Salto', 4, '15', 45, 2),
       (?, 'Sentadillas Goblet con Mancuerna', 4, '15', 45, 3),
       (?, 'Flexiones Esparta', 3, '12', 45, 4),
       (?, 'Plancha Abdominal Activa', 4, '60 seg', 30, 5)`,
      [r2Id, r2Id, r2Id, r2Id, r2Id]
    );

    // Rutina 3: Espalda & Bíceps
    const [res3] = await pool.query(
      `INSERT INTO rutinas (nombre, descripcion, sucursal_id, entrenador_id, nivel, duracion_minutos, activa)
       VALUES (?, ?, ?, ?, ?, ?, 1)`,
      ["Rutina Definición Muscular & Espalda/Bíceps", "Esculpido muscular y trabajo de espalda ancha con tracción y aislamiento.", sucursalId, trainerId, "Principiante", 60]
    );
    const r3Id = res3.insertId;
    await pool.query(
      `INSERT INTO rutina_horarios (rutina_id, dia_semana, hora_inicio, hora_fin, cupo_maximo) VALUES 
       (?, 'Lunes', '18:00:00', '19:00:00', 20),
       (?, 'Miércoles', '18:00:00', '19:00:00', 20),
       (?, 'Viernes', '18:00:00', '19:00:00', 20)`,
      [r3Id, r3Id, r3Id]
    );
    await pool.query(
      `INSERT INTO ejercicios (rutina_id, nombre, series, repeticiones, descanso_seg, orden) VALUES
       (?, 'Dominadas en Barra Fija', 4, '8-10', 90, 1),
       (?, 'Remo Horizontal con Barra T', 4, '10-12', 75, 2),
       (?, 'Jalón al Pecho Agarre Abierto', 3, '12', 60, 3),
       (?, 'Curl de Bíceps con Barra Z', 4, '12', 60, 4),
       (?, 'Curl Martillo Alternado', 3, '12', 60, 5)`,
      [r3Id, r3Id, r3Id, r3Id, r3Id]
    );
    console.log("✅ Rutinas por defecto sembradas en MySQL.");
  }

  await pool.query(
    `UPDATE usuarios SET rol_id = ?, tipo_usuario = 'cliente' WHERE rol_id IS NULL`,
    [clienteRole?.id || 8]
  );

  console.log("✅ Esquema extendido (roles, sucursales, rutinas, emprendedores) verificado.");
}

async function getUserWithRole(pool, userId) {
  const [rows] = await pool.query(
    `SELECT u.id, u.username, u.email, u.telefono, u.plan, u.estado, u.horario,
            u.rol_id, u.sucursal_id, u.tipo_usuario,
            r.slug AS rol, r.nombre AS rol_nombre, r.permisos,
            s.nombre AS sucursal_nombre
     FROM usuarios u
     LEFT JOIN roles r ON u.rol_id = r.id
     LEFT JOIN sucursales s ON u.sucursal_id = s.id
     WHERE u.id = ?`,
    [userId]
  );
  if (!rows.length) return null;
  const u = rows[0];
  return {
    id: u.id,
    username: u.username,
    email: u.email,
    telefono: u.telefono,
    plan: u.plan,
    estado: u.estado,
    horario: u.horario,
    rol: u.rol || "cliente",
    rol_nombre: u.rol_nombre || "Cliente",
    rol_id: u.rol_id,
    sucursal_id: u.sucursal_id,
    sucursal_nombre: u.sucursal_nombre,
    tipo_usuario: u.tipo_usuario || "cliente",
    permisos: typeof u.permisos === "string" ? JSON.parse(u.permisos) : u.permisos || [],
  };
}

function registerGymRoutes(app, pool) {
  // --- ROLES ---
  app.get("/api/roles", authenticateToken, authorize("superadmin", "admin_gym", "gerente"), async (req, res) => {
    try {
      const [rows] = await pool.query("SELECT id, slug, nombre, descripcion, permisos FROM roles ORDER BY id");
      res.json(rows.map((r) => ({
        ...r,
        permisos: typeof r.permisos === "string" ? JSON.parse(r.permisos) : r.permisos,
      })));
    } catch (error) {
      res.status(500).json({ message: "Error al obtener roles." });
    }
  });

  // --- SUCURSALES ---
  app.get("/api/sucursales/public", async (req, res) => {
    try {
      const [rows] = await pool.query(
        "SELECT id, nombre, direccion, telefono, horario_apertura, horario_cierre, lat, lng, es_matriz FROM sucursales WHERE activa = 1 ORDER BY es_matriz DESC, nombre"
      );
      res.json(rows);
    } catch {
      res.status(500).json({ message: "Error al obtener sucursales." });
    }
  });

  app.get("/api/sucursales", authenticateToken, authorize("superadmin", "admin_gym", "gerente", "recepcionista"), async (req, res) => {
    try {
      const [rows] = await pool.query("SELECT * FROM sucursales ORDER BY es_matriz DESC, nombre");
      res.json(rows);
    } catch {
      res.status(500).json({ message: "Error al obtener sucursales." });
    }
  });

  app.post("/api/sucursales", authenticateToken, authorize("superadmin", "admin_gym"), async (req, res) => {
    const { nombre, direccion, telefono, horario_apertura, horario_cierre, lat, lng, es_matriz } = req.body;
    if (!nombre) return res.status(400).json({ message: "El nombre es requerido." });
    try {
      const [result] = await pool.query(
        `INSERT INTO sucursales (nombre, direccion, telefono, horario_apertura, horario_cierre, lat, lng, es_matriz)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [nombre, direccion || "", telefono || "", horario_apertura || "06:00:00", horario_cierre || "22:00:00", lat || null, lng || null, es_matriz ? 1 : 0]
      );
      res.status(201).json({ message: "Sucursal creada.", id: result.insertId });
    } catch {
      res.status(500).json({ message: "Error al crear sucursal." });
    }
  });

  app.put("/api/sucursales/:id", authenticateToken, authorize("superadmin", "admin_gym"), async (req, res) => {
    const { id } = req.params;
    const { nombre, direccion, telefono, horario_apertura, horario_cierre, lat, lng, activa, es_matriz } = req.body;
    try {
      await pool.query(
        `UPDATE sucursales SET nombre=?, direccion=?, telefono=?, horario_apertura=?, horario_cierre=?, lat=?, lng=?, activa=?, es_matriz=? WHERE id=?`,
        [nombre, direccion, telefono, horario_apertura, horario_cierre, lat, lng, activa ? 1 : 0, es_matriz ? 1 : 0, id]
      );
      res.json({ message: "Sucursal actualizada." });
    } catch {
      res.status(500).json({ message: "Error al actualizar sucursal." });
    }
  });

  app.delete("/api/sucursales/:id", authenticateToken, authorize("superadmin"), async (req, res) => {
    try {
      await pool.query("DELETE FROM sucursales WHERE id = ? AND es_matriz = 0", [req.params.id]);
      res.json({ message: "Sucursal eliminada." });
    } catch {
      res.status(500).json({ message: "Error al eliminar sucursal." });
    }
  });

  // --- RUTINAS ---
  app.get("/api/rutinas/public", async (req, res) => {
    try {
      const [rutinas] = await pool.query(
        `SELECT r.*, s.nombre AS sucursal_nombre, u.username AS entrenador_nombre
         FROM rutinas r
         LEFT JOIN sucursales s ON r.sucursal_id = s.id
         LEFT JOIN usuarios u ON r.entrenador_id = u.id
         WHERE r.activa = 1 ORDER BY r.nombre`
      );
      for (const rutina of rutinas) {
        const [horarios] = await pool.query(
          "SELECT * FROM rutina_horarios WHERE rutina_id = ? ORDER BY FIELD(dia_semana,'Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'), hora_inicio",
          [rutina.id]
        );
        const [ejercicios] = await pool.query("SELECT * FROM ejercicios WHERE rutina_id = ? ORDER BY orden", [rutina.id]);
        rutina.horarios = horarios;
        rutina.ejercicios = ejercicios;
      }
      res.json(rutinas);
    } catch {
      res.status(500).json({ message: "Error al obtener rutinas." });
    }
  });

  app.get("/api/rutinas", authenticateToken, authorize("superadmin", "admin_gym", "entrenador", "gerente"), async (req, res) => {
    try {
      const [rutinas] = await pool.query(
        `SELECT r.*, s.nombre AS sucursal_nombre, u.username AS entrenador_nombre
         FROM rutinas r
         LEFT JOIN sucursales s ON r.sucursal_id = s.id
         LEFT JOIN usuarios u ON r.entrenador_id = u.id
         ORDER BY r.nombre`
      );
      for (const rutina of rutinas) {
        const [horarios] = await pool.query("SELECT * FROM rutina_horarios WHERE rutina_id = ?", [rutina.id]);
        const [ejercicios] = await pool.query("SELECT * FROM ejercicios WHERE rutina_id = ? ORDER BY orden", [rutina.id]);
        rutina.horarios = horarios;
        rutina.ejercicios = ejercicios;
      }
      res.json(rutinas);
    } catch {
      res.status(500).json({ message: "Error al obtener rutinas." });
    }
  });

  app.post("/api/rutinas", authenticateToken, authorize("superadmin", "admin_gym", "entrenador"), async (req, res) => {
    const { nombre, descripcion, sucursal_id, entrenador_id, nivel, duracion_minutos, horarios, ejercicios } = req.body;
    if (!nombre) return res.status(400).json({ message: "Nombre de rutina requerido." });
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      const [result] = await conn.query(
        `INSERT INTO rutinas (nombre, descripcion, sucursal_id, entrenador_id, nivel, duracion_minutos)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [nombre, descripcion || "", sucursal_id || null, entrenador_id || req.user.id, nivel || "Intermedio", duracion_minutos || 60]
      );
      const rutinaId = result.insertId;
      if (Array.isArray(horarios)) {
        for (const h of horarios) {
          await conn.query(
            "INSERT INTO rutina_horarios (rutina_id, dia_semana, hora_inicio, hora_fin, cupo_maximo) VALUES (?, ?, ?, ?, ?)",
            [rutinaId, h.dia_semana, h.hora_inicio, h.hora_fin, h.cupo_maximo || 20]
          );
        }
      }
      if (Array.isArray(ejercicios)) {
        for (let i = 0; i < ejercicios.length; i++) {
          const e = ejercicios[i];
          await conn.query(
            "INSERT INTO ejercicios (rutina_id, nombre, series, repeticiones, descanso_seg, orden) VALUES (?, ?, ?, ?, ?, ?)",
            [rutinaId, e.nombre, e.series || 3, e.repeticiones || "12", e.descanso_seg || 60, i]
          );
        }
      }
      await conn.commit();
      res.status(201).json({ message: "Rutina creada.", id: rutinaId });
    } catch (error) {
      await conn.rollback();
      res.status(500).json({ message: "Error al crear rutina." });
    } finally {
      conn.release();
    }
  });

  app.put("/api/rutinas/:id", authenticateToken, authorize("superadmin", "admin_gym", "entrenador"), async (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion, sucursal_id, entrenador_id, nivel, duracion_minutos, activa, horarios, ejercicios } = req.body;
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      await conn.query(
        `UPDATE rutinas SET nombre=?, descripcion=?, sucursal_id=?, entrenador_id=?, nivel=?, duracion_minutos=?, activa=? WHERE id=?`,
        [nombre, descripcion, sucursal_id, entrenador_id, nivel, duracion_minutos, activa !== undefined ? (activa ? 1 : 0) : 1, id]
      );
      if (Array.isArray(horarios)) {
        await conn.query("DELETE FROM rutina_horarios WHERE rutina_id = ?", [id]);
        for (const h of horarios) {
          await conn.query(
            "INSERT INTO rutina_horarios (rutina_id, dia_semana, hora_inicio, hora_fin, cupo_maximo) VALUES (?, ?, ?, ?, ?)",
            [id, h.dia_semana, h.hora_inicio, h.hora_fin, h.cupo_maximo || 20]
          );
        }
      }
      if (Array.isArray(ejercicios)) {
        await conn.query("DELETE FROM ejercicios WHERE rutina_id = ?", [id]);
        for (let i = 0; i < ejercicios.length; i++) {
          const e = ejercicios[i];
          await conn.query(
            "INSERT INTO ejercicios (rutina_id, nombre, series, repeticiones, descanso_seg, orden) VALUES (?, ?, ?, ?, ?, ?)",
            [id, e.nombre, e.series || 3, e.repeticiones || "12", e.descanso_seg || 60, i]
          );
        }
      }
      await conn.commit();
      res.json({ message: "Rutina actualizada." });
    } catch {
      await conn.rollback();
      res.status(500).json({ message: "Error al actualizar rutina." });
    } finally {
      conn.release();
    }
  });

  app.delete("/api/rutinas/:id", authenticateToken, authorize("superadmin", "admin_gym"), async (req, res) => {
    try {
      await pool.query("DELETE FROM rutinas WHERE id = ?", [req.params.id]);
      res.json({ message: "Rutina eliminada." });
    } catch {
      res.status(500).json({ message: "Error al eliminar rutina." });
    }
  });

  // --- EMPRENDEDORES ---
  app.post("/api/emprendedores", async (req, res) => {
    const { nombre, email, telefono, ciudad, inversion_estimada, mensaje } = req.body;
    if (!nombre || !email) return res.status(400).json({ message: "Nombre y email son requeridos." });
    try {
      const [result] = await pool.query(
        `INSERT INTO emprendedores (nombre, email, telefono, ciudad, inversion_estimada, mensaje) VALUES (?, ?, ?, ?, ?, ?)`,
        [nombre, email, telefono || "", ciudad || "", inversion_estimada || "", mensaje || ""]
      );
      res.status(201).json({ message: "¡Solicitud enviada! Nos contactaremos pronto.", id: result.insertId });
    } catch {
      res.status(500).json({ message: "Error al enviar solicitud." });
    }
  });

  app.get("/api/emprendedores", authenticateToken, authorize("superadmin", "admin_gym", "gerente"), async (req, res) => {
    try {
      const [rows] = await pool.query("SELECT * FROM emprendedores ORDER BY created_at DESC");
      res.json(rows);
    } catch {
      res.status(500).json({ message: "Error al obtener solicitudes." });
    }
  });

  app.put("/api/emprendedores/:id", authenticateToken, authorize("superadmin", "admin_gym"), async (req, res) => {
    const { estado } = req.body;
    try {
      await pool.query("UPDATE emprendedores SET estado = ? WHERE id = ?", [estado, req.params.id]);
      res.json({ message: "Estado actualizado." });
    } catch {
      res.status(500).json({ message: "Error al actualizar solicitud." });
    }
  });

  // --- STAFF / USUARIOS CON ROLES ---
  app.get("/api/staff", authenticateToken, authorize("superadmin", "admin_gym"), async (req, res) => {
    try {
      const [rows] = await pool.query(
        `SELECT u.id, u.username, u.email, u.telefono, u.tipo_usuario,
                r.slug AS rol, r.nombre AS rol_nombre, r.id AS rol_id,
                s.nombre AS sucursal_nombre, u.sucursal_id
         FROM usuarios u
         LEFT JOIN roles r ON u.rol_id = r.id
         LEFT JOIN sucursales s ON u.sucursal_id = s.id
         WHERE u.tipo_usuario = 'staff' OR r.slug != 'cliente'
         ORDER BY r.id, u.username`
      );
      res.json(rows);
    } catch {
      res.status(500).json({ message: "Error al obtener staff." });
    }
  });

  app.post("/api/staff", authenticateToken, authorize("superadmin", "admin_gym"), async (req, res) => {
    const { username, email, password, telefono, rol_id, sucursal_id } = req.body;
    if (!username || !email || !rol_id) {
      return res.status(400).json({ message: "Usuario, email y rol son requeridos." });
    }
    try {
      const hashed = await bcrypt.hash(password || "123456", 10);
      const [result] = await pool.query(
        `INSERT INTO usuarios (username, email, password, telefono, rol_id, sucursal_id, tipo_usuario, estado)
         VALUES (?, ?, ?, ?, ?, ?, 'staff', 'Activo')`,
        [username.trim(), email.trim().toLowerCase(), hashed, telefono || "", rol_id, sucursal_id || null]
      );
      res.status(201).json({ message: "Staff creado.", id: result.insertId });
    } catch (error) {
      if (error.code === "ER_DUP_ENTRY") return res.status(400).json({ message: "Usuario o email ya existe." });
      res.status(500).json({ message: "Error al crear staff." });
    }
  });

  app.put("/api/staff/:id/rol", authenticateToken, authorize("superadmin"), async (req, res) => {
    const { rol_id, sucursal_id, tipo_usuario } = req.body;
    try {
      await pool.query(
        "UPDATE usuarios SET rol_id = ?, sucursal_id = ?, tipo_usuario = ? WHERE id = ?",
        [rol_id, sucursal_id || null, tipo_usuario || "staff", req.params.id]
      );
      res.json({ message: "Rol actualizado." });
    } catch {
      res.status(500).json({ message: "Error al actualizar rol." });
    }
  });

  // --- CHECK-IN ---
  app.post("/api/checkin", authenticateToken, authorize("superadmin", "admin_gym", "recepcionista"), async (req, res) => {
    const { usuario_id, sucursal_id, tipo } = req.body;
    const now = new Date();
    const fecha = now.toISOString().split("T")[0];
    const hora = now.toTimeString().split(" ")[0];
    try {
      await pool.query(
        "INSERT INTO checkins (usuario_id, sucursal_id, tipo, fecha, hora) VALUES (?, ?, ?, ?, ?)",
        [usuario_id, sucursal_id || req.user.sucursal_id, tipo || "entrada", fecha, hora]
      );
      res.status(201).json({ message: `Check-${tipo || "entrada"} registrado.` });
    } catch {
      res.status(500).json({ message: "Error en check-in." });
    }
  });

  // --- CHECK-IN HISTORY ---
  app.get("/api/checkins", authenticateToken, authorize("superadmin", "admin_gym", "recepcionista", "gerente"), async (req, res) => {
    try {
      const [rows] = await pool.query(
        `SELECT c.*, u.username, u.email, s.nombre AS sucursal_nombre
         FROM checkins c
         LEFT JOIN usuarios u ON c.usuario_id = u.id
         LEFT JOIN sucursales s ON c.sucursal_id = s.id
         ORDER BY c.created_at DESC LIMIT 100`
      );
      res.json(rows);
    } catch {
      res.status(500).json({ message: "Error al obtener check-ins." });
    }
  });



  // --- FINANZAS Y CONTABILIDAD ---
  app.get("/api/finanzas", authenticateToken, authorize("superadmin", "admin_gym", "contador", "gerente"), async (req, res) => {
    try {
      const [rows] = await pool.query(
        `SELECT f.*, u.username AS usuario_nombre
         FROM transacciones_finanzas f
         LEFT JOIN usuarios u ON f.usuario_id = u.id
         ORDER BY f.fecha DESC`
      );
      res.json(rows);
    } catch {
      res.status(500).json({ message: "Error al obtener finanzas." });
    }
  });

  app.post("/api/finanzas", authenticateToken, authorize("superadmin", "admin_gym", "contador"), async (req, res) => {
    const { usuario_id, tipo, categoria, monto, descripcion, metodo_pago, fecha } = req.body;
    if (!monto) return res.status(400).json({ message: "El monto es obligatorio." });
    try {
      const dateStr = fecha || new Date().toISOString().split("T")[0];
      const [result] = await pool.query(
        `INSERT INTO transacciones_finanzas (usuario_id, tipo, categoria, monto, descripcion, metodo_pago, fecha)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [usuario_id || null, tipo || "ingreso", categoria || "Membresía", monto, descripcion || "", metodo_pago || "Efectivo", dateStr]
      );
      res.status(201).json({ message: "Transacción registrada.", id: result.insertId });
    } catch {
      res.status(500).json({ message: "Error al guardar transacción." });
    }
  });

  app.get("/api/me", authenticateToken, async (req, res) => {
    try {
      const user = await getUserWithRole(pool, req.user.id);
      if (!user) return res.status(404).json({ message: "Usuario no encontrado." });
      res.json(user);
    } catch {
      res.status(500).json({ message: "Error al obtener perfil." });
    }
  });
}

module.exports = { initExtendedSchema, getUserWithRole, registerGymRoutes, signToken };
