"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const transporterName = process.env.NODE_MAILER_TRANSPORTER_NAME;
const transporterEmails = {
    verificationUserEmail: (to, verificationLink) => ({
        to,
        from: transporterName,
        subject: "Verify your email (online game)",
        text: verificationLink,
        html: `<div style="display: grid; min-height: 500px; height: 100%; min-width: 500px; width: 100%"><a style="text-decoration: none; margin: auto; color: black; font-size: 54px" target="_blank" href="${verificationLink}">VERIFY ME</a></div></div>`
    }),
    changeUserPasswordRequest: (to, changeLink) => ({
        to,
        from: transporterName,
        subject: "Change your password (online game)",
        text: changeLink,
        html: `<div style="display: grid; min-height: 500px; height: 100%; min-width: 500px; width: 100%"><a style="text-decoration: none; margin: auto; color: black; font-size: 54px" target="_blank" href="${changeLink}">CHANGE PASSWORD</a></div></div>`
    }),
};
exports.default = transporterEmails;
