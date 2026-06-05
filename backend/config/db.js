const { Sequelize } = require('sequelize');
require('dotenv').config();

const dbName = process.env.MYSQL_DATABASE || 'edumanag_school_data';
const dbUser = process.env.MYSQL_USER || 'edumanag_user';
const dbPassword = process.env.MYSQL_PASSWORD ?? 'Asdzxc123';
const dbHost = process.env.MYSQL_HOST || 'localhost';
const dbPort = process.env.MYSQL_PORT || 3306;
const nodeEnv = process.env.NODE_ENV || 'production';

const sequelize = new Sequelize(
  dbName,
  dbUser,
  dbPassword,
  {
    host: dbHost,
    port: dbPort,
    dialect: 'mysql',
    logging: false,
    dialectOptions: {
      connectTimeout: 60000
    }
  }
);

// Export sequelize before loading models
module.exports.sequelize = sequelize;

const connectDB = async () => {
  try {
    // Test Database Connection
    await sequelize.authenticate();
    console.log('✅ MySQL Connected Successfully');

    // Load Models
    const User = require('../models/User');
    require('../models/ContactMessage');
    require('../models/GalleryItem');
    require('../models/Notice');
    require('../models/Result');
    require('../models/SchoolSetting');
    require('../models/StudentRegistration');
    require('../models/Teacher');

    // Create Tables if Not Exists
    await sequelize.sync({ alter: true });
    console.log('✅ Database Tables Synchronized');

    // Create Demo Viewer User Only in Development
    if (nodeEnv !== 'production') {
      const viewerExists = await User.findOne({
        where: { username: 'user' }
      });

      if (!viewerExists) {
        await User.create({
          username: 'user',
          password: 'pass123',
          role: 'viewer'
        });

        console.log('✅ Demo Viewer User Created');
      }
    }

  } catch (error) {
    console.error('❌ Database Connection Error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
module.exports.sequelize = sequelize;