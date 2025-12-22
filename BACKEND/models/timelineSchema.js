import mongoose from "mongoose";

const timelineSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title required!"],
  },
  description: {
    type: String,
    required: [true, "Description required!"],
  },
  // Optional education-specific fields (for college journey entries)
  educationYear: {
    type: String,
  },
  cgpa: {
    type: String,
  },
  timeline: {
    from: {
      type: Date,
      required: [true, "Start date required!"],
    },
    to: {
      type: Date,
      required: [true, "End date required!"],
    },
  },
});

export const Timeline = mongoose.model("Timeline", timelineSchema);
