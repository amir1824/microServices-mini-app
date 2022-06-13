const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios')

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.options('*', cors(
));

//Save the data of posts
const posts = {};

const eventHandler = (type, data) => {

    if (type === 'PostCreated') {
        const { id, title } = data;

        posts[id] = { id, title, comments: [] };

    }

    if (type === 'CommentCreated') {

        const { id, content, postId, status } = data;

        const post = posts[postId];
        post.comments.push({ id, content, status });

    }
    //Update comment

    if (type === 'CommentUpdated') {
        const { id, content, postId, status } = data;

        const post = posts[postId];

        const comment = post.comments.find((comment) => {
            return comment.id === id;
        });

        comment.status = status;
        comment.content = content;

    }
}


app.get('/posts', (req, res) => {
    res.send(posts)

})

app.post('/events', (req, res) => {
    const { type, data } = req.body
    eventHandler(type, data)


    console.log(posts)

    res.send({})

})

app.listen(6003,  async() => {
    console.log('port on 6003')

    const res= await axios.get('http://localhost:6005/events');

    for(let event of res.data){
        console.log('Proccessing event:',event.type);
        eventHandler(event.type,event.data)
    }
})



