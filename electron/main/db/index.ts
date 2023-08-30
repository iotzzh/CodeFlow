import { Database } from 'sqlite3';
import { homedir } from "os";
import path from 'path';
import pkg from "../../../package.json";
import { stat } from "fs";
import { join } from "path";
import { knex } from "knex";
import type { Knex } from "knex";
import { logger } from "../../winston";

// export const appDirectory = path.join(homedir(), pkg.name);
export default class DBHelper {
  static db: Database | null = null;

  static openDB = async () => {
  const path = require('path');

    stat(path.join(homedir(), pkg.name), (err) => {
      if (err) logger.error(pkg.name + " folder not found");
      else logger.info(pkg.name + " folder found");
    });
//     const { Sequelize } = require('sequelize');
//     // 方法 2: 分别传递参数 (sqlite)
//     const sequelize = new Sequelize({
//       dialect: 'sqlite',
//       storage: './data.db'
//     });

//     try {
//       await sequelize.authenticate();
//       await sequelize.sync({ force: true });
// console.log("所有模型均已成功同步.");
//       console.log('Connection has been established successfully.');
//     } catch (error) {
//       console.error('Unable to connect to the database:', error);
//     }
// const config: Knex.Config = {
//   client: "sqlite3",
//   connection: {
//     filename: path.join(path.join(homedir(), pkg.name), "data.db"),
//   },
//   useNullAsDefault: true,
// };
// const db = knex(config);

// db.schema.hasTable("users").then((exists) => {
//   if (!exists) {
//     // logger.warn("Users table not found. creating...");
//     db.schema
//       .createTable("users", (table) => {
//         table.increments();
//         table.string("username").notNullable().unique();
//         table.string("password").notNullable();
//         table.boolean("access").defaultTo("partial");
//       })
//       .then(() => {
//         // logger.info("Users table created successfully.");
//         db("users")
//           .insert([
//             {
//               username: "master",
//               password: "master",
//               access: "full",
//             },
//           ])
//           .then(() => {})
//           .catch((err) => {});
//       })
//       .catch((err) => {});
//   } else {
//     // logger.info("Users table already exists. not creating new one.");
//   }
// });
// export const db = knex(config);

    const sqlite3 = require('sqlite3').verbose();
    // 打开数据库连接
    // const path = require('path');
    // console.log('__dirname: ', __dirname);
    // console.log('appDirectory: ', path.join(homedir(), pkg.name));
    // const dataPath1 = path.join(__dirname.replace('app.asar',''), 'data.db');
    // const dataPath = path.join(path.join(homedir(), pkg.name), "/data.db");
    // console.log('dataPath: ', dataPath);                                    
    // console.log('dataPath1: ', dataPath1);
    const dataPath = path.join(homedir(), pkg.name, '/data.db')
    this.db = new sqlite3.Database(dataPath, (err) => {
        if (err) {
          console.error(err.message);
          return;
        }
        console.log('Connected to the test database.');
        const fs = require('fs');
        fs.readdir('./', (err, files) => {
          if (err) {
            console.error(err);
            return;
          }
          console.log(files);
        });
        console.log('数据库连接成功');
    });

    // 获取当前文件夹下的所有文件, 注意：这个是自动引入的方法，但是使用后无法在具体使用时使用TS类型，
    const modules = import.meta.glob('./*.ts');
    const keys = Object.keys(modules);
    keys.forEach(async (path:string) => {
        if (!Object.prototype.hasOwnProperty.call(modules, path)) return;
        const module: any = await modules[path]();
        if (module && module.default && typeof module.default.name === 'string') {
            const moduleDefault = module.default;
            this[moduleDefault.name] = new module.default(this.db);
        }
    });
  };

  static all = (query, params = []) => {
    return new Promise((resolve, reject) => {     
     this.db.all(query, params, (err, rows) => {
      if(err) reject("Read error: " + err.message)
      else {
       resolve(rows)
      }
     })
    })
   };

   static run = (query) => {
    return new Promise((resolve, reject) => {
      this.db.run(query, (err) => {
        if(err) reject(err.message)
        else resolve(true)
      })
     }) 
   };
}