import { Database } from "sqlite3";
import DBCommonHelper from "./common";

export default class DBProjectHelper extends DBCommonHelper {
    db: Database;
    name: 'DBProjectHelper';
    constructor(db:Database) { 
        super(db, 'project');
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