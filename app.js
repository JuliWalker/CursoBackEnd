const fs = require('fs')

// sigo con problemas de generar un archivo contenedor aparte e importarlo!

class Contenedor {
    constructor(file) {
        this.file = file;
    }

    async createFile(){
        try{
            // verifico si el archivo ya existe. Si no existe lo creo,
            // si existe decido no hacer nada, pero podria implementar otra logica.
            if(fs.existsSync(this.file)){
                console.log('El archivo ya existe, entonces no hago nada');
                return false
            }else {
                console.log('El archivo no existe, entonces lo creo!');
                await fs.promises.writeFile(this.file, '', 'utf8');
                return true
            }
        }catch(err){
            console.log('Error en la creación del archivo', err);
            return false;
        }
    }

    read() {
        let allProductsArray = [];
        // aca usamos un try porque vamos a intentar leer nuestra base de datos y puede tirar error!
        try {
            allProductsArray = fs.readFileSync(this.file, 'utf8');
            allProductsArray.length > 0 ? allProductsArray = JSON.parse(allProductsArray) : allProductsArray = [];
        } catch (err) {
            console.log('Error en la lectura del archivo', err);
        }
        return allProductsArray;
    }

    getNextId() {
        let lastId = 0;
        let allProductsArray = this.read();
        // aca no tendria que ponerle un await al if para esperar a que se resuelva el "read" de arriba?
        if (allProductsArray.length > 0) {
            lastId = allProductsArray[allProductsArray.length - 1].id;
        }
        return lastId + 1;
    }

    // Preguntar porque usa el async await aca. Cual es el riesgo que estarias corriendo si no lo pones?
    async write(allProductsArray) {
        // vuelvo a convertir el array en string para guardarlo en el archivo
        let json = JSON.stringify(allProductsArray);
        try {
            // aca usas un await y una funcion Sync al mismo tiempo? No entiendo porque
            await fs.writeFileSync(this.file, json);
        } catch (err) {
            console.log('Error en la escritura', err);
        }
    }

    saveNew(product) {
        // genero un ID para mi nuevo producto 
        let nextId = this.getNextId();
        // aca estoy necesitando un async Await porque cuando cargo más de 2 archivos me empieza a tirar undefined.
        product.id = nextId;
        // cargo los productos pre-existentes con el read y le sumo el producto nuevo y lo vuelvo a guardar en la base de datos
        const allProductsArray = this.read();
        allProductsArray.push(product);
        this.write(allProductsArray);
        return product.id
    }


    getById(id) {
        let allProductsArray = this.read();
        // aca no tendria que ponerle un await para esperar a que se resuelva el "read" de arriba?
        let product = allProductsArray.find(product => product.id == id);
        product ? console.log("busqueda por ID exitosa") : console.log("el producto con el ID buscado no fue encontrado")
        return product ? product : null;
    }

    getAll() {
        let allProductsArray = this.read();
        return allProductsArray;
    }

    deleteById(id) {
        let allProductsArray = this.read();
        // aca no tendria que ponerle un await para esperar a que se resuelva el "read" de arriba?
        let index = allProductsArray.findIndex(product => product.id == id);
        // findIndex devuelve -1 si no encuentra el valor, entonces podemos usar el if de abajo para saber si encontro un valor.
        if (index >= 0) {
            allProductsArray.splice(index, 1);
            // aca deberia ver que no entre al write antes de resolver el splice de arriba!
            this.write(allProductsArray);
        }
    }

    deleteAll(){
        let allProductsArray = [];
        this.write(allProductsArray);
    }

}

const file = './products.txt';
const container = new Contenedor(file);
const productsArray = [                                                                                                                                                     
    {                                                                                                                                                    
      title: 'Escuadra',                                                                                                                                 
      price: 123.45,                                                                                                                                     
      thumbnail: 'https://cdn3.iconfinder.com/data/icons/education-209/64/ruler-triangle-stationary-school-256.png',                                                                                                                                                                                 
    },                                                                                                                                                   
    {                                                                                                                                                    
      title: 'Calculadora',                                                                                                                              
      price: 234.56,                                                                                                                                     
      thumbnail: 'https://cdn3.iconfinder.com/data/icons/education-209/64/calculator-math-tool-school-256.png',                                                                                                                                                                                       
    },                                                                                                                                                   
    {                                                                                                                                                    
      title: 'Globo Terráqueo',                                                                                                                          
      price: 345.67,                                                                                                                                     
      thumbnail: 'https://cdn3.iconfinder.com/data/icons/education-209/64/globe-earth-geograhy-planet-school-256.png',                                                                                                                                                                                
    }                                                                                                                                                    
  ]

// Creamos el archivo si todavia no esta creado
const fileCreated = container.createFile();
fileCreated ? console.log('Archivo creado con exito') : console.log('No se pudo guardar productos');

// pruevo salvar los 3 productos para verificar que funciona -- Aca veo que puedo guardar 2 pero al 3 ya me da undefined -- Necesito implementar un async / await en la linea 65.
productsArray.map(product => {
    let ID = container.saveNew(product);
    console.log("prudcto con ID ", ID, " creado con exito" )
});



/* 
// creamos un nuevo contenedor
const nuevoArchivo = new Contenedor('productos.txt');


// armo un producto para meter en mi nuevo archivo
const objeto1 = {
    title: "manzana",
    price: 35,
    thumbnail: "https://www.ecured.cu/images/d/d0/Manzana.jpeg"
}


// creamos el nuevo archivo
nuevoArchivo.createNew(objeto1);


// armo un producto 2 para meter en mi archivo ya creado
const objeto2 = {
    title: "pera",
    price: 22,
    thumbnail: "https://www.ecured.cu/images/d/d0/Manzana.jpeg"
}


// Sumamos un nuevo objeto y nos devuelve su ID
let IDprod2 = nuevoArchivo.saveNew(objeto2);
console.log("el ID del producto 2 es: ", IDprod2);

// armo un producto 3 para meter en mi archivo ya creado
const objeto3 = {
    title: "banana",
    price: 43,
    thumbnail: "https://www.ecured.cu/images/d/d0/Manzana.jpeg"
}


// Sumamos un nuevo objeto y nos devuelve su ID
let IDprod3 = nuevoArchivo.saveNew(objeto3);
console.log("el ID del producto 3 es: ", IDprod3);

//vamos a buscar el objeto con el ID 2:
let buscarObjeto = nuevoArchivo.getByID(2);
console.log("el objeto buscado es: ", buscarObjeto);

//hacemos un getAll para probarlo:
let mostrarContenido = nuevoArchivo.getAll();
console.log("el contenido de tu archivo es: ", mostrarContenido);

// hacemos un delete By ID para probar la funcionalidad:
nuevoArchivo.deleteByID(1);

// hacemos un delete all para probar la funcionalidad - Comentar esta parte si quieren ver el archivo con el contenido previo a borrarlo.
nuevoArchivo.deleteAll();
 */