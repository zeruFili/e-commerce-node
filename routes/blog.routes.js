const express = require('express');
const router = express.Router();
const { createBlog, getBlogs } = require('../controllers/blog.controller'); 
const {createBlogSchema} = require('../validations/blog.validation')

const validate = require('../middleware/validate');
router.post('/blogs', validate(createBlogSchema), createBlog);
router.get('/blogs',  getBlogs);

module.exports = router;