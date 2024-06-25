const { response } = require('express');
const jwt = require('jsonwebtoken');

const jwtValidator = (request, res = response, next) => {
  const token = request.header('x-token');

  if (!token) {
    return res.status(401).json({
      message: 'Missing request token',
    });
  }

  try {
    const { uid, name } = jwt.verify(token, process.env.SECRET_JWT_SEED);
    request.uid = uid;
    request.name = name;
  } catch (error) {
    return res.status(401).json({
      message: 'Invalid token',
    });
  }

  next();
};

module.exports = {
  jwtValidator,
};
