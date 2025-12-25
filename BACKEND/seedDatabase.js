import dotenv from "dotenv";
dotenv.config({ path: "./config/config.env" });

import mongoose from "mongoose";
import User from "./models/userSchema.js";
import { Project } from "./models/projectSchema.js";
import { Skill } from "./models/skillSchema.js";
import { Timeline } from "./models/timelineSchema.js";

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    dbName: "PORTFOLIO",
  })
  .then(() => {
    console.log("✅ Connected to Database");
    seedData();
  })
  .catch((error) => {
    console.log(`❌ Database connection error: ${error}`);
    process.exit(1);
  });

// Skill icons from devicons CDN
const skillIcons = {
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
};

const projects = [
  {
    title: "Payment Wallet System (Paytm Clone)",
    description: "A peer-to-peer digital wallet system enabling secure money transfers between users.",
    technologies: "MongoDB, Express.js, React, Node.js, JWT",
    stack: "Full Stack",
    deployed: "Completed",
    gitRepoLink: "",
    projectLink: "",
    projectBanner: {
      public_id: "placeholder",
      url: "https://via.placeholder.com/800x400/4F46E5/FFFFFF?text=Payment+Wallet+System"
    }
  },
  {
    title: "Eventify – Event Discovery & Ticketing Platform",
    description: "A full-fledged event discovery and ticketing platform with admin controls and QR-based ticket verification.",
    technologies: "Next.js 16, TypeScript, Supabase, PostgreSQL, PayPal",
    stack: "Full Stack",
    deployed: "Completed",
    gitRepoLink: "",
    projectLink: "",
    projectBanner: {
      public_id: "placeholder",
      url: "https://via.placeholder.com/800x400/10B981/FFFFFF?text=Eventify+Platform"
    }
  },
  {
    title: "NextStep – AI-Powered Career Guidance Platform",
    description: "An AI-based career guidance web application providing personalized career recommendations.",
    technologies: "React, TypeScript, Vite, Supabase, LLM APIs",
    stack: "AI / Web",
    deployed: "Completed",
    gitRepoLink: "",
    projectLink: "",
    projectBanner: {
      public_id: "placeholder",
      url: "https://via.placeholder.com/800x400/8B5CF6/FFFFFF?text=NextStep+AI"
    }
  },
  {
    title: "Fake News Detection System",
    description: "A machine learning system to classify news articles as real or fake using NLP techniques.",
    technologies: "Python, NLP, Scikit-learn, Machine Learning",
    stack: "Machine Learning",
    deployed: "Completed",
    gitRepoLink: "",
    projectLink: "",
    projectBanner: {
      public_id: "placeholder",
      url: "https://via.placeholder.com/800x400/F59E0B/FFFFFF?text=Fake+News+Detection"
    }
  },
];

const skills = [
  { title: "C", proficiencyLevel: "80", svg: { public_id: "c-icon", url: skillIcons.C } },
  { title: "C++", proficiencyLevel: "80", svg: { public_id: "cpp-icon", url: skillIcons["C++"] } },
  { title: "Python", proficiencyLevel: "85", svg: { public_id: "python-icon", url: skillIcons.Python } },
  { title: "JavaScript", proficiencyLevel: "90", svg: { public_id: "js-icon", url: skillIcons.JavaScript } },
  { title: "Java", proficiencyLevel: "75", svg: { public_id: "java-icon", url: skillIcons.Java } },
  { title: "React", proficiencyLevel: "90", svg: { public_id: "react-icon", url: skillIcons.React } },
  { title: "Next.js", proficiencyLevel: "85", svg: { public_id: "nextjs-icon", url: skillIcons["Next.js"] } },
  { title: "Node.js", proficiencyLevel: "85", svg: { public_id: "nodejs-icon", url: skillIcons["Node.js"] } },
  { title: "Express.js", proficiencyLevel: "85", svg: { public_id: "express-icon", url: skillIcons["Express.js"] } },
  { title: "Tailwind CSS", proficiencyLevel: "90", svg: { public_id: "tailwind-icon", url: skillIcons["Tailwind CSS"] } },
  { title: "Bootstrap", proficiencyLevel: "80", svg: { public_id: "bootstrap-icon", url: skillIcons.Bootstrap } },
  { title: "MongoDB", proficiencyLevel: "85", svg: { public_id: "mongodb-icon", url: skillIcons.MongoDB } },
  { title: "MySQL", proficiencyLevel: "75", svg: { public_id: "mysql-icon", url: skillIcons.MySQL } },
  { title: "Supabase", proficiencyLevel: "80", svg: { public_id: "supabase-icon", url: skillIcons.Supabase } },
  { title: "Git", proficiencyLevel: "90", svg: { public_id: "git-icon", url: skillIcons.Git } },
  { title: "GitHub", proficiencyLevel: "90", svg: { public_id: "github-icon", url: skillIcons.GitHub } },
];

const timelines = [
  {
    title: "VNR Vignana Jyothi Institute of Engineering and Technology",
    description: "Bachelor of Engineering in Computer Science and Engineering",
    timeline: {
      from: new Date("2024-01-01"),
      to: new Date("2027-12-31")
    },
    educationYear: "2024 - 2027",
    cgpa: "7.6"
  },
  {
    title: "VMR Pradeep Kumar Institute of Engineering and Technology",
    description: "Diploma in Computer Engineering",
    timeline: {
      from: new Date("2021-01-01"),
      to: new Date("2024-12-31")
    },
    educationYear: "2021 - 2024",
    cgpa: "8.56"
  },
];

async function seedData() {
  try {
    console.log("\n🌱 Starting database seeding...\n");

    const user = await User.findOne();
    if (!user) {
      console.log("❌ No user found. Please create a user first.");
      process.exit(1);
    }

    console.log(`✅ Found user: ${user.fullName || user.email}`);

    // Clear existing data
    console.log("\n🗑️  Clearing existing projects, skills, and timelines...");
    await Project.deleteMany({});
    await Skill.deleteMany({});
    await Timeline.deleteMany({});
    console.log("✅ Cleared existing data");

    // Insert projects
    console.log("\n📦 Inserting projects...");
    for (const project of projects) {
      const newProject = await Project.create(project);
      console.log(`  ✅ ${newProject.title}`);
    }

    // Insert skills
    console.log("\n🎯 Inserting skills with icons...");
    for (const skill of skills) {
      const newSkill = await Skill.create(skill);
      console.log(`  ✅ ${newSkill.title} (${newSkill.proficiencyLevel}%)`);
    }

    // Insert timelines
    console.log("\n🎓 Inserting education timeline...");
    for (const timeline of timelines) {
      const newTimeline = await Timeline.create(timeline);
      console.log(`  ✅ ${newTimeline.title}`);
    }

    console.log("\n✨ Database seeding completed!\n");
    console.log("📊 Summary:");
    console.log(`   - Projects: ${projects.length}`);
    console.log(`   - Skills: ${skills.length}`);
    console.log(`   - Timeline: ${timelines.length}`);
    console.log("\n🎉 You can now view your data in the admin panel!\n");

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Error seeding database:", error);
    process.exit(1);
  }
}
