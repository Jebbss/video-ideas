const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

//user log in route
router.get('/login', (req, res) => {
  res.render('users/login');
});

//user register route
router.get('/register', (req, res) => {
  res.render('users/register');
});


module.exports = router;
