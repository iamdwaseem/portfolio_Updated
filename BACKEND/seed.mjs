// Simple seed script - Run with: node --experimental-modules seed.mjs
import dotenv from "dotenv";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import mongoose from "mongoose";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: "./config/config.env" });

console.log("🔌 Connecting to MongoDB...");

await mongoose.connect(process.env.MONGO_URI, { dbName: "PORTFOLIO" });

console.log("✅ Connected!");

// Define schemas inline
const projectSchema = new mongoose.Schema({
  title: String,
  description: String,
  gitRepoLink: String,
  projectLink: String,
  technologies: String,
  stack: String,
  deployed: String,
  projectBanner: {
    public_id: String,
    url: { type: String, required: true }
  }
});

const skillSchema = new mongoose.Schema({
  title: String,
  proficiencyLevel: String,
  svg: {
    public_id: String,
    url: { type: String, required: true }
  }
});

const timelineSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  educationYear: String,
  cgpa: String,
  timeline: {
    from: { type: Date, required: true },
    to: { type: Date, required: true }
  }
});

const softwareApplicationSchema = new mongoose.Schema({
  name: String,
  svg: {
    public_id: String,
    url: { type: String, required: true },
  },
});

const Project = mongoose.model("Project", projectSchema);
const Skill = mongoose.model("Skill", skillSchema);
const Timeline = mongoose.model("Timeline", timelineSchema);
const SoftwareApplication = mongoose.model("SoftwareApplication", softwareApplicationSchema);

console.log("\n🗑️  Clearing old data...");
await Project.deleteMany({});
await Skill.deleteMany({});
await Timeline.deleteMany({});
await SoftwareApplication.deleteMany({});

console.log("\n📦 Adding projects...");
await Project.insertMany([
  {
    title: "Payment Wallet System (Paytm Clone)",
    description: "A peer-to-peer digital wallet system enabling secure money transfers between users.",
    technologies: "MongoDB, Express.js, React, Node.js, JWT",
    stack: "Full Stack",
    deployed: "Completed",
    gitRepoLink: "",
    projectLink: "",
    projectBanner: { public_id: "p1", url: "https://via.placeholder.com/800x400/4F46E5/FFFFFF?text=Payment+Wallet" }
  },
  {
    title: "Eventify – Event Discovery & Ticketing Platform",
    description: "A full-fledged event discovery and ticketing platform with admin controls and QR-based ticket verification.",
    technologies: "Next.js 16, TypeScript, Supabase, PostgreSQL, PayPal",
    stack: "Full Stack",
    deployed: "Completed",
    gitRepoLink: "",
    projectLink: "",
    projectBanner: { public_id: "p2", url: "https://via.placeholder.com/800x400/10B981/FFFFFF?text=Eventify" }
  },
  {
    title: "NextStep – AI-Powered Career Guidance Platform",
    description: "An AI-based career guidance web application providing personalized career recommendations.",
    technologies: "React, TypeScript, Vite, Supabase, LLM APIs",
    stack: "AI / Web",
    deployed: "Completed",
    gitRepoLink: "",
    projectLink: "",
    projectBanner: { public_id: "p3", url: "https://via.placeholder.com/800x400/8B5CF6/FFFFFF?text=NextStep" }
  },
  {
    title: "Fake News Detection System",
    description: "A machine learning system to classify news articles as real or fake using NLP techniques.",
    technologies: "Python, NLP, Scikit-learn, Machine Learning",
    stack: "Machine Learning",
    deployed: "Completed",
    gitRepoLink: "",
    projectLink: "",
    projectBanner: { public_id: "p4", url: "https://via.placeholder.com/800x400/F59E0B/FFFFFF?text=Fake+News" }
  }
]);

const iconUrls = {
  C: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg",
  "C++": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg",
  Python: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
  JavaScript: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
  Java: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
  React: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
  "Next.js": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",
  "Node.js": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
  "Express.js": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg",
  "Tailwind CSS": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg",
  Bootstrap: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg",
  MongoDB: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg",
  MySQL: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
  Supabase: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/supabase/supabase-original.svg",
  Git: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
  GitHub: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg",
  Antigravity: "https://antigravity.dev/favicon.ico" // Placeholder if needed
};

console.log("\n🎯 Adding skills (excluding tools)...");
const skillsToAdd = [
  "C", "C++", "Python", "JavaScript", "Java", 
  "React", "Next.js", "Node.js", "Express.js", 
  "Tailwind CSS", "Bootstrap", "MongoDB", "MySQL"
];

await Skill.insertMany(
  skillsToAdd.map(name => ({
    title: name,
    proficiencyLevel: "85",
    svg: { public_id: name.toLowerCase().replace(/[^a-z]/g, ''), url: iconUrls[name] }
  }))
);

console.log("\n🛠️ Adding tools and technology...");
const toolsToAdd = ["Git", "GitHub", "Supabase", "Antigravity"];

await SoftwareApplication.insertMany(
  toolsToAdd.map(name => ({
    name: name,
    svg: { public_id: name.toLowerCase().replace(/[^a-z]/g, ''), url: iconUrls[name] }
  }))
);

console.log("\n🎓 Adding education...");
await Timeline.insertMany([
  {
    title: "VNR Vignana Jyothi Institute of Engineering and Technology",
    description: "Bachelor of Engineering in Computer Science and Engineering",
    timeline: { from: new Date("2024-01-01"), to: new Date("2027-12-31") },
    educationYear: "2024 - 2027",
    cgpa: "7.6"
  },
  {
    title: "VMR Pradeep Kumar Institute of Engineering and Technology",
    description: "Diploma in Computer Engineering",
    timeline: { from: new Date("2021-01-01"), to: new Date("2024-12-31") },
    educationYear: "2021 - 2024",
    cgpa: "8.56"
  }
]);

console.log("\n✨ Done! Database fully populated with refined categories.\n");
await mongoose.disconnect();
process.exit(0);
