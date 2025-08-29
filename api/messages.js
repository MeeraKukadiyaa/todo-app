import connectDB from "../src/lib/mongodb";
import Message from "../src/models/messages";
import nodemailer from "nodemailer";

export default async function handler(req, res) {
  await connectDB();

  if (req.method === "POST") {
    try {
      const data = new Message(req.body);
      await data.save();

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: data.email,
        to: process.env.EMAIL,
        subject: `New message from ${data.name} - ${data.subject}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Subject:</strong> ${data.subject}</p>
          <p><strong>Message:</strong> ${data.message}</p>
          <hr/>
          <p><small>Sent at: ${new Date().toLocaleString()}</small></p>
        `,
      });

      res.status(200).json({ status: "saved_and_emailed", data });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else if (req.method === "GET") {
    try {
      const messages = await Message.find().sort({ time: -1 });
      res.status(200).json(messages);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else if (req.method === "DELETE") {
    try {
      const { id } = req.query;
      await Message.findByIdAndDelete(id);
      res.status(200).json({ status: "deleted" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
