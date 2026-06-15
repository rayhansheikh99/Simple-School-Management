const { DataTypes } = require('sequelize');
const sequelize = require('../config/db').sequelize;

const CommitteeMember = sequelize.define('CommitteeMember', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    set(value) {
      this.setDataValue('name', value ? value.trim() : '');
    }
  },
  designation: {
    type: DataTypes.STRING,
    allowNull: false,
    set(value) {
      this.setDataValue('designation', value ? value.trim() : '');
    }
  },
  header: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'সদস্য',
    set(value) {
      this.setDataValue('header', value ? value.trim() : '');
    }
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: ''
  },
  photo: {
    type: DataTypes.STRING,
    defaultValue: 'assets/images/default_teacher.png'
  },
  order: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  timestamps: true
});

CommitteeMember.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());
  values._id = values.id ? values.id.toString() : null;
  return values;
};

module.exports = CommitteeMember;
