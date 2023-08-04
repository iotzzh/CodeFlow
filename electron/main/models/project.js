const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('project', {
    id: {
      type: DataTypes.TEXT,
      allowNull: true,
      primaryKey: true
    },
    project_name: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    workspace_id: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    create_time: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    update_time: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'project',
    timestamps: false
  });
};
