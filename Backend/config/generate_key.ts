import { generateKeySync, privateDecrypt, constants } from 'crypto'
import { privateKey } from '../config/crypto.config';
import dotenv from 'dotenv';
dotenv.config();

const exported = Buffer.from(process.env.ENCRYPTED_SYMETRIC_KEY!, 'hex');
console.log(exported);
const encryptedKey = privateDecrypt(
    {
        key: privateKey,
        passphrase: process.env.PASSPHRASE!,
        padding: constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256',
    },
    exported
);
console.log("Encrypted key", encryptedKey.toString('hex'));
