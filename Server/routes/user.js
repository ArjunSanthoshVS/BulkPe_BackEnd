require('dotenv').config()
const express = require('express');
const User = require('../model/userSchema');
const bcrypt = require('bcrypt')
const jwt=require('jsonwebtoken');
const middleware = require('../middleware/middleware');
const UPI = require('../model/upiSchema');
const router = express.Router();


router.post('/register', async (req, res, next) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body?.password, 10)
    const newUser = await User.create({ ...req.body, password: hashedPassword })
    res.status(201).json({ newUser, message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error while registering user' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Authentication failed' });
    }
    const isPasswordValid = await bcrypt.compare(password, user?.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Authentication failed' });
    }
    const token = jwt.sign({ userId: user?._id }, process.env.SECRET, {
      expiresIn: '10h',
    });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Error while logging in' });
  }
});

router.get('/details', middleware, async (req, res) => {
  const response = await UPI.find()
  res.status(200).json({response})
})

module.exports = router;
