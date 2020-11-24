/**
 * Luciana - Dynamic NodeJS REST API
 * Proudly developed by Paolo Rollo
 * ©2020 MIT License, for you.
 */
import * as dotenv from 'dotenv';
import startApp from './app';

// Retrieve the config from the .env file
dotenv.config({ path: `${__dirname}/../.env`});

// Start the application
startApp()
    .then((app) => {
        app.listen(process.env.PORT || 3000, () => {
            console.log(`server running on port ${process.env.PORT || 3000}.`);
        })
    })
    .catch((error) => {
        console.error(error);
    });