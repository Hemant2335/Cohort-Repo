const express = require("express")
const zod = require("zod");
const app = express();
const PORT = 3000;
const authentication = require("./Middleware")

// Scehema for ZOD
const Schema  = zod.string();

// Schema like this
//{
//   email : string => email
//   pass : atleast 8 letters
//   country : "IN" , "US"
//}

const schema = zod.object({
    email : zod.string().email(),
    pass : zod.string().min(8),
    country : zod.literal("IN").or(zod.literal("US")),
    kidneys : zod.array(zod.number())
})

app.use(express.json());
app.use(authentication);

// Global Catches

app.use((err, req,res,next)=>{
    res.status(500).send("Internal Error Occured");
})

app.get("/" , (req,res)=>{
    const n = req.query;
    const response = Schema.safeParse(kidneys);
    if(!response.success)
    {
        res.send("Invalid Input");
    }
    else{res.send("I am Running");}
    
})

app.listen(PORT , ()=>{
    console.log(`The Server is Listening on Port ${PORT}`);
})