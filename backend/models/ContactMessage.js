const { DataTypes } = require('sequelize');
const sequelize = require('../config/db').sequelize;

const ContactMessage = sequelize.define('ContactMessage', {
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
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  phone: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  subject: {
    type: DataTypes.STRING,
    defaultValue: 'General Inquiry',
    set(value) {
      this.setDataValue('subject', value ? value.trim() : 'General Inquiry');
    }
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'unread',
    validate: {
      isIn: [['unread', 'read', 'archived']]
    }
  }
});

ContactMessage.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());
  values._id = values.id ? values.id.toString() : null;
  return values;
};

module.exports = ContactMessage;
