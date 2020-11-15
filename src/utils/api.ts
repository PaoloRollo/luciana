import { Application } from 'express';
import fs from 'fs';

/**
 * ApiParser is the class used to parse the given API configuration file
 * into the expressjs routes.
 */
export default class ApiParser {

    /**
     * This function returns the updated app with all the new routes.
     *
     * @param {Application} app express application instance.
     * @param {any[]} models array of objects representing the models.
     * @param {string} filepath path of the file containing the api configuration as json.
     */
    static async parse(app: Application, models: any[], filepath: string): Promise<Application> {
        return new Promise<Application>(async (resolve, reject) => {
            try {
                // retrieve the configuration file
                const configFile = await fs.promises.readFile(filepath);
                // retrieve api base and services
                const { base, services } = JSON.parse(configFile.toString());
                // iterate through the servies
                for (let { methods, model, path} of services) {
                    // if no '/' is provided in the path, append it
                    if (path[0] !== '/') path = '/${path}';
                }
                resolve(app);
            } catch (error) {
                console.error(error);
                reject(error);
            }
        })
    }

};