import baseController from "./common";
import { TReturn } from "./entity";

export default class ProjectController extends baseController {
   static prefix = 'project';
   constructor() { super('DBProjectHelper'); }
}
