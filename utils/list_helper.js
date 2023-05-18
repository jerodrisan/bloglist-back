const blogs = require('../test/array_blogs')

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => blogs.length=== 0 ? 0 : blogs.reduce((total, blog) => total + blog.likes,0)

const favoriteBlog = (blogs) =>{    
    const max =  Math.max(...blogs.map(blog=>blog.likes))
    const blog =  blogs.find(blog=>blog.likes===max)
    return {
        title: blog.title,
        author: blog.author,
        likes: blog.likes
    }
}

//Autor con la mayor cantidad de blogs
const mostBlogs = (blogs) =>{  
    let arr=[]
    for (let i=0; i<blogs.length-1; ++i){   
      let obj={
        blogs:1
      }
       for(let j=i+1; j<blogs.length; ++j){     
          obj.author=blogs[i].author         
          if(blogs[i].author===blogs[j].author){           
             obj.blogs=obj.blogs+1           
             blogs.splice(j,1)           
             --j          
          }         
       }     
      arr.push(obj)     
    }   
    //Una vez tenemos el array , devolvemos el autor que tiene mas blogs
    const max = Math.max(...arr.map(ar=>ar.blogs))
    const author = arr.find(ar=>ar.blogs===max)       
    return author    
  }

  //Author whose blog posts have the largest amount of likes
  const mostLikes = (blogs) =>{
    let arr=[]
    for (let i=0; i<blogs.length-1; ++i){   
       let obj={
         likes:blogs[i].likes
       }
       for(let j=i+1; j<blogs.length; ++j){     
          obj.author=blogs[i].author                   
          if(blogs[i].author===blogs[j].author){           
             obj.likes=obj.likes+blogs[j].likes           
             blogs.splice(j,1)           
             --j          
          }         
       }     
      arr.push(obj)     
    }
    const max = Math.max(...arr.map(ar=>ar.likes))
    const author = arr.find(ar=>ar.likes===max)     
    return author
  }



module.exports = {
    dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
}