import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    trim: true // removes extra spaces from the name
  },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true // converts email to lowercase for consistency
  },
  password: { 
    type: String, 
    required: true, 
    minlength: 6 // ensures password is at least 6 characters
  },
  phone: { 
    type: String, 
    required: true, 
    unique: true, 
    match: [/^\+?\d{10,15}$/, "Please enter a valid phone number"]
  }
}, { timestamps: true });

export default mongoose.model("User", UserSchema);
