require('dotenv').config();
require('express-async-errors');


const authRoute = require('./routes/auth');
const subscribersRoute = require('./routes/subscribers');
const express = require('express');


const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const logger = require('./logFile/logger'); // import the logger

const errorMiddleware = require('./middleware/error-Handler');
const notFoundMiddleware = require('./middleware/not-found');

const app = express();

app.use(express.json()); // Make sure to include this if you handle JSON requests
app.use('/api/v1', subscribersRoute);
app.use('/api/v1/auth', authRoute);

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: " Subscribers  API ",
            version: "1.0.0"
           
        },
        components: {
            securitySchemes: {
              BearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT', // Optional: specify if using JWT
              },
            },
          },
          security: [
            {
              BearerAuth: [],
            },
          ],
        servers : [
            {
              url: "http://localhost:5000/"
            }
          ],
    },
    apis: ["./routes/*.js"],
};

const specs = swaggerJsdoc(options);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
app.use(errorMiddleware);
app.use(notFoundMiddleware);

app.use((req, res, next) => {
    logger.info(`Incoming request: ${req.method} ${req.url}`);
    next();
});



// Catch-all route for handling undefined routes
app.use((req, res, next) => {
    logger.warn(`Route does not exist: ${req.method} ${req.url}`);
    res.status(404).send('Route does not exist');
});

// Error handling middleware
app.use((err, req, res, next) => {
    logger.error(`Error: ${err.message}, Stack: ${err.stack}`);
    res.status(500).send('Something broke!');
});
const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`The server is listening on ${port}`);
});
