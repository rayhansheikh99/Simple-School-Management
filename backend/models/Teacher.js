const { DataTypes } = require('sequelize');
const sequelize = require('../config/db').sequelize;

const Teacher = sequelize.define('Teacher', {
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
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
    set(value) {
      this.setDataValue('phone', value ? value.trim() : '');
    }
  },
  subject: {
    type: DataTypes.STRING,
    allowNull: false,
    set(value) {
      this.setDataValue('subject', value ? value.trim() : '');
    }
  },
  qualifications: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  photo: {
    type: DataTypes.STRING,
    defaultValue: 'assets/images/default_teacher.png'
  },
  type: {
    type: DataTypes.STRING,
    defaultValue: 'assistant',
    validate: {
      isIn: [['head', 'assistant_head', 'assistant', 'third_class_staff', 'fourth_class_staff', 'staff']]
    }
  },
  order: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
});

Teacher.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());
  values._id = values.id ? values.id.toString() : null;
  return values;
};

module.exports = Teacher;
