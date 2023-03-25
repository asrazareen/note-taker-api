const express = require("express")
const Port = 8090 || process.env.Port
const mongoose = require("mongoose")
const UserRoute = require("./routes/user")
const noteRoute = require("./routes/note")
const token = "assignment"
const jwt = require("jsonwebtoken")
const cors = require("cors")
const secret = "assignment"

const app = express()
app.use(express.json())
const corsOptions ={
    origin:'*', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200,
 }
 
 app.use(cors(corsOptions)) 

app.use("/note" , async (req,res,next)=>{
    const token = req.headers.authorization;
    //console.log(token)
  if(token){
    
      jwt.verify(token, secret, function(err, decoded) {
          if(err) {
              console.log(err);
             return res.status(403).json({
              status: "Failed", 
              message: "Token is not valid"
              });
          }
          req.user = decoded.data;
        
          next();
        });

  }else {
      res.status(403).json({
          status: "Failed", 
          message: "User is not authenticated"
      })
  }
} ) 

app.use("/user" , UserRoute)
app.use("/note" , noteRoute)



mongoose.connect("mongodb+srv://asrazareen:asra1999@cluster0.s2fmyxh.mongodb.net/users" )
.then(() => {console.log("connected to db")})

app.listen(Port , () => {console.log(`server is up at Port ${Port}`)})