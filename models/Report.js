import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    category: { type: String, required: true },

    location: {
      latitude: Number,
      longitude: Number,
      address: String
    },

    imagePath: String,

    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    status: {
      type: String,
      enum: ["PENDING", "IN_PROGRESS", "RESOLVED"],
      default: "PENDING"
    },

    upvotes: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User" }
    ],

    // ✅ COMMENTS FIELD (correct position)
    comments: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now }
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model("Report", reportSchema);
