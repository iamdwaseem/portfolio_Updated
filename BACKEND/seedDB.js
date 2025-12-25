const dotenv = require("dotenv");
dotenv.config({ path: "./config/config.env" });

const mongoose = require("mongoose");

// Simple connection
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

// Skill icons
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

async function seedData() {
  try {
    console.log("\n🌱 Starting database seeding...\n");

    // Get models after connection
    const User = mongoose.model("User");
    const Project = mongoose.model("Project");
    const Skill = mongoose.model("Skill");
    const Timeline = mongoose.model("Timeline");

    const user = await User.findOne();
    if (!user) {
      console.log("❌ No user found. Please create a user first.");
      process.exit(1);
    }

    console.log(`✅ Found user: ${user.fullName || user.email}`);

    // Clear existing data
    console.log("\n🗑️  Clearing existing data...");
    await Project.deleteMany({});
    await Skill.deleteMany({});
    await Timeline.deleteMany({});
    console.log("✅ Cleared");

    // Projects
    console.log("\n📦 Inserting projects...");
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
          url: "https://via.placeholder.com/800x400/4F46E5/FFFFFF?text=Payment+Wallet"
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
          url: "https://via.placeholder.com/800x400/10B981/FFFFFF?text=Eventify"
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
          url: "https://via.placeholder.com/800x400/8B5CF6/FFFFFF?text=NextStep"
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
          url: "https://via.placeholder.com/800x400/F59E0B/FFFFFF?text=Fake+News"
        }
      },
    ];

    for (const p of projects) {
      await Project.create(p);
      console.log(`  ✅ ${p.title}`);
    }

    // Skills
    console.log("\n🎯 Inserting skills...");
    const skillsData = [
      { title: "C", proficiencyLevel: "80", svg: { public_id: "c", url: skillIcons.C } },
      { title: "C++", proficiencyLevel: "80", svg: { public_id: "cpp", url: skillIcons["C++"] } },
      { title: "Python", proficiencyLevel: "85", svg: { public_id: "python", url: skillIcons.Python } },
      { title: "JavaScript", proficiencyLevel: "90", svg: { public_id: "js", url: skillIcons.JavaScript } },
      { title: "Java", proficiencyLevel: "75", svg: { public_id: "java", url: skillIcons.Java } },
      { title: "React", proficiencyLevel: "90", svg: { public_id: "react", url: skillIcons.React } },
      { title: "Next.js", proficiencyLevel: "85", svg: { public_id: "nextjs", url: skillIcons["Next.js"] } },
      { title: "Node.js", proficiencyLevel: "85", svg: { public_id: "nodejs", url: skillIcons["Node.js"] } },
      { title: "Express.js", proficiencyLevel: "85", svg: { public_id: "express", url: skillIcons["Express.js"] } },
      { title: "Tailwind CSS", proficiencyLevel: "90", svg: { public_id: "tailwind", url: skillIcons["Tailwind CSS"] } },
      { title: "Bootstrap", proficiencyLevel: "80", svg: { public_id: "bootstrap", url: skillIcons.Bootstrap } },
      { title: "MongoDB", proficiencyLevel: "85", svg: { public_id: "mongodb", url: skillIcons.MongoDB } },
      { title: "MySQL", proficiencyLevel: "75", svg: { public_id: "mysql", url: skillIcons.MySQL } },
      { title: "Supabase", proficiencyLevel: "80", svg: { public_id: "supabase", url: skillIcons.Supabase } },
      { title: "Git", proficiencyLevel: "90", svg: { public_id: "git", url: skillIcons.Git } },
      { title: "GitHub", proficiencyLevel: "90", svg: { public_id: "github", url: skillIcons.GitHub } },
    ];

    for (const s of skillsData) {
      await Skill.create(s);
      console.log(`  ✅ ${s.title}`);
    }

    // Timeline
    console.log("\n🎓 Inserting education...");
    const timelineData = [
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
      },
    ];

    for (const t of timelineData) {
      await Timeline.create(t);
      console.log(`  ✅ ${t.title}`);
    }

    console.log("\n✨ Database seeded successfully!\n");
    console.log("📊 Summary:");
    console.log(`   - Projects: 4`);
    console.log(`   - Skills: 16`);
    console.log(`   - Timeline: 2\n`);

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Error:", error.message);
    process.exit(1);
  }
}
