const fs = require('fs')


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
                await fs.promises.writeFile(file_path, '', 'utf8');
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