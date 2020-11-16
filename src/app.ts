// External basic imports
import express, { Application } from 'express';
import cors from 'cors';
// Internal basic imports
import utils from './utils';

export default async function startApp() {
    try {
        // Create express app
        const app: Application = express();
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
        const models = await utils.ModelsParser.parse(process.env.MODELS_CONFIG || '/Users/prollo/Projects/private/github/luciana/build/models/');
        // Setup the API
        // app = await utils.ApiParser.parse(app, models, process.env.API_CONFIG || '/usr/local/luciana/config/api.json');
        // Setup the middlewares
        // app = await utils.MiddlewaresParser.parse(app, process.env.MIDDLEWARES_CONFIG || '/usr/local/luciana/config/middlewares.json');
        return app;
    } catch (error) {
        console.error(error);
        return error;
    }
}