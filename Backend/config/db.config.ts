import mysql, { ConnectionOptions } from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();
const options: ConnectionOptions = {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT!),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
}
const conection = mysql.createConnection(options);
conection.connect((err) => {
  if (err) {
    console.error("Error al conectar a la base de datos:", err);
    return;
  }
  console.log("Conexión exitosa");
});

export default conection;