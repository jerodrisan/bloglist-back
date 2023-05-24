const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../index')
const api = supertest(app)
const Blog = require('../models/blog')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const helper = require('./test_helper')

//npm test -- tests/blog_api.test.js  ---> Para ejecutar solo este archivo de test
//npm test -- -t "when there is initially one user in db"  --> Para ejecutar un test en concreto
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


test('delete one contact from de blog', async ()=>{
    //a. pillamos primer elemento del blog(por ejemplo), sacamos id y borramos. 
    //b. comprobamos que el blog tiene 1 elemento menos y que el elemento borrado no esta en el blog
    const blogsAtStart = await Blog.find({})
    const elem = blogsAtStart[0].toJSON()
    const id = elem.id   

    await api
    .delete(`/api/blogs/${id}`)
    .expect(204)

    const blogsAtEnd = await Blog.find({})
    const titulos = blogsAtEnd.map(blog => (blog.toJSON()).title) //sacamos un array de todos los titulos   
    expect(titulos).not.toContain(elem.title)
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length-1)

})



test('uptdate the number of likes for a blog post' , async()=>{

    const blogsAtStart = await Blog.find({})
    const elem = blogsAtStart[0].toJSON()
    const id = elem.id   
    const likes = {
        likes: 58
    }

    await api
    .put(`/api/blogs/${id}`)
    .send(likes)
    .expect(204)

    const blogsAtEnd = await Blog.find({})
    const elemEnd = blogsAtEnd[0].toJSON()
    expect(elemEnd.likes).toEqual(58)
})


//------------------test para user administration ----------------------------------------------------

describe('when there is initially one user in db', () => {
    beforeEach(async () => {

      await User.deleteMany({})  
      const passwordHash = await bcrypt.hash('sekret', 10)
      const user = new User({ username: 'root', passwordHash })  
      await user.save()
    })

  
    test('creation succeeds with a fresh username', async () => {
     
      const users = await User.find({})
      const usersAtStart = users.map(user=>user.toJSON())
      const newUser = {
        username: 'mluukkai',
        name: 'Matti Luukkainen',
        password: 'salainen',
      }  
      await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)  
      
      const users2 = await User.find({})
      const usersAtEnd = users2.map(user=>user.toJSON())
      expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)
  
      const usernames = usersAtEnd.map(u => u.username)
      expect(usernames).toContain(newUser.username)
    })



    test('creation fails with proper statuscode and message if username already taken', async () => {

        const usersAtStart = await helper.usersInDb()    
        const newUser = {
          username: 'root',
          name: 'Superuser',
          password: 'salainen',
        }    
        const result = await api
          .post('/api/users')
          .send(newUser)
          .expect(400)
          .expect('Content-Type', /application\/json/)
    
        expect(result.body.error).toContain('expected `username` to be unique')    
        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toEqual(usersAtStart)
      })
  })


