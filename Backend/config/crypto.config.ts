import crypto from 'crypto';
import fileSystem from 'fs';
import dotenv from 'dotenv';
dotenv.config();
//Llave privada encriptada
export const privateKey = fileSystem.readFileSync('private_encrypted.pem', 'utf8');

//Llave pública en texto plano
export const publicKey = fileSystem.readFileSync('public.pem', 'utf8');

//Desencriptar llave simétrica
export const aesKey = crypto.privateDecrypt(
    {
        key: privateKey,
        passphrase: process.env.PASSPHRASE!, //Contraseña para desencriptar la llave privada
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256',
    },
    Buffer.from(process.env.ENCRYPTED_AES_KEY!, 'hex') //Criptograma de la clave simétrica
);