/**
 * Luciana - Dynamic NodeJS REST API
 * Proudly developed by Paolo Rollo
 * ©2020 MIT License, for you.
 */
require('./db');
const { startApp } = require('./app');

startApp.then((app) => {
    app.listen(process.env.PORT || 3000, () => {
        console.log(`server running on port ${process.env.PORT || 3000}.`);
    })
}).catch((error) => {
    console.error(error);
});