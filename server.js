const mongoose = require('mongoose');
const app = require('./app');
// fGzeRwSWmSTggUGk

const DB_HOST =
  'mongodb+srv://tarik2454:fGzeRwSWmSTggUGk@cluster0.qhdukbs.mongodb.net/goit-nodejs-hw-rest-api?retryWrites=true&w=majority';

mongoose
  .connect(DB_HOST)
  .then(() => {
    app.listen(3000, () => {
      console.log(
        'Database connection successful. Server running. Use our API on port: 3000'
      );
    });
  })
  .catch(error => {
    console.warn(error.message);
    process.exit(1);
  });
