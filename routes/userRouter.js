const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/user')
const bcrypt = require('bcryptjs');

router.get('/login', (req, res) => {
  res.render('login')
})

router.get('/signup', (req, res) => {
  res.render('signup')
})

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) return res.status(401).send('Invalid username or password');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).send('Invalid username or password');

    const payload = { sub: user._id, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    req.session.user = { id: user._id, username: user.username, role: user.role, token };

    if (user.role === 'Student') {
      return res.redirect('/students/studentHome');
    } else if (user.role === 'Admin') {
      return res.redirect('/admin/listRegistrations');
    } else {
      return res.status(403).send('Unknown role');
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});


router.post('/signup', async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const createdUser = new User({ username, password: hashed });
    await createdUser.save()
    const payload = { id: createdUser._id };
    res.status(201).send('User created successfully: ' + createdUser._id);
  } catch (err) {
    res.status(500).send(err.message);
  }
});
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send('Logout failed');
    }
    res.redirect('/users/login');
  });
});
module.exports = router;
