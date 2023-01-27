const Router = require('express');
const router = new Router();
const controller = require('../controllers/blog.controller')

router.get('/', controller.getAllPosts);
router.post('/create', controller.createPost);

module.exports = router;
