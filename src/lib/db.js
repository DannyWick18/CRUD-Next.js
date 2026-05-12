import mysql from 'mysql2/promise' //Importamos la libreria 

const pool = mysql.createPool({ //Un pool es un conjunto de conexiones reutilizables a la base de datos.
   //Tomamos los datos del archivo .env.local, de esta manera se evita riesgo de seguridad
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

export default pool; //Finalmente lo exportamos para poder usar el pool en otros archivos 