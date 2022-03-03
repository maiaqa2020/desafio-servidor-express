const fs = require('fs')
const express = require('express')
const app = express()
const PORT = 8080
const server = app.listen(PORT, () => {
   console.log(`Servidor http escuchando en el puerto ${server.address().port}`)
})
server.on("error", error => console.log(`Error en servidor ${error}`))

//clase Contenedor: recibe el nombre del archivo con el que va a trabajar
class Contenedor {
    constructor(fileName) {
        this.fileName = fileName        
    }

    //En todos los métodos se trabajó de forma que si el archivo existe => ingresa al try sino ingresa al catch
    
    //Recibe un objeto, lo guarda en el archivo, devuelve el id asignado       
    async save(object) {
        try {            
            let content = await fs.promises.readFile(this.fileName,'utf-8');                                    
            //se distingue si el archivo está vacío ó contiene datos. 
            if (!content) content = [];                
            else {
                content = JSON.parse(content)                
            }            
            object.id = content.length + 1
            content.push(object)
            await fs.promises.writeFile(this.fileName, JSON.stringify(content, null, 2))
        } catch (err) {
            if (err.code === 'ENOENT') {
                console.log ('El archivo o directorio no existe')
            } else {
                console.log(err);
            }            
        }
        return object.id
    }

    //Recibe un id y devuelve el objeto con ese id, o null si no está.
    async getById(id) {
        try {
            const content = await fs.promises.readFile(this.fileName, 'utf8');
            if (!content) console.log ('No existen datos en el archivo')
            else {            
            const contentParse = JSON.parse(content)                        
            const result = contentParse.filter(item => item.id == id)            
            return result
            }
        } catch (err) {
            if (err.code === 'ENOENT') {
                console.log ('El archivo o directorio no existe')
            } else {
                console.log(err);
            }            
        }
    }

    //Devuelve un array con los objetos presentes en el archivo
    async getAll() {
        try {
            const content = await fs.promises.readFile(this.fileName, 'utf8');            
            if (!content) console.log ('No existen datos en el archivo')
            else {
                const contentParse = JSON.parse(content)
                return contentParse 
            }              
        } catch (err) {
            if (err.code === 'ENOENT') {
                console.log ('El archivo o directorio no existe')
            } else {
                console.log(err);
            }            
        }
    }

    //Elimina del archivo el objeto con el id buscado
    async deleteById(id) {
        try {
            const content = await fs.promises.readFile(this.fileName, 'utf8');
            if (!content) console.log ('No existen datos en el archivo')
            else {
                const contentParse = JSON.parse(content)                
                const result = contentParse.filter((item) => item.id !== id);
                await fs.promises.writeFile(this.fileName, JSON.stringify(result, null, 2))
                console.log('Producto eliminado')                    
            }
        } catch (err) {
            if (err.code === 'ENOENT') {
                console.log ('El archivo o directorio no existe')
            } else {
                console.log(err);
            }            
        }
    }

    //Elimina todos los objetos presentes en el archivo
    async deleteAll() {
        try {
            const content = await fs.promises.readFile(this.fileName, 'utf8');
            if (!content) console.log ('No existen datos en el archivo')
            else {
            await fs.promises.writeFile(this.fileName, '')
            console.log('Usted acaba de borrar todos los productos.')
            }
        } catch (err) {
            if (err.code === 'ENOENT') {
                console.log ('El archivo o directorio no existe')
            } else {
                console.log(err);
            }              
        }
    }     
    
}

const test = new Contenedor('productos.txt')

//Ruta get '/productos' que devuelva un array con todos los productos disponibles en el servidor
app.get('/productos', async (request, response) => {
    const arrayProductos = await test.getAll();
    response.send(arrayProductos)
})

//Ruta get '/productoRandom' que devuelva un producto elegido al azar entre todos los productos disponibles
app.get('/productoRandom', async (request, response) => {
    const arrayProductos = await test.getAll();
    const rand = Math.floor(Math.random()*arrayProductos.length);    
    response.send(arrayProductos[rand])
})