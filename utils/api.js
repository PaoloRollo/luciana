const fs = require('fs').promises;

/**
 * ApiParser is the class used to parse the given API configuration file
 * into the expressjs routes.
 */
class ApiParser {
    
    /**
     * This function returns the updated app with all the new routes.
     * 
     * @param {Express.Application} app express application instance.  
     * @param {Array<Object>} models array of objects representing the models. 
     * @param {String} filepath path of the file containing the api configuration as json.
     */
    async static parse(app, models, filepath) {
        return new Promise(async (resolve, reject) => {
            try {
                // retrieve the configuration file
                const configFile = await fs.readFile(filepath);
                // retrieve api base and services
                const { base, services } = JSON.parse(configFile);
                // iterate through the servies 
                for (let i = 0; i < services.length; i++) {
                    // get name, method and path of the current service
                    let { methods, model, path } = service[i];
                    // if no '/' is provided in the path, append it
                    if (path[0] !== '/') path = '/${path}';
                    // get the first model that matches the name
                    const [ model ] = models.filter((m) => m.name === model);
                }
                resolve(app);
            } catch (error) {
                console.error(error);
                reject(error);
            }
        })
    }

}

module.exports = ApiParser;