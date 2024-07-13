import express from 'express';
import createHttpError from 'http-errors';

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// 404 handler
app.use((req, res, next) => {
  next(createHttpError(404, 'Not found'));
});

// error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});

export default app;
