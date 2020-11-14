const fs = require('fs').promises;

class MiddlewaresParser {

    static parse = async (app, filepath) => {
        return new Promise((resolve, reject) => {
            try {
                resolve(app);
            } catch (error) {
                console.error(error);
                reject(error);
            }
        })
    }

}

module.exports = MiddlewaresParser;