const listHelper = require('../utils/list_helper')
const array_blogs = require('./array_blogs').blogs //todos los blogs
const array_blog = require('./array_blogs').oneBlog //un solo blog
const empty_blog = require('./array_blogs').emptyBlog //blog vacio


test('dummy returns one ', ()=>{
    const blogs = []
    const result = listHelper.dummy(blogs)
    expect(result).toBe(1)
})
//para hacer un solo test: npm test -- -t 'when list has only one blog, equals the likes of that'


describe('total likes', ()=>{

   test('when list has only one blog, equals the likes of that', ()=>{
        const result = listHelper.totalLikes(array_blog)
        expect(result).toBe(7)
   })

   test('of a bigger list is calculated right', ()=>{
        const result = listHelper.totalLikes(array_blogs)
        expect(result).toBe(36)
    })

    test('of empty list is zero', ()=>{
        const result = listHelper.totalLikes(empty_blog)
        expect(result).toBe(0)
    })
})

describe('favorite blog', ()=>{

    test('whats the favorite blog', ()=>{
        const obj = {       
            title: "Canonical string reduction",
            author: "Edsger W. Dijkstra",      
            likes: 12,       
          }
        const result = listHelper.favoriteBlog(array_blogs)
        expect(result).toEqual(obj)
    })  

    test('Author with largest number of blogs', ()=>{
        const obj = {            
            blogs: 3,
            author: "Robert C. Martin"              
        }
        const result = listHelper.mostBlogs(array_blogs)
        expect(result).toEqual(obj)
    })

    //NO sale este test 
    test('Author whose blog posts have the largest amount of likes', ()=>{
        const objeto={                
                author: "Edsger W. Dijkstra",
                likes: 17           
            }
            const result = listHelper.mostLikes(array_blogs)
            expect(result).toEqual(objeto)
        
    })
})