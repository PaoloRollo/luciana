const mongoose = require('mongoose');
const fs = require('fs').promises;

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1)
}

class ModelsParser {

    getFieldType = (type) => {
        switch(type) {
            case ("string"):
                return String;
            case ("number"):
                return Number;
            case ("date"):
                return Date;
            default:
                return String;
        }
    }

    static parse = async (filepath) => {
        return new Promise(async (resolve, reject) => {
            try {
                const configFile = await fs.readFile(filepath);
                const parsedModels = JSON.parse(configFile);
                const models = [];
                for (let i = 0; i < parsedModels.length; i++) {
                    const { name, schema } = parsedModels[i];
                    const builtSchema = {};
                    for ([key, value] of Object.entries(schema)) {
                        const { type, required } = value;
                        builtSchema[key] = {
                            type: getFieldType(type),
                            required: required,
                        };
                    }
                    const modelSchema = mongoose.Schema(builtSchema);
                    models.push(mongoose.model(name.capitalize(), modelSchema));
                }
                resolve(models);
            } catch (error) {
                console.error(error);
                reject(error);
            }
        });
    }

}

module.exports = ModelsParser;