require("dotenv").config({ path: "./.env" });
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();

const server = require("http").createServer(app);

app.use(express.json({ limit: "30mb" }));

const APP_URL = process.env.APP_VERSION_URL
const CONNECTION_URL = process.env.DB_URL;
const PORT = process.env.T_PORT || 8000;

server.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});


app.use(cors());

//stop server crashing even if db connection failed
process.on("unhandledRejection", (err, promise) => {
    console.log(`Logged Error: ${err}`);
    server.close(() => process.exit(1));
});

//swagger setup
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Monnit Swagger API',
            version: '1.0.0',
            description: 'Test the Monnit Routes with Swagger',
        },
        servers: [
            {
                url: 'http://localhost:8000',
                description: 'Development server',
            },
        ],
        securityDefinitions: {
            bearerAuth: {
                type: 'apiKey',
                name: 'Authorization',
                scheme: 'bearer',
                in: 'header',
            },
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    value: 'Bearer <JWT token here>',
                },
            },
        },
    },
    apis: ['./routes/*.js'], // Add your route file paths here
    security: [
        {
            bearerAuth: [],
        },
    ],
};


const swaggerSpec = swaggerJSDoc(swaggerOptions);

//swagger route
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    explorer: true,
    swaggerOptions: {
        securityDefinitions: {
            bearerAuth: {
                type: 'apiKey',
                in: 'header',
                name: 'Authorization',
                description: 'Bearer token',
            },
        },
    },
}));


//routers
app.use(`${APP_URL}/public/ping`, (req, res, next) => { return res.status(200).json({'message':'Pong'}) })


//db connection
mongoose
    .connect(CONNECTION_URL, {
        useNewUrlParser: true, useUnifiedTopology: true
    })
    .then(() => {
        console.log("DB connection successful");
    })
    .catch((err) => {
        console.log(err);
    });
