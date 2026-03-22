const express = require("express")

const app = express()
app.use(express.json())

// Dummy database
let users = []

// Service
function createUser(name){
    const user = { id: users.length + 1, name }
    users.push(user)
    return user
}

// Controller
function addUser(req,res,next){
    try{

        const {name} = req.body

        if(!name){
            return res.status(400).json({message:"Name is required"})
        }

        const user = createUser(name)

        res.status(201).json({
            message:"User created",
            data:user
        })

    }catch(err){
        next(err)
    }
}

// Route
app.post("/users",addUser)

// Central error handler
app.use((err,req,res,next)=>{
    res.status(500).json({
        message:err.message
    })
})

app.listen(3000,()=>{
    console.log("Server running on port 3000")
})