const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../index')
const api = supertest(app)
const Blog = require('../models/blog')

//npm test -- tests/blog_api.test.js  ---> Para ejecutar solo este archivo de test
const initialBlogs = [
    {
      title: 'Canonical string reduction',
      author: "Edsger W. Dijkstra",
      url: "www.as.com",
      likes:12
    },
    {
        title: 'Blog for futbol',
        author: "Robert C. Martin",
        url: "www.marca.com",
        likes:5
    },
]

beforeEach(async () => {
    await Blog.deleteMany({})
   
    for (let blog of initialBlogs) {
        let blogObject = new Blog(blog)
        await blogObject.save()
    }   
})




//4.8: Blog list tests, step1
test('blogs in JSON format is correct', async()=>{
    const blogs = await Blog.find({})      
    const blogsToView = blogs.map(blog=>blog.toJSON())   //usamos el metodo .toJSON() creando en el esquema     
    const resultBlogs = await api.get('/api/blogs/')    
    expect(resultBlogs.body).toEqual(blogsToView)

})





//4.9: Blog list tests, step2  ( no se si piden esto)
test('unique identifier property of the blog posts is named id', async()=>{
    const blogs = await Blog.find({})   
    const elem = blogs[0].toJSON()
    //console.log(elem)
    expect(elem.id).toBeDefined()
} )



//4.10: Blog list tests, step3
test('create a new blog post with a HTTP request', async()=>{
    const newBlog = {
        title:  "new blob via HTTP adsaf",
        author: "antonio perez",
        url:    "www.as.com",
        likes:  5
    }
    const initiaBlogs = await Blog.find({})
    const initiaLength = initiaBlogs.length
    await api
        .post('/api/blogs/')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await Blog.find({})    
    expect(blogsAtEnd).toHaveLength(initiaLength+1)
})




//4.11*: Blog list tests, step4
test('verifies that if the likes property is missing from the request, it will default to the value 0',async ()=>{

    const newBlog = {
        title:  "new blog without likes property",
        author: "antonio 2",
        url:    "www.as.com"      
    }
    await api
    .post('/api/blogs/')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

    const Blogs = await Blog.find({})
    const insertedBlog = Blogs[Blogs.length-1].toJSON()
    expect (insertedBlog.likes).toEqual(0)

})




//4.12*: Blog list tests, step5
//verify that if the title or url properties are missing from the request data, the backend responds to the request with the status code 400 Bad Request.

test('missing title or url properties backend respond with status 404' , async()=>{
    const newBlog = {
        title:  "new blog without title or url property",
        author: "antonio 2",      
        likes: 9
    }
    await api
    .post('/api/blogs/')
    .send(newBlog)
    .expect(400)   
})


