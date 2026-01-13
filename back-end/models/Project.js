import mongoose from "mongoose"

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    goalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    collectAmount: {
      type: Number,
      default: 0,
    },

    startDate: {
      type: Date,
      default: Date.now,
    },

    endDate: {
      type: Date,
    },

    status: {
      type: String,
      enum: ["active", "completed", "cancelled"],
      default: "active",
    },
  },
  { timestamps: true }
)

export default mongoose.model("Project", projectSchema)
