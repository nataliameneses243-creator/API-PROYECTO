const express = require('express');
const router = express.Router();
const Post = require('../models/Post'); //Importo el modelo de la base de datos.

router.get('/', async (req,res) => { //llamar todo lo de la base de datos.

    try{
        const posts = await Post.find();
        res.json(posts);
        
    } catch(err) {
        res.status(500).json({message: err.message});
    }


});

router.get('/:postId', async (req,res) => { //llamar por ID.

    try{
        const posts = await Post.find();
        res.json(posts);
        
    } catch(err) {
        res.status(500).json({message: err.message});
    }


});
router.post('/', async (req, res) => {  // crear un post
    const post = new Post({
        title: req.body.title,
        description:req.body.description,
    });
    try{
        const savedPost = await post.save();
        res.json(savedPost);
    } catch (err) {
        res.json({message: err.message});
    }
});

router.patch('/:postId',async (req, res) => { //Actualizar el post
try{
     const updatePost = await Post.updateOne({ _id: req.params.postId}, {$set: { title: 
        req.body.title, description: req.body.description}});
        res.json(updatePost);

} catch (err) {
    res.json({message: err.message });
}

});

router.delete('/:postId', async (req, res) => { //eliminar post
    try{
        const removedPost = await Post.findByIdAndDelete(req.params.postId);
        if(!removedPost){
            return res.status(404).json({message: "Post no encontrado"});
        }
    
    } catch(err){
        res.status(500).json({message: "Error de conexion"});
    }


});

module.exports=router; //exporto el router.