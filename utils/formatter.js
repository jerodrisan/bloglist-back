//Formateador de json para ver los datos en pantalla 

const format = blogs =>{
    const JSON_blogs = JSON.stringify(blogs)  
    const contactos = JSON.parse(JSON_blogs)    
    let str ="[<br>"     
    for (let i=0; i<contactos.length; i++){
        let keys = Object.keys(contactos[i])
        let values = Object.values(contactos[i])
           str += ' -{<br>'
           for(let j=0; j<keys.length; j++){
              if(typeof values[j]==='object'){                     
                if(!Array.isArray(values[j])){
                    str+=`&nbsp&nbsp&nbsp&nbsp${keys[j]}:{<br>`
                    let keys2= Object.keys(values[j]) 
                    let values2=Object.values(values[j])                  
                    for(let k=0; k<keys2.length; k++){
                        str+= `&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp${keys2[k]}: ${values2[k]}<br>`                   
                    }
                    str+='&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp}<br>'                        
                }else{                 
                  str+=`&nbsp&nbsp&nbsp&nbspblogs:[<br>`
                  let contactos=values[j]
                  for (let i=0; i<contactos.length; i++){
                    let keys = Object.keys(contactos[i])
                    let values = Object.values(contactos[i])
                       str += '&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp-{<br>'
                       for(let j=0; j<keys.length; j++){
                        if(typeof values[j]==='object'){
                          str+=`&nbsp&nbsp&nbsp${keys[j]}:{<br>`
                          let keys2= Object.keys(values[j]) 
                          let values2=Object.values(values[j])                          
                          for(let k=0; k<keys2.length; k++){
                              str+= `&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp${keys2[k]}: ${values2[k]}<br>`                   
                          }
                          str+='&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp}<br>'     

                        }else{
                          str+= `&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp${keys[j]}: ${values[j]} ,<br>`             
                        }
                       }
                       str+='&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp},<br>'  
                  }            
                  str+='&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp],<br>'      
                }
              }else{
                str+= `&nbsp&nbsp&nbsp&nbsp${keys[j]}: ${values[j]} ,<br>`             
              }              
           } 
           str+='},<br>'
    } 
    return str
}

module.exports =format