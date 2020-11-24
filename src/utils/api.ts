// External basic imports
import { Application } from 'express';
import fs from 'fs';
import _, { filter } from 'lodash';
// Internal imports
import { db } from '../db';

/**
 * ParsedModel interface
 */
interface ParsedModel {
    name: string;
    schema: any;
}

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
    static async parse(app: Application, models: ParsedModel[], filepath: string): Promise<Application> {
        try {
            const lowDb = await db;
            lowDb.defaults({ collections: []}).write();
            // retrieve the configuration file
            const configFile = await fs.promises.readFile(filepath);
            // retrieve api base and services
            const { base, services } = JSON.parse(configFile.toString());
            // iterate through the servies
            for (let { methods, model, path} of services) {
                const filteredModel = _.filter(models, (a: ParsedModel) => a.name === model);
                // if no '/' is provided in the path, append it
                if (path[0] !== '/') path = '/${path}';
                _.forEach(methods, (method: string) => {
                    if (method.toUpperCase() === "GET") {
                        app.get(`${base}${path}`, async (req, res) => {
                            try {
                                const { elements } = lowDb.get('collections').find({ name: model }).value();
                                res.status(200).send({ result: elements });
                            } catch (error) {
                                console.error(error);
                                res.status(500).send({ result: 'internal server error.'});
                            }
                        });
                        app.get(`${base}${path}/:id`, async (req, res) => {
                            try {
                                const { elements } = lowDb.get('collections').find({ name: model }).value();
                                const element = await new Promise((resolve, reject) => {
                                    const filtered = _.filter(elements, (element: any) => element.id === req.params.id);
                                    filtered.length > 0 ? resolve(filtered[0]) : resolve(null);
                                });
                                res.status(element ? 200 : 404).send({ result: element ? element : 'entity not found.' });
                            } catch (error) {
                                console.error(error);
                            }
                        });
                    } else if (method.toUpperCase() === "POST") {
                        app.post(`${base}${path}`, async (req, res) => {

                        });
                    } else if (method.toUpperCase() === "PUT") {
                        app.put(`${base}${path}/:id`, async (req, res) => {

                        });
                    } else if (method.toUpperCase() === "DELETE") {
                        app.delete(`${base}${path}/:id`, async (req, res) => {

                        });
                    }
                })
            }
            return app;
        } catch (error) {
            console.error(error);
            return error;
        }
    }

};