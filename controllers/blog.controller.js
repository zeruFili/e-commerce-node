const catchAsync = require('../utils/catchAsync');
const blogeservices = require('../services/blog.service');
const httpStatus = require('http-status');
const { http } = require('winston');
const createBlog = catchAsync(async (req, res) => {
 
  await blogeservices.createBlog(req.body);
  res.status(httpStatus.CREATED).send({ success: true, message: 'Blog created successfully' });
});

const getBlogs = catchAsync(async (req, res) => {
 
 const blogs =  await blogeservices.getBlogs({});

  res.status(httpStatus.default.OK).json(blogs); 

});

module.exports = {
  createBlog,
  getBlogs,
};