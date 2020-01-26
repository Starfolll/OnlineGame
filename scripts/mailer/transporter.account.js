"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const transporterName = process.env.NODE_MAILER_TRANSPORTER_NAME;
const transporterEmail = process.env.NODE_MAILER_TRANSPORTER_EMAIL;
const transporterPassword = process.env.NODE_MAILER_TRANSPORTER_PASSWORD;
const isUsingGmail = process.env.NODE_MAILER_TRANSPORTER_IS_SERVICE_GMAIL === "true";
const emailTransporter = isUsingGmail ?
    nodemailer_1.default.createTransport({
        "host": "smtp.gmail.com",
        "port": 465,
        auth: {
            user: transporterEmail,
            pass: transporterPassword
        }
    }) :
    nodemailer_1.default.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        auth: {
            user: transporterEmail,
            pass: transporterPassword
        }
    });
exports.default = emailTransporter;
