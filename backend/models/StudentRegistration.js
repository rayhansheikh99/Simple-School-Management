const { DataTypes } = require('sequelize');
const sequelize = require('../config/db').sequelize;

const StudentRegistration = sequelize.define('StudentRegistration', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  studentName: {
    type: DataTypes.STRING,
    allowNull: false,
    set(value) {
      this.setDataValue('studentName', value ? value.trim() : '');
    }
  },
  fatherName: {
    type: DataTypes.STRING,
    allowNull: false,
    set(value) {
      this.setDataValue('fatherName', value ? value.trim() : '');
    }
  },
  motherName: {
    type: DataTypes.STRING,
    allowNull: false,
    set(value) {
      this.setDataValue('motherName', value ? value.trim() : '');
    }
  },
  dateOfBirth: {
    type: DataTypes.DATE,
    allowNull: false
  },
  gender: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [['male', 'female']]
    }
  },
  desiredClass: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [['play', 'nursery', 'kg', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']]
    }
  },
  desiredGroup: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
    set(value) {
      this.setDataValue('phone', value ? value.trim() : '');
    }
  },
  email: {
    type: DataTypes.STRING,
    defaultValue: '',
    set(value) {
      this.setDataValue('email', value ? value.trim() : '');
    }
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
    set(value) {
      this.setDataValue('address', value ? value.trim() : '');
    }
  },
  previousSchool: {
    type: DataTypes.STRING,
    defaultValue: '',
    set(value) {
      this.setDataValue('previousSchool', value ? value.trim() : '');
    }
  },
  photo: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'pending',
    validate: {
      isIn: [['pending', 'approved', 'rejected']]
    }
  },
  submittedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

StudentRegistration.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());
  values._id = values.id ? values.id.toString() : null;
  return values;
};

module.exports = StudentRegistration;
