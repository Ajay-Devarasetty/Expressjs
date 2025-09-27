const express = require("express");
const { query ,body, validationResult } = require("express-validator");

const app = express();

app.use(express.json())
const PORT = process.env.PORT || 3000

const userData=[
            {"id":1,"user":"ajay", "displayName":"ajay"},
            {"id":2,"user":"abcdefg", "displayName":"abcdefgh"},
            {"id":3,"user":"abcd", "displayName":"abcde"}
        ]

const resolveUserByIndex = (req, res , next) => {
    const{params:{id}} = req;
    const parsedId = parseInt(id);
    if(isNaN(parsedId)) return res.sendStatus(400)
    const findUserIndex = userData.findIndex((user)=>user.id===parsedId)
    if(findUserIndex === -1) return res.sendStatus(404);
    req.findUserIndex = findUserIndex;
    next();
}

app.get('/',(req,res)=>{
    res.send({ msg : "hello world" });
})

app.get('/api/users', 
    query('filter')
    .isString().withMessage("it should be a string")
    .notEmpty().withMessage("it shouldn't be empty")
    .isLength({min:3, max:20}).withMessage('must be atleast 3 to 20 char') ,(req,res)=>{
    const result = validationResult(req);
    console.log(result);
    const {query:{filter,value}}=req;
    if(filter && value){
        res.send(userData.filter((user)=>user[filter].includes(value)))
    }
    res.send(userData)
})

app.post('/api/users',
    body('user').
    notEmpty().withMessage("user name not be empty").
    isLength({min:3, max:20}).withMessage('must be between 3 and 20 characters')
    , (req,res)=>{
    const result = validationResult(req);
    const {body} = req;
    const newUser = { id : userData[userData.length - 1].id +1 , ...body };
    userData.push(newUser);
    return res.status(201).send(newUser);
})

app.get('/api/users/:id' ,resolveUserByIndex,(req,res)=>{
    const {findUserIndex} = req;
    const findUser = userData[findUserIndex];
    if(!findUser) return res.sendStatus(404);
    res.send(findUser);
})

app.put("/api/users/:id",resolveUserByIndex, (req,res)=>{
    const {body, findUserIndex} = req;
    userData[findUserIndex] = { id: userData[findUserIndex].id, ...body };
    return res.sendStatus(200);
})

app.patch("/api/users/:id",resolveUserByIndex, (req,res)=>{
    const { body,findUserIndex } = req;
    userData[findUserIndex] = { ...userData[findUserIndex], ...body}
    res.sendStatus(200);
})

app.delete("/api/users/:id",(req,res)=>{
    const { findUserIndex } = req;
    userData.splice(findUserIndex ,1);
    return res.sendStatus(200);
})

app.listen(PORT,()=>{
    console.log(`running on port ${PORT} `)
})
