const express = require('express');
const cors = require('cors');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const path = require('path');

const app = express();

const options = {
    swaggerDefinition: {
      info: {
        title: 'API Documentation',
        version: '1.0.0',
        description: 'Documentation for your API',
      },
    },
    apis: [
        './routes/SingUp.js',
        './routes/SingIn.js',
        './routes/edits.js',
        "./routes/twitts.js",
        "./routes/liveChat.js",
        "./routes/liveSpace.js",
    ],
};
const specs = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use(express.static('public'));
//app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({limit: '10mb',  extended: false }));

app.use('/api/singup', require('./routes/SingUp'));
app.use('/api/singin', require('./routes/SingIn'));
app.use('/api/edits', require('./routes/edits'));
app.use("/api/twitts", require("./routes/twitts"));
app.use("/api/liveChat", require("./routes/liveChat"));
app.use("/api/liveSpace", require("./routes/liveSpace"));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

const PORT = process.env.PORT || 4242;
app.listen(PORT, () => console.log("server up en", PORT));