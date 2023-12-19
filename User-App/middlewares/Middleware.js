const jwt = require("jsonwebtoken");
require("dotenv").config();
const jwtsecret = process.env.JWT_SECRET ;
const User = require("../models/User")

const Authentication = async(req , res , next) =>
{
    try {
        const token = req.headers['auth'];
        if(!token)
        {
            return res.send("Insufficient Permission")
        }
        const decode = jwt.verify(token, jwtsecret);
        if(!decode)
        {
            return res.send("Invalid token")
        }
        else{
            const Email = decode.Email;
            const user = await User.findOne({Email : Email});
            if(!user)
            {
                return res.send("Invalid token")
            }
            else{
                next();
            } 
        }
        
    } catch (error) {
        res.status(500).send("Internal Error Occured")
    }
}

module.exports = Authentication;