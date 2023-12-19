const authentication = (req , res, next) =>
{
    const Username = req.body.Username;
    const pass = req.body.pass;
    console.log(Username , pass);
    if(Username != "Nishant" || pass != "p")
    {
        res.send("Authentication failed")
    }
    else
    {
        console.log("I have Checked Everything is Fine");
        next();
    }
    
}


module.exports = authentication