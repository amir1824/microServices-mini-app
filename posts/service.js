
const express = require('express')
const { randomBytes} = require('crypto')
const bodyParser =  require('body-parser')
const cors = require('cors')
const axios = require('axios')

const app =express()
app.use(bodyParser.json())
app.enable('trust proxy');
app.use(cors());
app.options('*', cors(
));

const posts = {}

app.get('/posts',(req,res)=>{
    res.send(posts)

})

app.post('/posts', async(req,res)=>{
    const id = randomBytes(4).toString('hex')
    const {title} = req.body

    posts[id]={
        id,title
    }

     await axios.post('http://localhost:6005/events',{
        type: 'PostCreated',
        data:{
            id,title
        }
    }).catch((err)=>{
        console.log(err.message)
    })

    res.status(201).send(posts[id])


})

app.post('/events',(req,res)=>{
    console.log('Reseve event',req.body.type);

    res.send({})
})

app.listen(6002,()=>{
    console.log('On port 6002')
})
