const mongoose = require("mongoose");


const userSchema = mongoose.Schema(
  {
    name: { 
      type: String,
      required: true,
      trim: true,
    },
 
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    phone: {
      type: Number,
      required: false, 
    },
    password: {
      type: String,
      required: true,
    },
    image: 
        {
          data: Buffer,
          contentType: String,
        }
      ,
    status:{
      type:String,
      default:"Active"
    },
    address:[ {
      name:{
        type:String,    
        default:function(){
         return this.name
        }
      },
      mobile:{
        type:Number,
       
        default: function(){
          return this.mobile
        }
      },

      locality: {
        type: String,
        required: true, 
      },
      buildingName:{
        type:String,
        required:true
      }, 
      landmark:{
        type:String,
        required:true, 
      },
      city: {
        type: String,
        required: true, 
      },
      state: {
        type: String,
        required: true,
      },
      pincode: {
        type: String, 
        required: true, 
      },
      addressType:{
        type:String,
        
      },
     
    },
   ],
   
});
module.exports = mongoose.model("User", userSchema);
