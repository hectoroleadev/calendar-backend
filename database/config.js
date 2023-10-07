const mongoose = require('mongoose');

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.DB_CONNECTION);
    console.log('Mongodb connected');
  } catch (error) {
    console.log(error);
    throw new Error('Unable to connect to Mongodb');
  }
};

module.exports = {
  dbConnection,
};
