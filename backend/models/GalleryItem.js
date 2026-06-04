const { DataTypes } = require('sequelize');
const sequelize = require('../config/db').sequelize;

const GalleryItem = sequelize.define('GalleryItem', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    defaultValue: '',
    set(value) {
      this.setDataValue('title', value ? value.trim() : '');
    }
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false
  },
  mediaType: {
    type: DataTypes.STRING,
    defaultValue: 'image',
    validate: {
      isIn: [['image', 'video']]
    }
  },
  category: {
    type: DataTypes.STRING,
    defaultValue: 'events',
    validate: {
      isIn: [['campus', 'events', 'sports', 'academic']]
    }
  },
  date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

GalleryItem.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());
  values._id = values.id ? values.id.toString() : null;
  return values;
};

module.exports = GalleryItem;
