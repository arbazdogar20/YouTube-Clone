const mongoose = require('mongoose');

const db = () => {
  mongoose
    .connect(process.env.MONGODB_URL)
    .then(() => console.log('Database Connected'))
    .catch((e) => console.log(e));
};

module.exports = db;
