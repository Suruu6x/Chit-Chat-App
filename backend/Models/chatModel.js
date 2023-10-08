import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    chatname: {
      type: String,
      trim: true,
    },
    isgroupchat: {
      type: Boolean,
      default: false,
    },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
      },
    ],
    latestmessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Messages",
    },
    groupadmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Chat", chatSchema);
