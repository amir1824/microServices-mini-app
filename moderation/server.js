const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json())

app.post('/events', async (req, res) => {

    const { type, data } = req.body

    if (type === 'CommentCreated') {

        const status = data.content.includes('banana') ? 'rejected' : 'approved'

        await axios.post('http://localhost:6005/events', {
            type: 'CommentModerated',
            data: {
                id: data.id,
                postId: data.postId,
                status,
                content: data.content
            }
        }).catch((err) => {
            console.log(err.message)
        })

        res.send({})


    }

})

app.listen(6004, () => {
    console.log('on Port 6004')
})