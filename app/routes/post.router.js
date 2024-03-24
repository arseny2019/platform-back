const Router = require('express');
const router = new Router();
const controller = require('../controllers/post.controller');
const categoryController = require('../controllers/category.controller');
const {body} = require("express-validator");

router.get('/', controller.getAllPosts);
router.post('/create', controller.createPost);
router.get('/categoryList', categoryController.categoryList);
router.post('/category',[
    body('name', 'Название должно быть больше 2 и меньше 32 символов').isLength({min: 3, max: 32})
], categoryController.createCategory);
router.put('/category/:id',[
    body('name', 'Название должно быть больше 2 и меньше 32 символов').isLength({min: 3, max: 32})
], categoryController.updateCategory);
router.delete('/category/:id', categoryController.deleteCategory);

module.exports = router;
