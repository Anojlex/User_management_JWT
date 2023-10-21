const { default: mongoose } = require("mongoose");
const User=require("../models/userModel")
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

const securePassword = async (password) => {
    try {
      const passwordHash = await bcrypt.hash(password,10);
      return passwordHash;
    } catch (error) {
      console.log(error.message);
    }
  };

  const createAccessToken=(user)=> {

    return jwt.sign({ userId: user._id }, "accessKey", { expiresIn: '15m' });
  }
  
  const createRefreshToken=(user)=> {
    return jwt.sign({ userId: user._id },"accessKey", { expiresIn: '1d' });
  }



  const userRegistration = async (req, res) => {
   console.log(req.body);
  
    try {
      const{name,phoneNumber,email,password}=req.body

       const spassword= await securePassword(password)

      const user = new User({
        name: name,
        email: email,
        phone: phoneNumber,
        password: spassword,
      });
  
      const result = await user.save();
    
      const userdata = await User.findOne({ email: email });
      const accessToken= createAccessToken(userdata)
      const refreshToken=createRefreshToken(userdata)
      req.session.id=userdata._id
       res.json({
        accessToken:accessToken,
        refreshToken:refreshToken,
        user:userdata            
       });

    } catch (error) {
      console.log(error.message);
      res.status(500).json({ error: "Registration failed" });
    }
  };
  
 

  



  const verifyLogin = async (req, res) => {
    try {
     
      const { email, password } = req.body;
  
      const userdata = await User.findOne({ email: email });
 
      if (userdata) {
        if (userdata.status === "Active") {
          const passwordMatch = await bcrypt.compare(password, userdata.password);
          if (passwordMatch) {
          
            req.session.userId = userdata._id

            req.session.isAuth = "true"
     


              const accessToken= createAccessToken(userdata)
              const refreshToken=createRefreshToken(userdata)
              
             
               res.json({
                accessToken:accessToken,
                refreshToken:refreshToken,
                user:userdata            
               });

          } else {
            res.status(401).json({ message: "Invalid Password" }); 
          }
        } else {
          res.status(403).json({ message: 'Account blocked. Contact customer support' }); 
        }
      } else {
        res.status(404).json({ message: 'User not found' }); 
      }
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ message: 'Error in login.Try again...' }); 
    }
  };
  
  const fetchSingleUserData = async (req, res) => {
    const token = req.header('Authorization');
  
    try {
      const tokenParts = token.split(' ');
      if (tokenParts.length !== 2) {
        throw new Error('Invalid token format');
      }
  
      const accessToken = tokenParts[1];
      const secret = 'accessKey';
  
      try {
        const decoded = jwt.verify(accessToken, secret);
        const userId = decoded.userId;
  
        const userData = await User.findOne({ _id: new mongoose.Types.ObjectId(userId) });
  
        res.json(userData);
      } catch (error) {
       
        if (error.name === 'TokenExpiredError') {
        
          res.status(401).json({ message: 'Access token has expired' });
        } else {
        
          console.error(error.message);
          res.status(500).json({ message: 'Failed to fetch User Details' });
        }
      }
    } catch (error) {
      console.error(error.message);
      res.status(401).json({ message: 'Invalid token format' });
    }
  };
  
  
  
  


const fetchUserData=async(req,res)=>{

  const userdata = await User.find({});

     res.json(userdata); 
   }


const updateUser = async (req, res) => {
  try {
   
    const { name, email, phoneNumber, password, id } = req.body;

    const spassword = await securePassword(password);

    await User.updateOne({ _id: new mongoose.Types.ObjectId(id) }, {
      $set: { name: name, phone: phoneNumber, email: email, password: spassword }
    }).exec(); 

    const users = await User.find({});
   
    res.json(users);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Failed to Update User Details" });
  }
}

const deleteUser=async(req,res)=>{

  try{
const id=req.body._id
console.log("id",id);
const deleted= await User.deleteOne({ _id: new mongoose.Types.ObjectId(id) });
const users = await User.find({});
   
    res.json(users);
  }catch(error){
    console.log(error.message);
  }
}

const verifyAdminLogin=async(req,res)=>{
  const{email,password}=req.body
console.log(req.body);
  const userdata = await User.findOne({ email: email });

  if(!userdata){
    res.status(404).json({ message: 'User not found' });
  }
else{
  const passwordMatch = await bcrypt.compare(password, userdata.password);
 
if (passwordMatch) {
          
  res.json(userdata);
}else{
  res.status(401).json({ message: "Invalid Password" }); 
}
}
}


const generateNewAccessToken=()=>{
  const refreshToken = req.header('Authorization');

  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token is missing' });
  }

  try {
   
    const secret = 'accessKey'; 
    const decoded = jwt.verify(refreshToken, secret);

 
    const currentTimestamp = Date.now() / 1000; 
    if (decoded.exp < currentTimestamp) {
      return res.status(401).json({ message: 'Refresh token has expired' });
    }

    const accessToken = createAccessToken({ userId: decoded.userId });

    res.json({ accessToken });
  } catch (error) {
    console.error(error.message);
    res.status(401).json({ message: 'Invalid refresh token' });
  }

}




  module.exports={userRegistration,
    verifyLogin,
    fetchUserData,
    updateUser,
    deleteUser,
    verifyAdminLogin,
    fetchSingleUserData,
    generateNewAccessToken,
  }