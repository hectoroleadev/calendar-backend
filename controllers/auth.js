const { response } = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { generateJWT } = require('../helpers/jwt');

const login = async (request, res = response) => {
  const { email, password } = request.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'User is not valid' });
    }

    const validPassword = bcrypt.compareSync(password, user.password);

    if (!validPassword) {
      return res.status(400).json({ message: 'Password is not valid' });
    }

    const token = await generateJWT(user.id, user.name);

    res.status(200).json({
      uid: user.id,
      name: user.name,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Please, contact to your admin' });
  }
};

const register = async (request, res = response) => {
  const { name, email, password } = request.body;

  let user = await User.findOne({ email });

  if (user) {
    return res.status(400).json({ message: 'User already exist' });
  }
  user = new User({ name, email, password });

  const salt = bcrypt.genSaltSync();
  user.password = bcrypt.hashSync(password, salt);

  try {
    await user.save();
    const token = await generateJWT(user.id, user.name);
    res.status(201).json({ uid: user.id, name: user.name, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Please, contact to your admin' });
  }
};

const renew = async (request, res = response) => {
  const { uid, name } = request;

  const token = await generateJWT(uid, name);

  res.status(200).json({ token, uid, name });
};

module.exports = {
  login,
  register,
  renew,
};
