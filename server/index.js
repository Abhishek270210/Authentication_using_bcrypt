const express=require("express");
const mongoose=require("mongoose");
const bodyParser=require("body-parser");
const cors=require("cors");
const bcrypt=require("bcrypt");

const app=express();

app.use(cors());
app.use(express.json({limit:"30mb",extended:true}));
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect("mongodb://localhost:27017/AuthDB",{useNewUrlParser:true,useUnifiedTopology:true},(err)=>{
    if(err)
    console.log(err);
    else
    console.log("database is connected successfully !!!");
});

const userSchema=new mongoose.Schema({
    name:String,
    email:String,
    password:String
});

const userModel=mongoose.model("user",userSchema);

app.get('/',(req,res)=>{
    res.send("Hello this is the simple response")
});

app.post('/signup',async(req,res)=>{
    const user=req.body;
    console.log(user);
    try {
        const Existinguser=await userModel.findOne({email:user.Email});
        if(Existinguser)
        return res.json({status:400,message:"User with this email already exist"});
        const hashedPassword=await bcrypt.hash(user.Password,10);
        console.log(hashedPassword);
        const newUser=await new userModel({name:`${user.Firstname} ${user.Lastname}`,email:user.Email,password:hashedPassword});
        await newUser.save();
        res.json({status:200,message:"account created"});
    } catch (error) {
        console.log(error);
        res.status(500).json({message:error});
    }
})

app.post('/login',async(req,res)=>{
    const user=req.body;
    try {
       
        const Existinguser=await userModel.findOne({email:user.Email});
        if(!Existinguser) return res.json({status:404, message: "User doesn't exist" });
      
         const iscorrectpass=await bcrypt.compare(user.Password,Existinguser.password);

         if(!iscorrectpass) return  res.json({status:400,message:"enter valid credentials"});

       res.json({status:200,message:"login success"});

    } catch (error) {
        res.status(500).json({message:"something went wrong"});
    }
})

app.listen(5000,(err)=>{
    if(err)
    console.log(err);
    else
    console.log("server started at port 5000");
});