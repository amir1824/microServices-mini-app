const express = require('express')
const bodyParser = require('body-parser');
const axios = require('axios')

const app = express()
app.use(bodyParser.json())

const events =[];

app.post('/events', async (req, res) => {
    const event = req.body

    events.push(event);

    await axios.post('http://localhost:6002/events', event).catch((err) => {
        console.log(err.message)
    })
    await axios.post('http://localhost:6001/events', event).catch((err) => {
        console.log(err.message)
    })
    await axios.post('http://localhost:6003/events', event).catch((err) => {
        console.log(err.message)
    })
    await axios.post('http://localhost:6004/events', event).catch((err) => {
        console.log(err.message)
    })


    res.send({ status: 'OK' })
})

app.get('/events',(req,res)=>{
    res.send(events)
})

app.listen(6005, () => {
    console.log('Listring on 6005')
})