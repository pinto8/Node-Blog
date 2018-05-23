const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const postDb = require('./data/helpers/postDb.js');


const server = express();
server.use(bodyParser.json());
server.use(cors());
server.listen(5000, () => {
    console.log('**Server running on port 5000**');
});

const logger = (req, res, next) => {
    console.log('LOGGER'. req.url);
}

server.get('/api/posts', (req, res) => {
    postDb.get()
        .then(posts => {
            res.status(200).json({ posts })
        })
        .catch(err => {
            res.status(500).json({ error: "The posts information could not be retrieved." })
        })
})

server.get('/api/posts/:id', (req, res) => {
    const postId = req.params.id;
    postDb.get(postId)
        .then(post => {
            res.json({ post })
        })
        .catch(err => {
            res.status(404).json({ message: "The post with the specified ID does not exist." })
        })
})

const sendUserError = (msg, res) => {
    res.status(400);
    res.json({ errorMessage: msg });
    return;
};

server.post('/api/posts', (req, res) => {
    const title = req.body.title;
    const contents = req.body.contents;
    const newPost = { title: title, contents: contents };
    if (!title || !contents) {
        return sendUserError("Please provide title and contents for the post.", res)
    }

    db.insert(newPost)
        .then(post => {
            res.status(201).json({ post })
            return newPost;
        })
        .catch(err => {
            res.status(500).json({ error: "There was an error while saving the post to the database" })
        })
});

server.put('/api/posts/:id', (req, res) => {
    const id = req.params.id;
    const title = req.body.title;
    const contents = req.body.contents;
    const newPost = { title: title, contents: contents }

    if (!title || !contents) {
        return sendUserError("Please provide title and contents for the post.", res);
    }

    db.findById(id)
        .then(post => {
            console.log(post)
        })
        .catch(err => {
            res.status(404).json({ message: "The post with the specified ID does not exist." })
        });
    db.update(id, newPost)
        .then(post => {
            res.status(200).json({ newPost })
        })    
        .catch(err => {
            res.status(500).json({ error: "The post information could not be modified." })
        })
})

// server.delete('/api/posts/:id', (req, res) => {
//     const id = req.params.id;
//     let post;
//     db.findById(id)
//         .then( foundPost => {
//             post = foundPost;
//             console.log(post)
//             if (Object.keys(post).length === 0) {
//                 return res.status(404).json({ message: "The post with the specified ID does not exist." });
//             } else {
//                 db.remove(id);
//                 return res.status(200).json(post);
//             }
//         })
//         .catch(err => res.status(500).json({ err }))
// })


server.delete('/api/posts/:id', (req, res) => {
    const { id } = req.params;
    console.log('ID', id);
    db.findById(id)
        .then( foundPost => {
            post = {...foundPost };
            return db.remove(id);
        })
        .then( () => {
            return res.status(200).json(post);
        })
        .catch(err => {
            return res.status(404).json({ message: "The post with the specified ID does not exist." })
        });
})

