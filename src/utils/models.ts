import mongoose from 'mongoose';
import fs from 'fs/promises';

export default class ModelsParser {

    static async parse(filepath: string): Promise<Array<Object>> {
        return new Promise(async (resolve, reject) => {
            try {
                const configFile = await fs.readFile(filepath);
                const parsedModels = JSON.parse(configFile.toString());
                const models = [];
                for (let i = 0; i < parsedModels.length; i++) {
                    const { name, schema } = parsedModels[i];
                    const builtSchema = {};
                    const modelSchema = new mongoose.Schema(builtSchema);
                    models.push(mongoose.model(name.capitalize(), modelSchema));
                }
                resolve(models);
            } catch (error) {
                console.error(error);
                reject(error);
            }
        });
    }

};