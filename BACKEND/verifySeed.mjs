import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config({ path: "./config/config.env" });

await mongoose.connect(process.env.MONGO_URI, { dbName: "PORTFOLIO" });

const Project = mongoose.model("Project", new mongoose.Schema({}));
const Skill = mongoose.model("Skill", new mongoose.Schema({}));
const Timeline = mongoose.model("Timeline", new mongoose.Schema({}));
const SoftwareApplication = mongoose.model("SoftwareApplication", new mongoose.Schema({ name: String }));

console.log("📊 Database Stats:");
console.log("- Projects:", await Project.countDocuments());
console.log("- Skills:", await Skill.countDocuments());
console.log("- Timeline entries:", await Timeline.countDocuments());
console.log("- Tools & Tech:", await SoftwareApplication.countDocuments());

const tools = await SoftwareApplication.find({}, { name: 1, _id: 0 });
console.log("\n🛠️ Tools found:", tools.map(t => t.name).join(", "));

await mongoose.disconnect();
process.exit(0);
