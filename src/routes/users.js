const {Router} = require("express");
const { query, validationResult } = require("express-validator");

const router = Router();

router.get("/api/users", 
    query('filter')
    .isString()
    .withMessage("it should be a string")
    .notEmpty()
    .withMessage("it shouldn't be empty")
    .isLength({min:3, max:20})
    .withMessage('must be atleast 3 to 20 char'),
    (req,res)=>{
    const result = validationResult(req);
    console.log(result);
    const {query:{filter,value}}=req;
    if(filter && value){
        res.send(userData.filter((user)=>user[filter].includes(value)))
    }
    res.send(userData)
})

module.exports = router;