import connectionDB from "../database/db.js";
import { signupSchema } from "../models/signupModel.js";

export async function signupValidation(req, res, next) {

    const dataSignup = req.body;

    try {

        const { error } = signupSchema.validate(dataSignup, { abortEarly: false });

        if (error) {
            const errors = error.details.map(detail => detail.message);
            return res.status(422).send(errors);
        }

        const userExist = await connectionDB.query("SELECT * FROM users WHERE email=$1", [dataSignup.email]);

        if (userExist.rowCount > 0) {
            return res.status(409).send("E-mail já cadastrado :)");
        }

        req.dataUser = dataSignup;
        next();

    } catch (err) {
        console.log("err signupValidation", err.message);
        res.status(500).send('Server not running');
    }
}