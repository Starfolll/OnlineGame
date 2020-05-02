import nodemailer from "nodemailer"
import dotenv from "dotenv";


//https://ethereal.email/messages
dotenv.config();
const transporterEmail = process.env.NODE_MAILER_TRANSPORTER_EMAIL!;
const transporterPassword = process.env.NODE_MAILER_TRANSPORTER_PASSWORD!;
const isUsingGmail = process.env.NODE_MAILER_TRANSPORTER_IS_SERVICE_GMAIL! === "true";

const emailTransporter = isUsingGmail ?
    nodemailer.createTransport({
        "host": "smtp.gmail.com",
        "port": 465,
        auth: {
            user: transporterEmail,
            pass: transporterPassword
        }
    }) :
    nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        auth: {
            user: transporterEmail,
            pass: transporterPassword
        }
    });

export default emailTransporter;