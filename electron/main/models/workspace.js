const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('workspace', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      unique: true
    },
    workspace_name: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    english_name: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    address: {
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
    }
  }, {
    sequelize,
    tableName: 'workspace',
    timestamps: false,
    indexes: [
      {
        name: "sqlite_autoindex_workspace_1",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
