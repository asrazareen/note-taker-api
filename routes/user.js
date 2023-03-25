const express = require("express")
const {body , validationResult} = require("express-validator")
const User = require("../models/user")
const fileupload = require("express-fileupload")
const bcrypt = require("bcrypt")
const cors = require("cors")
const jwt = require("jsonwebtoken")
const secret = "assignment"

const router = express.Router()
router.use(express.json())
router.use(fileupload())
const corsOptions ={
    origin:'*', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200,
 }
 
 router.use(cors(corsOptions)) 


router.post("/register" ,
body("name").isAlpha().isLength({min:4}), 
body('email').isEmail(),
body('password').isLength({ min: 6, max: 12 })
, async (req, res) => {
    try {
        const errors = validationResult(req);
        //console.log(errors)
        if (!errors.isEmpty()) {
            const error = errors.array()[0];
            if (error.param == "name") {
                return res.status(400).json({
                    message : "Invalid Name"
                });
            } else if (error.param == "email"){
                return res.status(400).json({
                    message : "Invalid Email"
                });
            }else if(error.param == "password"){
                return res.status(400).json({
                    message:"Password should have a min length 6 and max length 12"
                })
            }
             else {
                return res.status(400).json({
                  message: "Invalid Password"
                });
            }
        }
     
        const { name, email, password,conPassword } = req.body;
        if(password != conPassword){
            return res.status(400).json({
                message:"Password and Confirm Password should be same"
            })
            }
        console.log(req.body)
        const user = await User.findOne({ email });
        if (user) {
            return res.status(409).json({
                status: "Failed",
                message: "User already exists"
            });
        }
    
        bcrypt.hash(password, 10, async function (err, hash) {
       
            if (err) {
                return res.status(500).json({ 
                    status: "Failed",
                    message: err.message
                })
            }
            await User.create({
                name,
                email,
                password: hash,
                conPassword:hash
               
            });
            return res.status(200).json({
                status: "Success",
                message : "User registered successfully"
            })
        });
    } catch (e) {
      
        return res.status(500).json({
            status: "Failed",
            message:e.message
        })
    }
} )  

router.post("/login", 
    body('email').isEmail(), async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                  errors: errors.array(),
                  message: "Invalid Email",
                });
            }
            //console.log(req.body)
            const { email, password } = req.body;

            const user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({
                    status: "Failed",
                    message: "User not registered, please register"
                })
            }
            bcrypt.compare(password, user.password, function (err, result) {
                if (err) {
                    return res.status(500).json({
                        status: "Failed",
                        message: err.message
                    })
                }
                if (result) {
                    const token = jwt.sign({
                        exp: Math.floor(Date.now() / 1000) + (60 * 60),
                        data: user._id,
                    }, secret);

                    return res.status(200).json({
                        status: "Succces",
                        message : "Login successfully",
                        token
                    })
                }
                 else {
                    return res.status(400).json({
                        status: "Failed",
                        message: "Wrong Password"
                    })
                }
            });


        } catch (e) {
            return res.status(500).json({
                status: "Failed",
                message: e.message
            })
        }
    });
module.exports = router;