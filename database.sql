--Creacion de la base de datos
CREATE DATABASE crud_students;

--Utilizar la base de datos creada
USE crud_students;

--Creacion de la tabla estudiantes con sus datos
CREATE TABLE students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cedula VARCHAR(20) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    correo VARCHAR(100) UNIQUE NOT NULL,
    carrera VARCHAR(100),
    edad INT
);

