const {Router} = require("express")

const router = Router();

router.get("/api/products", (req,res)=>{
    if(req.cookies.hello && req.cookies.hello==="world")
       return res.send("products list");
    return res.status(403).send({msg:"invalid cookies"});
})

module.exports = router;

