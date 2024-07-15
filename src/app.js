import express from 'express';
import createHttpError from 'http-errors';
import ApiResponse from './common/ApiResponse.js';
import sampleRoutes from './sample/sample.route.js';

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

//* GET / Introduction
app.get('/', (req, res) => {
  res.send(
    new ApiResponse({
      statusCode: 200,
      success: true,
      message: 'microservice-template-nodejs-js',
      data: 'A backend template made using Node.js, Express.js, and JavaScript for building REST API based microservices.',
    }),
  );
});

app.use('/api/samples', sampleRoutes);

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
