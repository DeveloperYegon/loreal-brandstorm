
const mongoose =require("mongoose")
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

const userSchema = new mongoose.Schema({
user_id:{
    type:String,
    required:true,
    default: uuidv4, // Automatically generate UUID
},
name:{
    type:String,
    // required:true
},
concerns:{
    type:[String],
    default:[],

    // required:true
},
age:{
    type:Number,
    // required:true
},
gender:{
    type:String,
    // required:true
},
skinTone:{
    type:String,
    // required:true
},
isPremium:{
    type:Boolean,
    default:false,
    // required:true
},
subscriptionAmount:{    
    type:Number,
    default:0,
    // required:true
},
termsAccepted:{
    type:Boolean,
    default:false,
    // required:true
},
eyeColor:{
    type:String,
    // required:true
},
hairColor:{
    type:String,
    // required:true
},
hairType:{
    type:String,
    // required:true
},
subscriptionPlan:{
    type:String,
    default:"annual",
    // required:true
},
subscriptionDate:{
    type:Date,
    // required:true
},
subscriptionExpiry:{
    type:Date,
    // required:true
},
subscriptionStatus:{
    type:String,
    default:"inactive",
    // required:true
},
skinType:{
    type:String,
    // required:true
},
lifestyle:{
    type:String,
    // required:true
},
Environ:{
    type:String,
    // required:true
},
email:{
    type:String,
    required:true,
    unique:true,
    validate: {
        validator: function (value) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        },
        message: "Invalid email format",
      }
},
role:{
    type:String,
    required:true,
    default: "user", // Default role
    enum: ["user", "admin"] // Restrict allowed values
},
password:{
    type:String,
    required:true
},
},{ timestamps: true })


// Hash password before saving
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
  
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      next();
    } catch (err) {
      next(err);
    }
  });

  //compare passwords
  userSchema.methods.comparePassword = async function (enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password);
  };

module.exports = mongoose.model("User",userSchema)