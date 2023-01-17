const Router = require('express');
const router = new Router();
const controller = require('../controllers/blogController')

router.get('/', controller.getAllPosts);
router.post('/create', controller.createPost);

module.exports = router;
