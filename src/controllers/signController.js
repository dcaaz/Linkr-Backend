import connectionDB from "../database/db.js";
import bcrypt from 'bcrypt';
import { v4 as uuid } from "uuid";

export async function postSignup(req, res) {

    const dataSignup = req.dataUser;

    try {

        let encryptPassword = bcrypt.hashSync(dataSignup.password, 12);

        await connectionDB.query('INSERT INTO users (email, password, username, "picture_url") VALUES ($1, $2, $3, $4);',
            [dataSignup.email, encryptPassword, dataSignup.username, dataSignup.picture]);

        return res.sendStatus(201);

    } catch (err) {
        console.log("err postSignup", err.message);
        return res.status(500).send('Server not running');
    }
}

export async function postSignin(req, res) {
    const dataSignin = req.dataUser;
    const token = uuid();

    try {

        const userId = await connectionDB.query('SELECT id FROM users WHERE email=$1;', [dataSignin.email]);

        await connectionDB.query('INSERT INTO sessions (user_id, token) VALUES ($1, $2);', [userId.rows[0].id, token]);

        console.log("token", token);
        
        return res.sendStatus(200);
    }
    catch (err) {
        console.log("err postSignin", err.message);
        return res.status(500).send('Server not running');
    }
}
