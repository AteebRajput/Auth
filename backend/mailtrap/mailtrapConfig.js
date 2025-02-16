import dotenv from "dotenv";
import { MailtrapClient } from "mailtrap";


const result = dotenv.config({ path: '../.env' });
// Initialize the Mailtrap client
export const mailtrapClient = new MailtrapClient({ token: process.env.TOKEN });

export const sender = {
  email: "hello@demomailtrap.com",
  name: "Mailtrap Test",
};
