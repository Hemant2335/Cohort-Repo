const express = require("express")
const bodyParser = require("body-parser")

const app = express()
const PORT = 3000;
// We use Middleware like bodyparser to parse the body to json 
app.use(bodyParser.json())

app.get("/check" , (req , res)=>{
    res.send("HomePage")
})

app.listen(PORT ,()=>{
    console.log(`Server Running on ${PORT}`)
})