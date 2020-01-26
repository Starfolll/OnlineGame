"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const transporterEmails = {
    verificationUserEmail: (to, verificationLink) => ({
        to,
        from: "BOT",
        subject: "Verify your email (online game)",
        text: verificationLink,
        html: `<div style="display: grid; min-height: 500px; height: 100%; min-width: 500px; width: 100%"><a style="text-decoration: none; margin: auto; color: black; font-size: 54px" href="${verificationLink}">VERIFY ME</a></div></div>`
    }),
};
exports.default = transporterEmails;
