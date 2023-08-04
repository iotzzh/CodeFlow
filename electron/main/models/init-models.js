var DataTypes = require("sequelize").DataTypes;
var _project = require("./project");
var _workspace = require("./workspace");

function initModels(sequelize) {
  var project = _project(sequelize, DataTypes);
  var workspace = _workspace(sequelize, DataTypes);


  return {
    project,
    workspace,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
