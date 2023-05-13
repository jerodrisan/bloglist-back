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


const mostBlogs = (blogs) =>{
  
    let arr=[]
    for (let i=0; i<blogs.length-1; ++i){   
      let obj={}
       for(let j=i+1; j<blogs.length; ++j){     
          obj.author=blogs[i].author       
          if(obj.blogs === undefined){
            obj.blogs=1      
          }       
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
    const res = arr.find(ar=>ar.blogs===max)       
    return res
    
  }
  
  




module.exports = {
    dummy, totalLikes, favoriteBlog, mostBlogs
}