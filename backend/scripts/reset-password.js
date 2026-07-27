const connectDB = require('../config/db');
const { sequelize } = require('../config/db');
const User = require('../models/User');

const [username, newPassword] = process.argv.slice(2);

const resetPassword = async () => {
  if (!username || !newPassword) {
    console.error('Usage: node scripts/reset-password.js <username> <new-password>');
    process.exitCode = 1;
    return;
  }

  if (newPassword.length < 6) {
    console.error('Password must be at least 6 characters long.');
    process.exitCode = 1;
    return;
  }

  try {
    await connectDB();
    const user = await User.findOne({ where: { username: username.trim().toLowerCase() } });
    if (!user) {
      console.error(`User "${username}" was not found.`);
      process.exitCode = 1;
      return;
    }

    user.password = newPassword;
    await user.save();
    console.log(`Password updated for "${user.username}".`);
  } catch (error) {
    console.error('Password reset failed:', error.message);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
};

resetPassword();
// npm run reset-password -- admin "NewStrongPassword123!"

