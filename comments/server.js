const express = require('express')
const { randomBytes } = require('crypto')
const bodyParser = require('body-parser');
const cors = require('cors')
const axios = require('axios')

const app = express()
app.use(bodyParser.json())
app.enable('trust proxy');
app.use(cors());
app.options('*', cors(
));


const commentsByPostId = {}


app.get('/posts/:id/comments', (req, res) => {
  res.send(commentsByPostId[req.params.id] || []);
});

app.post('/posts/:id/comments', async (req, res) => {
  //post the data 
  const commentId = randomBytes(4).toString('hex');
  const { content } = req.body;

  //if its undefined just give empty array
  const comments = commentsByPostId[req.params.id] || [];

  //push the id and content to comments 
  comments.push({ id: commentId, content, statuss: 'pending' });

  //get the comments from body
  commentsByPostId[req.params.id] = comments;

  //send to event bus

  await axios.post('http://localhost:6005/events', {
    type: 'CommentCreated',
    data: {
      id: commentId,
      content,
      postId: req.params.id,
      statuss: 'peding',
    },
  }).catch((err) => {
    console.log(err.message)
  })

  res.status(201).send(comments);

});

app.post('/events', async (req, res) => {
  console.log('Reseved event', req.body.type);

  const { type, data } = req.body;

  //Updated status

  if (type === 'CommentModerated') {

    const { postId, id, status, content } = data

    const comments = commentsByPostId[postId]

    const comment = comments.find(comment => {
      return comment.id === id;
    })

    comment.statuss = status

    await axios.post('http://localhost:6005/events', {
      type: 'CommentUpdated',
      data: {
        id,
        status,
        postId,
        content
      }
    }).catch((err) => {
      console.log(err.message)
    })

  }

  res.send({})
})

app.listen(6001, () => {
  console.log('On port 6001');

});

