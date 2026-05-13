import pool from '@/lib/db'
// Importamos el archivo con la conexión a la base de datos

// CREATE
// Trabajamos con funciones export = permite usarla en otros archivos
// Utilizamos el await para que JS espere las respuestas API
export async function createStudents(student) {

    const {
        cedula,
        nombre,
        apellido,
        correo,
        carrera,
        edad
    } = student

    const [result] = await pool.query(
        `INSERT INTO students
        (
        cedula,
        nombre,
        apellido,
        correo,
        carrera,
        edad
        )
        VALUES (?, ?, ?, ?, ?, ?)`,
        [
            cedula,
            nombre,
            apellido,
            correo,
            carrera,
            edad
        ]
    );
    return result;
}

// READ
export async function getStudents(id) {
    const [rows] = await pool.query(
        `SELECT * FROM students`,
    );
    return rows;
}

// UPDATE
export async function updateStudent(id, student) {
    const {
        nombre,
        apellido,
        correo,
        carrera,
        edad
    } = student;

    const [result] = await pool.query(
        `UPDATE students
        SET
            nombre = ?,
            apellido = ?,
            correo = ?,
            carrera = ?,
            edad = ?
        WHERE id = ?`,
        [
            nombre,
            apellido,
            correo,
            carrera,
            edad,
            id
        ]
    );
    return result; 

}

// DELETE
export async function deleteStudent(id) {
    const [result] = await pool.query(
        'DELETE FROM students WHERE id=?',
        [id]
    );
    return result;
}