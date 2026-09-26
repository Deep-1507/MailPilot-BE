import mongoose from "mongoose";
import bcrypt from "bcrypt";

const businessUserGroupSchema = new mongoose.Schema(
  {
    groupName: {
      type: String,
      required: true,
      trim: true,
      minLength: 1,
      maxLength: 50,
    },
    createdByUserId: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      minLength: 1,
      maxLength: 50,
    },
    users: [
      {
        name: {
          type: String,
          trim: true,
          minLength: 1,
          maxLength: 50,
        },
        email: {
          type: String,
          trim: true,
          lowercase: true,
          match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        },
      },
    ],
  },
  {
    collection: "businessusersgroup", // Specify the collection name here
    timestamps: true,
  }
);

const BusinessUserGroup = mongoose.model(
  "BusinessUserGroups",
  businessUserGroupSchema
);

export default BusinessUserGroup;
