const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const dbName = process.env.MYSQL_DATABASE;
const dbUser = process.env.MYSQL_USER;
const dbPassword = process.env.MYSQL_PASSWORD;
const dbHost = process.env.MYSQL_HOST;

console.log(`Testing connection to ${dbHost} with database ${dbName} and user ${dbUser}...`);

const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  dialect: 'mysql',
  logging: false,
  dialectOptions: {
    connectTimeout: 10000
  }
});

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('✅ Success! Successfully connected to the Webuzo MySQL database.');
    await sequelize.close();
  } catch (error) {
    console.error('❌ Connection Failed. Error details:');
    console.error(error.message);
    if (error.name === 'SequelizeConnectionRefusedError') {
      console.log('\n💡 Suggestion: The server refused the connection. Ensure that you have whitelisted your IP in the "Remote MySQL Access" section of your Webuzo control panel.');
    } else if (error.name === 'SequelizeAccessDeniedError') {
      console.log('\n💡 Suggestion: Access denied. Please double check that your database username and password in the `.env` file are correct.');
    }
  }
}

testConnection();
