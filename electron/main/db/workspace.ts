import { Database } from "sqlite3";
import DBCommonHelper from "./common";

export default class DBWorkspaceHelper extends DBCommonHelper {
    db: Database;
    name: 'DBWorkspaceHelper';
    constructor(db:Database) { 
        super(db, 'workspace');
        this.db = db;

        const fs = require('fs');

        fs.readdir('./', (err, files) => {
          if (err) {
            console.error(err);
            return;
          }
          // console.log(files);
        });

    }
}