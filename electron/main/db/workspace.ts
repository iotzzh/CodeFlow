import DBCommonHelper from "./common";

export default class DBWorkspaceHelper extends DBCommonHelper {
    db: any;
    constructor(db:any) { 
        super(db, 'workspace');
        this.db = db;

        const fs = require('fs');

        fs.readdir('./', (err, files) => {
          if (err) {
            console.error(err);
            return;
          }
          console.log(files);
        });

    }
}