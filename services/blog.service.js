const Blog = require('../models/blog.model');
const createBlog = async (body) => {
 
  await Blog.create(body);
  };

const getBlogs = async () => {
 
  const blogs = await Blog.find({});
  return blogs;

};

module.exports = {
  createBlog,
  getBlogs,
};