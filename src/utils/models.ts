// External basic imports
import _ from 'lodash';
import fs from 'fs';

/**
 * TODO: update supported variable types
 * Returns the variable type for the input variable.
 * @param {any} variable variable that must be analyzed.
 * @return {any} variable type (eg. String).
 */
async function getVariableType(variable: any) {
    if (!Number.isNaN(variable)) {
        return Number;
    } else if (variable instanceof Date) {
        return Date;
    } else {
        return String;
    }
}

/**
 * ParsedModel interface
 */
interface ParsedModel {
    name: string;
    schema: any;
}

/**
 * ModelsParser
 */
export default class ModelsParser {

    /**
     * Parses all the model files inside the dirpath directory.
     * @param {string} dirpath path of the directory where all the model files are built.
     * @return {ParsedModel[]} array of mongoose ParsedModel.
     */
    static async parse(dirpath: string): Promise<ParsedModel[]> {
        try {
            // Initialize empty models array
            const models: any[] = [];
            // Get all the model .ts files in the directory
            const modelsFiles = await fs.promises.readdir(dirpath, "utf-8");
            // Await all the models creations
            await Promise.all(
                // Perform the model mapping
                _.map(modelsFiles, async (currentFilePath: string) => {
                    try {
                        // Import the external model file
                        const model = await import(`${dirpath}/${currentFilePath}`);
                        // Create a default instance
                        const instance = new model.default();
                        // Retrieve the keys and build the empty schema
                        const keys = Object.keys(instance);
                        const builtSchema: any = {};
                        // Map all the keys to the given schema
                        await Promise.all(
                            _.map(keys, async (key) => {
                                try {
                                    builtSchema[key] = {
                                        type: await getVariableType(instance[key]),
                                    };
                                } catch (error) {
                                    console.log(error);
                                }
                            })
                        );
                        // Create and add the ParsedModel into the array
                        const parsedModel: ParsedModel = { name: currentFilePath, schema: builtSchema };
                        models.push(parsedModel);
                    } catch (error) {
                        console.log(error);
                    }
                })
            )
            // Return the newly created array
            return models;
        } catch (error) {
            console.error(error);
            return error;
        }
    }
}