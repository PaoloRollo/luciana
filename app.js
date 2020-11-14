// External basic imports
const express = require('express');
const cors = require('cors');
// Internal basic imports
const { ApiParser, MiddlewaresParser, ModelsParser } = require('./utils');

module.exports = {
    startApp: new Promise(async (resolve, reject) => {
        try {
            // Create express app
            let app = express();
            app.disable('etag').disable('x-powered-by');
            // CORS Setup
            const corsOptions = {
                origin: '*',
                optionSuccessStatus: 200
            };
            // CORS middleware
            app.use(cors(corsOptions));
            // Bodyparser JSON
            app.use(express.json({limit: '10mb'}));
            app.use(express.urlencoded({limit: '10mb', extended: true}));
            // Enable trust proxy
            app.enable('trust proxy');
            // Load the models using the parser
            const models = await ModelsParser.parse(process.env.MODELS_CONFIG);
            // Setup the API
            app = await ApiParser.parse(app, models, process.env.API_CONFIG);
            // Setup the middlewares
            app = await MiddlewaresParser.parse(app, process.env.MIDDLEWARES_CONFIG);
            resolve(app);
        } catch (error) {
            console.error(error);
            reject(error);
        }
    }),
};