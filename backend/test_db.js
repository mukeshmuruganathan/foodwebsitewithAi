const mongoose = require("./node_modules/mongoose");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.join(__dirname, "config", "config.env") });

async function test() {
  console.log("DB_LOCAL_URI:", process.env.DB_LOCAL_URI);
  try {
    await mongoose.connect(process.env.DB_LOCAL_URI);
    console.log("Database connected successfully!");
    const User = require("./models/user");
    const count = await User.countDocuments();
    console.log("User count:", count);
    const users = await User.find().limit(5);
    console.log("Sample Users:", users.map(u => ({ name: u.name, email: u.email, role: u.role })));
  } catch (err) {
    console.error("DB Connection Error:", err);
  } finally {
    await mongoose.disconnect();
  }
}

test();
