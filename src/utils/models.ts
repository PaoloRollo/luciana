import _ from 'lodash';
import mongoose from 'mongoose';
import fs from 'fs';

/**
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
 * ModelsParser
 */
export default class ModelsParser {

    /**
     * Parses all the model files inside the dirpath directory.
     * @param {string} dirpath path of the directory where all the model files are built.
     * @return {mongoose.Model<mongoose.Document>[]} array of mongoose models.
     */
    static async parse(dirpath: string): Promise<mongoose.Model<mongoose.Document>[]> {
        return new Promise(async (resolve, reject) => {
            try {
                const models: mongoose.Model<mongoose.Document>[] = [];
                const modelsFiles = await fs.promises.readdir(dirpath, "utf-8");
                await Promise.all(
                    _.map(modelsFiles, async (currentFilePath: string) => {
                        return new Promise(async (modelResolve, modelReject) => {
                            try {
                                const model = await import(`${dirpath}/${currentFilePath}`);
                                const instance = new model.default();
                                const keys = Object.keys(instance);
                                const builtSchema: any = {};
                                await Promise.all(
                                    _.map(keys, async (key) => {
                                        return new Promise(async (keysResolve, keysReject) => {
                                            try {
                                                builtSchema[key] = {
                                                    type: await getVariableType(instance[key]),
                                                };
                                                keysResolve(true);
                                            } catch (error) {
                                                console.log(error);
                                                keysReject(error);
                                            }
                                        })
                                    })
                                );
                                const modelSchema = new mongoose.Schema(builtSchema);
                                const mongooseModel = mongoose.model(`${currentFilePath.split('.')[0]}`, modelSchema);
                                models.push(mongooseModel);
                                modelResolve(true);
                            } catch (error) {
                                console.log(error);
                                modelReject(error);
                            }
                        })
                    })
                )
                resolve(models);
            } catch (error) {
                console.error(error);
                reject(error);
            }
        });
    }

};