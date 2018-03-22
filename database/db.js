// Requires
const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3');

// Other vars
const DEFAULT_NAME = 'accounts-database.sqlite3';
const DIR = path.dirname(__filename);

// Database class
class Database {
  // Get DB name and initialize
  constructor(name=DEFAULT_NAME) {
    this.name = name;
    this.init();
  }

  // If the DB doesn't exist, make it
  init() {
    const dbExists = fs.existsSync(this.name);
    if (!dbExists) {
      const schema = path.join(DIR, 'sql', 'schema.sql');
      const schemaSQL = fs.readFileSync(schema, 'utf8');
      try {
        const db = this.open();
        db.exec(schemaSQL);
        db.close();
      }
      catch (e) {
        console.error(e);
        process.exit(1);
      }
    }
  }

  // Returns sqlite3 Database object
  open() {
    const dbPath = path.join(DIR, this.name);
    return new sqlite3.Database(dbPath);
  }
}

module.exports = Database;
