const express = require('express');
const Posts = require('../data/db');
const router = express.Router();


router.post('/', (req, res) => {
    const postBody = req.body;
    console.log(postBody)
    if(!postBody.title || !postBody.contents){
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." })   
    }else{
        Posts.insert(postBody)
        .then(post => {
            Posts.find()
            .then(posts => {
                res.status(200).json(posts)
            })
            .catch(err => {
                res.status(400).json({ errorMessage: "There was an error showing full Posts after saving new post" })
            })
        })
        .catch(err => {
            res.status(500).json({ error: "There was an error while saving the post to the database" })  
        })
        
    }

})


router.get('/', (req, res) => {
    Posts.find()
    .then(posts => {
        res.status(200).json(posts)
    })
    .catch(err => {
        res.status(500).json({ error: "The posts information could not be retrieved." })  
    })
})

router.get('/:id', (req, res) => {
    const { id } = req.params;
    Posts.findById(id)
    .first() //takes first object out of array, bc only one obj in array, empties array
    .then(specificPost => { //checking if it has a value
        if(specificPost){
            console.log(specificPost)
            res.status(200).json(specificPost)
        }else{
            res.status(404).json({ message: "The post with the specified ID does not exist." })
        }
    })
    .catch(err => {
        res.status(500).json({ error: "The post information could not be retrieved." })  
    })
})






router.delete('/:id', (req, res) => {
    const { id } = req.params;
    console.log(req.params.id)
    Posts.remove(id)
    .then(specificPost => {
        if (specificPost){
            res.status(200).json({ message: "Post successfully deleted." })
        }else{
            res.status(404).json({ message: "The post with the specified ID does not exist." })
        }
    })
    .catch(err => {
        res.status(500).json({ error: "The user could not be removed" })
    })
})


router.put('/:id', (req, res) => {
    const { id } = req.params;
    const changes = req.body;
    
    if(!changes.title || !changes.contents){
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
    }else{
        Posts.update(id, changes)
        .then(foundPostId => {
            //return successful number of the objects that you have deleted 0===falsy; 1===truthy
            if (!foundPostId){
                //!foundPost === falsy
                res.status(404).json({ message: "The post with the specified ID does not exist." })
            }else{    
                res.status(200).json(changes)
            }
        })
        .catch(err => {
            res.status(500).json({ error: "The post information could not be modified." })
        })
    }
})


router.get('/:id/comments', (req, res) => {
    const postId = req.params.id;
    console.log(postId)
    Posts.findPostComments(postId)
    .first()
    .then(post => {
        if(!post){
            res.status(404).json({ message: "The post with the specified ID does not exist." })
        }else{
            res.status(200).json(post)
        }
    })
    .catch(err => {
        res.status(500).json({ error: "The comments information could not be retrieved." })
    })
})



router.post('/:id/comments', (req, res) => {
    const comment = req.body;

    if(comment.text && comment.post_id){
        Posts.insertComment(comment)
        .then(newComment => {
            res.status(201).json(newComment)
        })
        .catch(err => {
            res.status(404).json({ message: "The post with the specified ID does not exist." })
        })
    }else{
        res.status(400).json({ errorMessage: "Please provide text for the comment." })
    }
})







module.exports = router;