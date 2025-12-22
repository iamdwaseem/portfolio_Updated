import mongoose from "mongoose";

const skillSchema = new mongoose.Schema({
  title: String,
  proficiencyLevel: String,
  svg: {
    public_id: {
      type: String,
    },
    url: {
      type: String,
      required: true,
    },
  },
});

export const Skill = mongoose.model("Skill", skillSchema);
