import { mongoose } from "mongoose";
const validator = require('validator');

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "Please insert a username"],
      minLength: [3, "That's too short"],
    },
    password: {
      type: String,
      required: [true, "Please insert a password"],
      minLength: [8, "That's too short"],
    },
    email:{
      type: String,
      required: [true,"Please insert a email"],
      validate:{
        validator: validator.isEmail,
        message: '{VALUE} is not a valid email',
        isAsync: false
      }
    }
  },
  { timestamps: true }
);
const profileSchema = new Schema(
  {
    profilePicture:{
      type:String,
      required: [true,"Please insert profile image"]
    },
    fullname:{
      type:String,
      required: [true,"Please insert name"]
    },
    age:{
      type:Number,
      required: [true,"Please insert age"]
    },
    location:{
      type:String,
      required: [true,"Please insert location"]
    },
    description: {
      type: String,
      required: [true,"Please insert a description"],
      maxLength:1000
    },
    skills:{
      type: String,
      required: [true,"Please insert skills"]
    },
    interests:{
      type: String,
      required: [true,"Please insert interests"]
    },
    jobType:{
      type: String,
      required: [true,"Please select a job type"]
    },
    linkedin:{
      type: String,
    },
    portofolio:{
      type: String,
    },
    phoneNumber:{
      type: String,
      required: [true,"Please insert phone number"]
    },
    email:{
      type: String,
      required: [true,"Please insert a email"],
      validate:{
        validator: validator.isEmail,
        message: '{VALUE} is not a valid email',
        isAsync: false
      }
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    createdAt: {
      type: Date,
    }
  }
)
export const models = [
  {
    name: "User",
    schema: userSchema,
    collection: "users",
  },
  {
    name: "Profile",
    schema: profileSchema,
    collection: "profiles"
  }
];
