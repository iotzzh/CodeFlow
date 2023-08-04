import baseController from "./common";
import { DBHelper } from "../db";
import { TReturn } from "./entity";

export default class WorkspaceController extends baseController {
   static prefix = 'workspace';
   constructor() { super('DBWorkspaceHelper'); }
}
