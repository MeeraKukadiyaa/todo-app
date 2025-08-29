// const express = require('express');
// const cors = require('cors');
// const nodemailer = require('nodemailer');
// const mongoose = require('mongoose');
// require('dotenv').config();

// const requestsRouter = require("./routes/requests");
// const messagesRouter = require("./routes/messages");

// const app = express();
// // ✅ Allow requests from frontend
// app.use(cors());
// const PORT = 4000;

// app.use(express.json());

// mongoose
//   .connect(process.env.MONGODB_URI)
//   .then(() => console.log("Connected to MongoDB"))
//   .catch((err) => console.error("Connection error:", err));

// const message = new mongoose.Schema({
//   name: String,
//   email: String,
//   subject: String,
//   message: String,
//   time: { type: Date, default: Date.now },
// });

// const Message = mongoose.model("Message", message);

// const request = new mongoose.Schema({
//   name: String,
//   email: String,
//   shopwareDevelopment: Boolean,
//   updatesMaintenance: Boolean,
//   customPluginDevelopment: Boolean,
//   themeDevelopment: Boolean,
//   other: Boolean,
//   projectDescription: String,
//   budget: Number,
//   time: { type: Date, default: Date.now },
// });

// const Request = mongoose.model("Request", request);

// // Setup nodemailer transporter
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: "meerakukadiya07@gmail.com",
//     pass: "ucbo uicl jsrh ssyv",
//   },
// });

// // POST: Save data & send mail
// app.post('/api/:endpoint', async (req, res) => {
//   try {
//     const endpoint = req.params.endpoint;
//     let data;
//     let mailOptions;

//     if (endpoint === "messages") {
//       data = new Message(req.body);
//       mailOptions = {
//         from: data.email,
//         to: "meerakukadiya07@gmail.com",
//         subject: `New message from ${data.name} - ${data.subject}`,
//         html: `
//           <h2>New Contact Form Submission</h2>
//           <p><strong>Name:</strong> ${data.name}</p>
//           <p><strong>Email:</strong> ${data.email}</p>
//           <p><strong>Subject:</strong> ${data.subject}</p>
//           <p><strong>Message:</strong> ${data.message}</p>
//           <hr/>
//           <p><small>Sent at: ${new Date().toLocaleString()}</small></p>
//         `,
//       };
//     } else if (endpoint === "requests") {
//       data = new Request(req.body);
//       const serviceKeys = [
//         "shopwareDevelopment",
//         "updatesMaintenance",
//         "customPluginDevelopment",
//         "themeDevelopment",
//         "other"
//       ];
//       const selectedServices = serviceKeys
//         .filter(key => data[key])
//         .map(key => key.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase()))
//         .join(", ");

//       mailOptions = {
//         from: data.email,
//         to: "meerakukadiya07@gmail.com",
//         subject: `New quote request from ${data.name}`,
//         html: `
//           <h2>New Quote Request</h2>
//           <p><strong>Name:</strong> ${data.name}</p>
//           <p><strong>Email:</strong> ${data.email}</p>
//           <p><strong>Project Description:</strong> ${data.projectDescription}</p>
//           <p><strong>Budget:</strong> $${data.budget}</p>
//           <p><strong>Selected Services:</strong> ${selectedServices || "None"}</p>
//           <hr/>
//           <p><small>Sent at: ${new Date().toLocaleString()}</small></p>
//         `,
//       };
//     }
//     await data.save();
//     await transporter.sendMail(mailOptions);
//     res.json({ status: 'saved_and_emailed', data });
//   } catch (err) {
//     console.error("❌ Error sending email:", err);
//     res.status(500).json({ status: 'error', message: 'Failed to send email' });
//   }
// });

// // GET: Fetch data from dynamic endpoint
// app.get('/api/:endpoint', async (req, res) => {
//   try {
//     const endpoint = req.params.endpoint;
//     let data;
//     if (endpoint === "messages") {
//       data = await Message.find().sort({ time: -1 });``
//     } else if (endpoint === "requests") {
//       data = await Request.find().sort({ time: -1 });
//     }
//     res.json(data);
//   } catch (e) {
//     res.status(500).json({ status: "error", message: e.message })
//   }
// });

// app.delete('/api/:endpoint/:id', async (req, res) => {
//   try {
//     const { endpoint, id } = req.params;
//     let Model;
//     if (endpoint === "messages") {
//       Model = Message;
//     } else if (endpoint === "requests") {
//       Model = Request;
//     } else {
//       return res.status(400).json({ status: "error", message: "Invalid endpoint" });
//     }
//     await Model.findByIdAndDelete(id);
//     res.json({ status: "deleted" });
//   } catch (e) {
//     res.status(500).json({ status: "error", message: e.message });
//   }
// });

// // Start server
// app.listen(PORT, () => {
//   console.log(`🚀 Server running at http://localhost:${PORT}`);
// });





// const express = require("express");
// const cors = require("cors");
// const mongoose = require("mongoose");
// const nodemailer = require("nodemailer");
// require("dotenv").config();

import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import nodemailer from "nodemailer";
import path from "path";
import { fileURLToPath } from "url";
import Message from "./src/models/messages.js";
import Request from "./src/models/requests.js";
dotenv.config({ debug: false });


// const Request = require("./src/models/requests");
// const Message = require("./src/models/messages");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// Nodemailer Transport
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

// REQUESTS ROUTES

// POST /api/requests
app.post("/api/requests", async (req, res) => {
  try {
    const request = new Request(req.body);
    await request.save();

    // Send email notification
    await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.EMAIL}>`,
      to: process.env.EMAIL,
      subject: "📩 New Service Request",
      text: `New request received from ${req.body.name} (${req.body.email}).\n\nDetails: ${JSON.stringify(req.body, null, 2)}`,
    });

    res.status(200).json({ status: "saved", request });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/requests
app.get("/api/requests", async (req, res) => {
  try {
    const requests = await Request.find().sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/requests/:id
app.delete("/api/requests/:id", async (req, res) => {
  try {
    await Request.findByIdAndDelete(req.params.id);
    res.json({ status: "deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// MESSAGES ROUTES

// POST /api/messages
app.post("/api/messages", async (req, res) => {
  try {
    const message = new Message(req.body);
    await message.save();

    // Send email notification
    await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.EMAIL}>`,
      to: process.env.EMAIL,
      subject: "📩 New Message",
      text: `New message from ${req.body.name} (${req.body.email}):\n\n${req.body.message}`,
    });

    res.status(200).json({ status: "saved", message });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/messages
app.get("/api/messages", async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/messages/:id
app.delete("/api/messages/:id", async (req, res) => {
  try {
    await Message.findByIdAndDelete(req.params.id);
    res.json({ status: "deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the React build folder
app.use(express.static(path.join(__dirname, "build")));

// SPA fallback — send index.html for all non-API routes
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});


// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
