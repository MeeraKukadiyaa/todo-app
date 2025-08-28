const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
// ✅ Allow requests from frontend
app.use(cors({
  origin: ["http://localhost:3000", "https://todo-infotech.vercel.app"], 
  methods: ["GET", "POST"],
  credentials: true
}));
const PORT = 4000;

app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Connection error:", err));

const message = new mongoose.Schema({
  name: String,
  email: String,
  subject: String,
  message: String,
  time: { type: Date, default: Date.now },
});

const Message = mongoose.model("Message", message);

const request = new mongoose.Schema({
  name: String,
  email: String,
  shopwareDevelopment: Boolean,
  updatesMaintenance: Boolean,
  customPluginDevelopment: Boolean,
  themeDevelopment: Boolean,
  other: Boolean,
  projectDescription: String,
  budget: Number,
  time: { type: Date, default: Date.now },
});

const Request = mongoose.model("Request", request);

// Setup nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "meerakukadiya07@gmail.com",
    pass: "ucbo uicl jsrh ssyv",
  },
});

// POST: Save data & send mail
app.post('/api/:endpoint', async (req, res) => {
  try {
    const endpoint = req.params.endpoint;
    let data;
    let mailOptions;

    if (endpoint === "messages") {
      data = new Message(req.body);
      mailOptions = {
        from: data.email,
        to: "meerakukadiya07@gmail.com",
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
      };
    } else if (endpoint === "requests") {
      data = new Request(req.body);
      const serviceKeys = [
        "shopwareDevelopment",
        "updatesMaintenance",
        "customPluginDevelopment",
        "themeDevelopment",
        "other"
      ];
      const selectedServices = serviceKeys
        .filter(key => data[key])
        .map(key => key.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase()))
        .join(", ");

      mailOptions = {
        from: data.email,
        to: "meerakukadiya07@gmail.com",
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
      };
    }
    await data.save();
    await transporter.sendMail(mailOptions);
    res.json({ status: 'saved_and_emailed', data });
  } catch (err) {
    console.error("❌ Error sending email:", err);
    res.status(500).json({ status: 'error', message: 'Failed to send email' });
  }
});

// GET: Fetch data from dynamic endpoint
app.get('/api/:endpoint', async (req, res) => {
  try {
    const endpoint = req.params.endpoint;
    let data;
    if (endpoint === "messages") {
      data = await Message.find().sort({ time: -1 });``
    } else if (endpoint === "requests") {
      data = await Request.find().sort({ time: -1 });
    }
    res.json(data);
  } catch (e) {
    res.status(500).json({ status: "error", message: e.message })
  }
});

app.delete('/api/:endpoint/:id', async (req, res) => {
  try {
    const { endpoint, id } = req.params;
    let Model;
    if (endpoint === "messages") {
      Model = Message;
    } else if (endpoint === "requests") {
      Model = Request;
    } else {
      return res.status(400).json({ status: "error", message: "Invalid endpoint" });
    }
    await Model.findByIdAndDelete(id);
    res.json({ status: "deleted" });
  } catch (e) {
    res.status(500).json({ status: "error", message: e.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
