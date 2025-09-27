const express = require("express");
const { query ,body, validationResult, matchedData, checkSchema } = require("express-validator");
const { createUserValidationSchema } = require("./utils/validationSchemas");
const usersRouter = require('./routes/users');

const app = express();

app.use(express.json())
app.use(usersRouter);

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

app.post('/api/users',checkSchema(createUserValidationSchema),(req,res) => {
    const result = validationResult(req);

    if(!result.isEmpty())
        return res.status(400).send({ errors : result.array()})

    const data = matchedData(req);
    const newUser = { id : userData[userData.length - 1].id +1 , ...data };
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
