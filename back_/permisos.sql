-- 1. Crear y usar la base de datos
CREATE DATABASE db;
USE db;

-- 2. Crear la tabla usuarios
CREATE TABLE usuarios (
     id UUID PRIMARY KEY DEFAULT UUID(),
     nombre VARCHAR(100) NOT NULL UNIQUE,
     correo VARCHAR(150) NOT NULL UNIQUE,
     contrasena VARCHAR(255) NOT NULL,
     tiene_permisos BOOLEAN NOT NULL DEFAULT FALSE
);

-- 3. Insertar el usuario pedro
INSERT INTO usuarios (nombre, correo, contrasena, tiene_permisos)
VALUES ('Jaime', 'nachomatamala@gmail.com', 'nacho', true);

-- 4. Insertar el usuario db_jaime en la tabla de privilegios globales
INSERT INTO mysql.global_priv (Host, User, Priv)
VALUES ('localhost', 'db_jaime', '{"access":0,"plugin":"mysql_native_password","authentication_string":""}');

-- 5. Recargar privilegios
FLUSH PRIVILEGES;

-- 6. Asignar los permisos específicos a db_jaime sobre la base de datos db
INSERT INTO mysql.db (Host, Db, User, Select_priv, Insert_priv, Update_priv, Delete_priv, Create_priv, Drop_priv, Index_priv, Alter_priv)
VALUES ('localhost', 'db', 'db_jaime', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y');

-- 7. Recargar privilegios nuevamente
FLUSH PRIVILEGES;

--8 Correr bd

deno run --allow-net --allow-env --allow-read --allow-sys --node-modules-dir=none main.js