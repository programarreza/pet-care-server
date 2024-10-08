import nodemailer from "nodemailer";
import config from "../config";

export const sendEmail = async (to: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com.",
    port: 587,
    secure: config.NODE_ENV === "production", // Use `true` for port 465, `false` for all other ports
    auth: {
      user: "programarreza@gmail.com",
      pass: "xxfr rkdw crkl zpbr",
    },
  });

  await transporter.sendMail({
    from: "programarreza@gmail.com", // sender address
    to, // list of receivers
    subject: "Password change kro", // Subject line
    text: "Reset your password within ten mins", // plain text body
    html, // html body
  });
};
