const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({

  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  role: {
    type: String,
    enum: ["admin", "agent"],
    default: "agent"
  },


  currentLoad: { 
    type: Number, 

    default: function() {
      return this.role === "agent" ? 0 : undefined;
    }
  }

}, {
  timestamps: true 
});



userSchema.pre("save", async function () {



  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  
  } catch (error) {
    console.error("Error hashing password:", error);
    throw error; 
  }
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);