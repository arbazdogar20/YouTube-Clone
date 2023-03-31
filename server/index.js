require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const db = require('./database/connect');
const authRoute = require('./routes/auth.routes');
const userRoute = require('./routes/users.routes');
const videoRoute = require('./routes/videos.routes');
const commentRoute = require('./routes/comments.routes');

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);

const PORT = process.env.PORT || 8080;

app.use('/api/v1/auth', authRoute);
app.use('/api/v1/users', userRoute);
app.use('/api/v1/videos', videoRoute);
app.use('/api/v1/comments', commentRoute);

// Error Handling
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Something went wrong!';
  return res.status(status).json({
    success: false,
    status,
    message,
  });
});

app.listen(PORT, () => {
  db();
  console.log(`Server Is Running On Port http://localhost:${PORT}`);
});
