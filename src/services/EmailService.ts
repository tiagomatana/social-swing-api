import nodemailer from 'nodemailer'
import Logger from "../interfaces/Logger";
import EmailInterface from "../interfaces/EmailInterface";
const user = process.env.USER_EMAIL as string;
const pass = process.env.USER_EMAIL_PASS as string;

const transporter = nodemailer.createTransport({
  host: process.env.USER_EMAIL_SMTP,
  port: 587,
  auth: {
    user, pass
  }
});

export default {
  async send(data:EmailInterface) {
    return await transporter.sendMail({
      from: user,
      to: data.email,
      replyTo: user,
      subject: data.subject,
      html: data.body
    }).then(info => {
      Logger.info(info);
    }).catch(error => {
      Logger.error(error);
    })
  }
}
