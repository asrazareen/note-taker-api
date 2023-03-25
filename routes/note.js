const express = require("express")
const fileupload = require("express-fileupload")
const Note = require("../models/note")
const cors = require("cors")
const router = express.Router()
router.use(express.json())
router.use(fileupload())

const corsOptions ={
    origin:'*', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200,
 }
 
 router.use(cors(corsOptions)) 

router.post("/", async (req, res) => {
    try {
        const { title, description } = req.body
        //console.log(req.body)
        const today = Date.now()
        const date = new Date(today)
        const now = date.toDateString()
        //console.log(now)
        //console.log(date.toDateString())
        const user = req.user
        //console.log(user)

        await Note.create({
            title: title,
            description: description,
            date: now,
            user: user
        })
        res.status(201).json({
            status: "Added Note Successfullt"
        })
    }
    catch (e) {

    }

})
// router.get("/" , async (req,res) => {
//     const data = await Note.find()
//   res.json({
//         data:data
//     })

// })
router.get("/", async (req, res) => {
    const query = req.user
    //console.log(query)
    const notes = await Note.find({ user: query })
    //console.log(notes)
    res.status(200).json({
        data:notes
    })
})


module.exports = router