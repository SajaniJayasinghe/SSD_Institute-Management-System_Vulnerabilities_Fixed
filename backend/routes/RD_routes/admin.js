const express = require("express");
const router = require("express").Router();
const admin = require("../../models/RD_models/admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const adminauth = require("../../middleware/adminauth");
const createDOMPurify = require("dompurify");
const { JSDOM } = require("jsdom");

const window = new JSDOM("").window;
const DOMPurify = createDOMPurify(window);

// Admin signup
router.post("/adminsignup", async (req, res) => {
  try {
    const { adminName, email, pwd, NIC, phone } = req.body;

    let existingAdmin = await admin.findOne({ email: email });
    if (existingAdmin) {
      throw new Error("Admin already exists");
    }

    const adminData = {
      adminName: DOMPurify.sanitize(adminName),
      email: DOMPurify.sanitize(email),
      pwd: pwd,
      NIC: DOMPurify.sanitize(NIC),
      phone: DOMPurify.sanitize(phone),
    };

    const newAdmin = new admin(adminData);
    await newAdmin.save();
    const token = await newAdmin.generateAuthToken();

    // Sanitize user data before sending it to the client
    const sanitizedAdmin = {
      adminName: DOMPurify.sanitize(newAdmin.adminName),
      email: DOMPurify.sanitize(newAdmin.email),
      NIC: DOMPurify.sanitize(newAdmin.NIC),
      phone: DOMPurify.sanitize(newAdmin.phone),
    };

    res.status(201).send({
      status: "New Admin Created",
      admin: sanitizedAdmin,
      token: token,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ error: error.message });
  }
});

// Admin login
router.post("/adminsignin", async (req, res) => {
  try {
    const { email, pwd } = req.body;
    const foundAdmin = await admin.findByCredentials(email, pwd);
    const token = await foundAdmin.generateAuthToken();

    // Sanitize user data before sending it to the client
    const sanitizedAdmin = {
      adminName: DOMPurify.sanitize(foundAdmin.adminName),
      email: DOMPurify.sanitize(foundAdmin.email),
      NIC: DOMPurify.sanitize(foundAdmin.NIC),
      phone: DOMPurify.sanitize(foundAdmin.phone),
    };

    res.status(200).send({ token: token, Adm: sanitizedAdmin });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ error: "Internal server error" });
  }
});

// Get admin profile
router.get("/adminprofile", adminauth, async (req, res) => {
  try {
    // Sanitize user data before sending it to the client
    const sanitizedAdmin = {
      adminName: DOMPurify.sanitize(req.Adm.adminName),
      email: DOMPurify.sanitize(req.Adm.email),
      NIC: DOMPurify.sanitize(req.Adm.NIC),
      phone: DOMPurify.sanitize(req.Adm.phone),
    };

    res.status(201).send({ success: "Admin Logged In", Adm: sanitizedAdmin });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ error: "Internal server error" });
  }
});

// Logout admin
router.post("/adminlogout", adminauth, async (req, res) => {
  try {
    req.Adm.tokens = req.Adm.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.Adm.save();
    res.status(200).send("Logout successfully");
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ error: "Internal server error" });
  }
});

// Update admin profile
router.put("/adminupdate", adminauth, async (req, res) => {
  try {
    const { adminName, email, phone, NIC } = req.body;

    let Adm = await admin.findOne({ email });
    if (!Adm) {
      throw new Error("There is no admin account");
    }

    const adminUpdate = await admin.findByIdAndUpdate(req.Adm.id, {
      adminName: DOMPurify.sanitize(adminName),
      email: DOMPurify.sanitize(email),
      phone: DOMPurify.sanitize(phone),
      NIC: DOMPurify.sanitize(NIC),
    });

    res.status(200).send({ status: "Admin Profile Updated", Adm: adminUpdate });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ error: "Internal server error" });
  }
});

// Delete admin account
router.delete("/admindelete", adminauth, async (req, res) => {
  try {
    const Adm = await admin.findById(req.Adm.id);
    if (!Adm) {
      throw new Error("There is no admin to delete");
    }
    const deleteProfile = await admin.findByIdAndDelete(req.Adm.id);
    res.status(200).send({ status: "Admin deleted", Adm: deleteProfile });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ error: "Internal server error" });
  }
});

module.exports = router;
