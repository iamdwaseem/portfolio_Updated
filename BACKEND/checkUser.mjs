import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config({ path: "./config/config.env" });
await mongoose.connect(process.env.MONGO_URI, { dbName: "PORTFOLIO" });

const userSchema = new mongoose.Schema({ email: String, fullName: String });
const User = mongoose.model("User", userSchema);

const users = await User.find({});
console.log("Users in DB:", users.length);
if (users.length > 0) {
  users.forEach(u => console.log(`- ${u.fullName} (${u.email}) ID: ${u._id}`));
}

await mongoose.disconnect();
process.exit(0);
