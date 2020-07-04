'use strict'

const sqlite3 = require('sqlite3').verbose();

let db  = null;

function initDb(db) {
        db.run('CREATE TABLE signalers (id INT, state TEXT)');
        console.log('DB is ready!');
}

function getDb() {
    try {
        if(!db) {
            db = new sqlite3.Database(':memory:');
            initDb(db);
        }
        return db;
    } catch (e) {
        console.log(`Cannot load config: ${e}!`);
    }
}

class SignalersDB {

    constructor() {
        this.db = getDb();
    }

    insert(id, state) {
        const insertStatement = db.prepare('INSERT into signalers values(?,?)');
        insertStatement.run(id, state);
    }

    select() {
        console.log('Db data: ');
        db.each('SELECT * FROM signalers', (err, row) => {
            console.log(`ID: ${row.id}, COLOR: ${row.state}`);
        });

    }
}

module.exports = SignalersDB