const { DataTypes } = require('sequelize');
const sequelize = require('../config/db').sequelize;

const Notice = sequelize.define('Notice', {
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
  category: {
    type: DataTypes.STRING,
    defaultValue: 'academic',
    validate: {
      isIn: [['academic', 'exam', 'event', 'admin']]
    }
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

Notice.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());
  values._id = values.id ? values.id.toString() : null;
  return values;
};

module.exports = Notice;
