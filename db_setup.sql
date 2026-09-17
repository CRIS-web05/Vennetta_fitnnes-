-- SCRIPT DE INICIALIZACIÓN DE BASE DE DATOS PARA MYSQL WORKBENCH
-- NOTA IMPORTANTE: La conexión en Workbench debe ser al puerto 3310 (MySQL de XAMPP)
-- Usuario: root | Contraseña: 123456

-- 1. Crear la base de datos si no existe
CREATE DATABASE IF NOT EXISTS gym;

-- 2. Usar la base de datos creada
USE gym;

-- 3. Crear la tabla de usuarios con campos completos de membresía y administración
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
);

-- Opcional: Insertar un usuario administrador de prueba
INSERT INTO usuarios (username, email, password, telefono, plan, estado, horario, observaciones, fecha, hora) 
VALUES ('admin', 'admin@gym.com', '$2b$10$iGmQ1sH43khBitBv7hkBpeKh/t/HwFjjSCx/4cfeGJMq5T9FKl0XW', '0987654321', 'Anual', 'Activo', 'Mañana', 'Usuario Administrador del sistema', CURRENT_DATE(), CURRENT_TIME())
ON DUPLICATE KEY UPDATE username=username;

-- Verificar los registros creados
SELECT * FROM usuarios;


