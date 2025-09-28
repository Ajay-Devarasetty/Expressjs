const {Router} = require("express");
const { query, validationResult, checkSchema, matchedData } = require("express-validator");
const userData  = require("../utils/constants")
const router = Router();
const { createUserValidationSchema } = require("../utils/validationSchemas");
const resolveUserByIndex = require("../utils/middlewares")

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

router.post('/api/users',checkSchema(createUserValidationSchema),(req,res) => {
    const result = validationResult(req);

    if(!result.isEmpty())
        return res.status(400).send({ errors : result.array()})

    const data = matchedData(req);
    const newUser = { id : userData[userData.length - 1].id +1 , ...data };
    userData.push(newUser);
    return res.status(201).send(newUser);
})

router.get('/api/users/:id' ,resolveUserByIndex,(req,res)=>{
    const {findUserIndex} = req;
    const findUser = userData[findUserIndex];
    if(!findUser) return res.sendStatus(404);
    res.send(findUser);
})

router.put("/api/users/:id",resolveUserByIndex, (req,res)=>{
    const {body, findUserIndex} = req;
    userData[findUserIndex] = { id: userData[findUserIndex].id, ...body };
    return res.sendStatus(200);
})

router.patch("/api/users/:id",resolveUserByIndex, (req,res)=>{
    const { body,findUserIndex } = req;
    userData[findUserIndex] = { ...userData[findUserIndex], ...body}
    res.sendStatus(200);
})

router.delete("/api/users/:id",(req,res)=>{
    const { findUserIndex } = req;
    userData.splice(findUserIndex ,1);
    return res.sendStatus(200);
})

module.exports = router;