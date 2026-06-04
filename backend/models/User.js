const { DataTypes } = require('sequelize');
const sequelize = require('../config/db').sequelize;
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    set(value) {
      this.setDataValue('username', value ? value.trim().toLowerCase() : '');
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [6, 255]
    }
  },
  role: {
    type: DataTypes.STRING,
    defaultValue: 'admin',
    validate: {
      isIn: [['admin', 'viewer']]
    }
  }
}, {
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    }
  }
});

// Match user entered password to hashed password in database
User.prototype.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Custom serialization to exclude password and expose _id virtual field
User.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());
  delete values.password;
  values._id = values.id ? values.id.toString() : null;
  return values;
};

module.exports = User;
