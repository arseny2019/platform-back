const Category = require('../models/category.model');

class CategoryController {
    async createCategory(req, res) {
        try {
            const {name} = req.body;
            const category = new Category({name});
            await category.save();
            res.json({message: `Категория ${name} успешно создана`})
        } catch (e) {
            console.log(e);
            res.status(400).json({message: 'Ошибка при создании категории', error: e})
        }
    }
    async updateCategory(req, res) {
        try {
            const {name} = req.body;
            const _id = req.params.id;
            const category = await Category.updateOne({_id}, {name});
            res.json({message: 'Категория успешно обновлена'})
        } catch (e) {
            console.log(e);
            res.status(400).json({message: 'Ошибка при обновлении категории', error: e})
        }
    }
    async deleteCategory(req, res) {
        try {
            const _id = req.params.id;
            const category = await Category.deleteOne({_id});
            res.json({message: 'Категория успешно удалена'})
        } catch (e) {
            console.log(e);
            res.status(400).json({message: 'Ошибка при удалении категории', error: e})
        }
    }

    async categoryList(req, res) {
        try {
            const list = await Category.find({});
            res.json(list);
        } catch (e) {
            console.log(e);
            res.status(400).json({message: 'Ошибка при получении списка категорий'})
        }
    }
}

module.exports = new CategoryController();
