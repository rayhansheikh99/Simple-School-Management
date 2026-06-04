const { Sequelize } = require('sequelize');
const mysql = require('mysql2/promise');

const dbName = process.env.MYSQL_DATABASE || 'school_db';
const dbUser = process.env.MYSQL_USER || 'root';
const dbPassword = process.env.MYSQL_PASSWORD || '';
const dbHost = process.env.MYSQL_HOST || 'localhost';

const sequelize = new Sequelize(
  dbName,
  dbUser,
  dbPassword,
  {
    host: dbHost,
    dialect: 'mysql',
    logging: false
  }
);

// Define module.exports.sequelize early so models requiring it can access it
module.exports.sequelize = sequelize;

const connectDB = async () => {
  try {
    // 1. Auto-create database if it doesn't exist
    const connection = await mysql.createConnection({
      host: dbHost,
      user: dbUser,
      password: dbPassword
    });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
    await connection.end();

    // 2. Connect to the database via Sequelize
    await sequelize.authenticate();
    console.log('MySQL Connected successfully.');

    // Import models so Sequelize knows about them before sync
    const User = require('../models/User');
    require('../models/ContactMessage');
    require('../models/GalleryItem');
    require('../models/Notice');
    require('../models/Result');
    require('../models/SchoolSetting');
    require('../models/StudentRegistration');
    require('../models/Teacher');

    // Sync database (creates tables if they don't exist)
    await sequelize.sync();
    console.log('Database tables synchronized.');

    // Auto-create viewer user (read-only) if it does not exist
    const viewerExists = await User.findOne({ where: { username: 'user' } });
    if (!viewerExists) {
      await User.create({
        username: 'user',
        password: 'pass123',
        role: 'viewer'
      });
      console.log('Read-only viewer user ("user" / "pass123") auto-created successfully.');
    }
  } catch (error) {
    console.error(`Database Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
module.exports.sequelize = sequelize;
