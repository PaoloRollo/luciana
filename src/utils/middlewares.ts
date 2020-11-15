import { Application } from 'express';
import fs from 'fs/promises';

export default class MiddlewaresParser {

    static async parse (app: Application, filepath: string): Promise<Application> {
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
