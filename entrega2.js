const fs = require('fs')

// Me falta implementar la parte de Async y Await, no llegue a incluirlo en esta entrega porque me llevo mucho tiempo darle la funcionalidad, pero puedo incluirlo en los proximos días.

class Contenedor {
    constructor(file) {
        this.file = file;
    }

    // esta funcion de create new la hago para crear el archivo en primera instancia. Sino cuando quiera leer un archivo que no existe me va a tirar error.
    createNew(producto) {
        try {
            let objeto = [{ id: 1, producto: producto }];
            const ObjectStr = JSON.stringify(objeto);
            fs.writeFileSync(this.file, ObjectStr);
            console.log('archivo creado con exito: ', this.file)
        } catch (error) {
            console.log('error', error)
        }
    }

    saveNew(producto) {
        try {
            // busco el archivo que ya esta creado, lo leo y parseo el array de objetos encontrados
            // si no tengo un archivo con ese nombre voy a generar un erro --> ver si se puede solucionar con if de ese error y que me haga un write new file.
            const informacion = fs.readFileSync(this.file, 'utf-8');
            let informacionObj = JSON.parse(informacion);

            // voy a buscar el ultimo ID que tengo en mi archivo
            let arrayIDs = informacionObj.map(e => e.id);
            let i = arrayIDs.length - 1;
            let newID = arrayIDs[i] + 1;

            //creo el nuevo objeto para cargar al archivo
            const newObject = { id: newID, producto: producto };
            informacionObj.push(newObject);
            const informacionStr = JSON.stringify(informacionObj);

            // esto iria luego de un .then --> aca voy a hacer el append y retornar el ID del objeto creado.
            fs.writeFileSync(this.file, informacionStr);
            return newID;

        } catch (error) {
            console.log('error', error)
        }
    }

    getByID(numeroID) {
        try {
            // arramcamos por leer el archivo en donde queremos buscar por ID y parsear la informacion en un objeto
            const informacion = fs.readFileSync(this.file, 'utf-8');
            let informacionObj = JSON.parse(informacion);

            // usamos find para encontrar el objeto buscado y devolverlo
            const objetoBuscado = informacionObj.find(e => e.id == numeroID);
            return objetoBuscado;
        } catch (error) {
            console.log('error', error)
        }
    }

    getAll() {
        try {
            // leemos el archivo, parseamos la info en un array de objetos y retornamos ese array de objetos 
            const informacion = fs.readFileSync(this.file, 'utf-8');
            let informacionObj = JSON.parse(informacion);
            return informacionObj;
        } catch (error) {
            console.log('error', error)
        }
    }

    deleteByID(numeroID) {
        try {
            // arramcamos por leer el archivo en donde queremos eliminar por ID y parsear la informacion en un objeto
            const informacion = fs.readFileSync(this.file, 'utf-8');
            let informacionObj = JSON.parse(informacion);

            // usamos filter para crear un nuevo array con todos los objetos menos el que queremos eliminar y lo pasamos a string y sobre-escribimos el archivo.
            const informacionFiltrada = informacionObj.filter(e => e.id != numeroID);
            const informacionFiltradaStr = JSON.stringify(informacionFiltrada);
            fs.writeFileSync(this.file, informacionFiltradaStr);

            // esta parte no la piden pero la voy a usar para probar que todo funciona bien.    
            console.log("el objeto con ID", numeroID, "fue borrado con exito");
            console.log("el nuevo archivo contiene: ", informacionFiltrada);
        } catch (error) {
            console.log('error', error)
        }
    }

    deleteAll() {
        try {
            // solo sobre-escribo el archivo con nada
            let objeto = fs.writeFileSync(this.file, "");
            console.log("el contenido del archivo fue borrado con exito, el contenido ahora es: ", objeto)
        } catch (error) {
            console.log('error', error)
        }
    }
}


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
