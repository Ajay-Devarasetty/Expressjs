const express = require("express");
const usersRouter = require('./routes/users');  
const productsRouter = require('./routes/products');
const cookieParser = require('cookie-parser');

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(usersRouter);
app.use(productsRouter);

const PORT = process.env.PORT || 3000

app.get('/',(req,res)=>{
    res.cookie('hello', 'world', { maxAge: 10000 });
    res.send({ msg : "hello world" });
})

app.listen(PORT,()=>{
    console.log(`running on port ${PORT} `)
})
