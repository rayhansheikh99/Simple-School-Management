const { DataTypes } = require('sequelize');
const sequelize = require('../config/db').sequelize;

const Result = sequelize.define('Result', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    set(value) {
      this.setDataValue('title', value ? value.trim() : '');
    }
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  class: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'all'
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  pdfUrl: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

Result.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());
  values._id = values.id ? values.id.toString() : null;
  return values;
};

module.exports = Result;
