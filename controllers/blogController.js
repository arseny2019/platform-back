const Post = require('../models/Post');

class BlogController {
    async createPost(req, res) {
        try {
            const {author, content} = req.body;
            const post = new Post({
                author,
                content,
                createDate: new Date().toLocaleDateString(),
            });
            await post.save();
            res.json({message: 'Пост успешно создан'})
        } catch (e) {
            console.log(e);
            res.status(400).json({message: 'Error occurred while creating post', error: e})
        }
    }

    async getAllPosts(req, res) {
        try {
            const allPosts = await Post.find({});
            res.json(allPosts);
        } catch (e) {
            console.log(e);
            res.status(400).json({message: 'Error occurred while getting posts'})
        }
    }
}

module.exports = new BlogController();
