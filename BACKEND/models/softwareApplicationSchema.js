import mongoose from "mongoose";

const softwareApplicatonSchema = new mongoose.Schema({
  name: String,
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
export const SoftwareApplication = mongoose.model(
  "SoftwareApplication",
  softwareApplicatonSchema
);
