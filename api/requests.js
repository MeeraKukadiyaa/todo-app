import nodemailer from "nodemailer";
import connectDB from "../src/lib/mongodb.js";
import Request from "../src/models/requests.js";

export default async function handler(req, res) {
  await connectDB();

  if (req.method === "POST") {
    try {
      const data = new Request(req.body);
      await data.save();

      const serviceKeys = [
        "shopwareDevelopment",
        "updatesMaintenance",
        "customPluginDevelopment",
        "themeDevelopment",
        "other",
      ];
      const selectedServices = serviceKeys
        .filter((key) => data[key])
        .map((key) =>
          key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())
        )
        .join(", ");

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
        subject: `New quote request from ${data.name}`,
        html: `
          <h2>New Quote Request</h2>
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Project Description:</strong> ${data.projectDescription}</p>
          <p><strong>Budget:</strong> $${data.budget}</p>
          <p><strong>Selected Services:</strong> ${selectedServices || "None"}</p>
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
      const requests = await Request.find().sort({ time: -1 });
      res.status(200).json(requests);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else if (req.method === "PUT") {
    try {
      const { id } = req.query;
      const updated = await Request.findByIdAndUpdate(id, req.body, {
        new: true, runValidators: true
      });
      if (!updated) return res.status(404).json({ error: "Request not found" });
      res.status(200).json({ status: "updated", data: updated });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else if (req.method === "DELETE") {
    try {
      const { id } = req.query;
      await Request.findByIdAndDelete(id);
      res.status(200).json({ status: "deleted" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
