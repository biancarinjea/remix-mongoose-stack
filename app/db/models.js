import { mongoose } from "mongoose";
const validator = require('validator');

const { Schema } = mongoose;

const snippetSchema = new Schema({
  title: {
    type: String,
    required: [true, "Please insert a title"],
    minLength: [3, "That's too short"],
  },
  language: {
    type: String,
    required: [true, "Please insert a code language"],
  },
  snippet: {
    type: String,
    required: [true, "Please insert a snippet"],
    minLength: [3, "That's too short"],
  },
  description: {
    type: String,
    required: [true, "Please insert a description"],
    minLength: [3, "That's too short"],
  },

  favourite: {
    type: Boolean,
  },

  updatedAt: {
    type: Date, 
  },

  createdAt: {
    type: Date,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
},
{ timestamps: true }
);
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
    description: {
      type: String,
      required: [true,"Please insert a description"]
    },
    skills:{
      type: String,
      required: [true,"Please insert skills"]
    },
    interests:{
      type: String,
      required: [true,"Please insert interests"]
    },
    linkedin:{
      type: String,
      required: [true,"Please insert linkedin"]
    },
    portofolio:{
      type: String,
      required: [true,"Please insert portofolio"]
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    }
  }
)
export const models = [
  {
    name: "Snippet",
    schema: snippetSchema,
    collection: "snippets",
  },
  {
    name: "User",
    schema: userSchema,
    collection: "users",
  }
];
