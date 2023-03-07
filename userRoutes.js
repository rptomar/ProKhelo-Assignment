const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./userSchema');

const router = express.Router();

// Login endpoint
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Check if user exists in database
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password 1' });
  }

  // Compare password with stored hash
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(401).json({ error: 'Invalid email or password 2' });
  }

  // Generate JWT token
  const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET);

  res.json({ token });
});

// Create user endpoint
router.post('/users', async (req, res) => {
  const { email, password, name, age, city } = req.body;

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    email,
    password: hashedPassword,
    name,
    age,
    city
  });

  try {
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update user endpoint
router.put('/users/:id', async (req, res) => {
  const { name, age, city } = req.body;

  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.name = name;
    user.age = age;
    user.city = city;

    await user.save();

    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all users endpoint
router.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
