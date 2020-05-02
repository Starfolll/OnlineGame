import Mail from "nodemailer/lib/mailer";
import dotenv from "dotenv";


dotenv.config();
const transporterName = process.env.NODE_MAILER_TRANSPORTER_NAME!;
const transporterEmails = {
   verificationUserEmail: (to: string, verificationLink: string): Mail.Options => ({
      to,
      from: transporterName,
      subject: "Verify your email (online game)",
      text: verificationLink,
      html: `<div style="display: grid; min-height: 500px; height: 100%; min-width: 500px; width: 100%"><a style="text-decoration: none; margin: auto; color: black; font-size: 54px" target="_blank" href="${verificationLink}">VERIFY ME</a></div></div>`
   }),
   changeUserPasswordRequest: (to: string, changeLink: string): Mail.Options => ({
      to,
      from: transporterName,
      subject: "Change your password (online game)",
      text: changeLink,
      html: `<div style="display: grid; min-height: 500px; height: 100%; min-width: 500px; width: 100%"><a style="text-decoration: none; margin: auto; color: black; font-size: 54px" target="_blank" href="${changeLink}">CHANGE PASSWORD</a></div></div>`
   }),
};

export default transporterEmails;