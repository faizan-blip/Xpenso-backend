const Auth = require('../models/AuthSchema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const forgotlink = require('./forgotlink');
const AuthSchema = require('../models/AuthSchema');
const sendmessage = require('./sendmessage');
require("dotenv").config()

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

exports.signup = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        status: false,
        message: "Please provide all required fields.",
      });
    }

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        status: false,
        message: "Please provide a valid email address.",
      });
    }

    if (!/^\d{10}$/.test(phone)) {
      return res.status(400).json({
        status: false,
        message: "Please provide a valid 10-digit phone number.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        status: false,
        message: "Password should be at least 6 characters long.",
      });
    }

    const existUser = await Auth.findOne({ email });
    if (existUser) {
      return res.status(409).json({
        status: false,
        message: "User already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await Auth.create({ name, email, phone, password: hashedPassword });

    res.status(201).json({
      status: true,
      data: user,
      message: `${user.name} successfully signed up.`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: false,
      message: "An error occurred while signing up.",
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: false,
        message: "Please provide both email and password.",
      });
    }

    const user = await Auth.findOne({ email });
    if (!user) {
      return res.status(409).json({
        status: false,
        message: "User does not exist.",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        status: false,
        message: "Invalid credentials.",
      });
    }

    const payload = {
      email: user.email,
      id: user._id,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });
    res.status(200).json({
      status: true,
      data: {
        email: user.email,
        id: user._id,
      },
      token: token,
      message: `${user.email} Logged in.`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: false,
      message: "An error occurred while login.",
    });
  }
};

exports.forgotpassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !emailRegex.test(email)) {
      return res.status(400).json({
        status: false,
        message: "Please provide a valid email address.",
      });
    }

    const user = await Auth.findOne({ email });
    if (!user) {
      return res.status(409).json({
        status: false,
        message: "User does not exist.",
      });
    }

    const payload = {
      email: user.email,
      id: user._id,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "5m",
    });
    const link = `http://localhost:3000/forgotpassword/${user._id}/${token}`;
    await forgotlink(link, email);
    res.status(201).json({
      success: true,
      data: link,
      message: "Forgot link send to the mail",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: false,
      message: "An error occurred while login.",
    });
  }
};

exports.resetpassword = async (req, res) => {
  try {
    const { id, token } = req.params;
    const { password, confirmPassword } = req.body;

    if (!token) {
      return res.status(400).json({
        status: false,
        message: "Token is required for password reset.",
      });
    }

    let decodedUserId;

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      decodedUserId = decoded.id;

      // Check if the token has expired
      if (decoded.exp < Date.now() / 1000) {
        return res.status(401).json({
          status: false,
          message: "Token has expired.",
        });
      }

    } catch (err) {
      return res.status(401).json({
        status: false,
        message: "Invalid or expired token.",
      });
    }

    if (decodedUserId !== id) {
      return res.status(401).json({
        status: false,
        message: "Token does not match the user id.",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        status: false,
        message: 'Passwords do not match.',
      });
    }

    const existingUser = await Auth.findById(id);

    if (!existingUser) {
      return res.status(404).json({
        status: false,
        message: 'User not found.',
      });
    }

    const isCurrentPassword = await bcrypt.compare(password, existingUser.password);

    if (isCurrentPassword) {
      return res.status(409).json({
        status: false,
        message: 'Cannot use the current password.',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await Auth.findByIdAndUpdate(id, { password: hashedPassword });

    res.status(200).json({
      status: true,
      data: password,
      message: 'Password reset successful.',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      message: 'An error occurred while resetting the password.',
    });
  }
};

exports.sendmessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const token = req.headers.authorization.split(' ')[1];

    const validToken = await AuthSchema.findOne({ _id: token });

    if (validToken == undefined) {
      return res.status(401).json({
        status: false,
        message: "Please Login to Send Message.",
      });
    }

    const existingUser = await AuthSchema.findOne({ email });

    if (!existingUser) {
      return res.status(409).json({
        status: false,
        message: "Create your account to contact us...",
      });
    }

    const auth = await AuthSchema.find();
    const authEmail = auth[auth.length - 1]?.email;

    await sendmessage(name, email, message, authEmail);

    return res.status(201).json({
      success: true,
      data: { name, email, message },
      message: "We will contact you soon...",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      message: 'An error occurred while sending a message.',
    });
  }
};

