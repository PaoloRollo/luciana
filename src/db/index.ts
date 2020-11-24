import low from 'lowdb';
import FileAsync from 'lowdb/adapters/FileAsync';

const db = low(new FileAsync('db.json'));

export { db };