//Simulador de pagina web de venta de productos para mascotas

/*
    1- Mostrar boton para suscribirse a news, aplicando sweetalert, captar evento y almacenarlo en el LS
    2- Mostrar los productos en pantalla, con nombre precio cantidad stock e imagen
    3- Armar un carrito y eliminar productos del carrito
    4- Implementar boton de Ver carrito y que contenga botones para finalizar la compra y vaciar el carrito
    5- Guardar info en LS
    6- Ejecutar el codigo con DOM content loader una vez que tengamos los datos del json

*/



//Evento para abrir el formulario de inscripción al News
const btnVerNews = document.querySelector("#botonNews")
btnVerNews.onclick = () => {
    document.getElementById("formulario").style.display = "block";
}


//Capturamos datos desde js
const datosFormulario = document.getElementById("formulario");
const btnSubmit = document.getElementById("btnSubmit");

//Funcion para captar los datos del usuario y almacenarlos en el storage y en caso de no recibir nada enviar mensaje de error
btnSubmit.onclick = () => {
  let nombreUser = datosFormulario.querySelector("#nombreUser").value;
  actualizarStorage("nombreUser", nombreUser);
  let mailUser = datosFormulario.querySelector("#mailUser").value;
  actualizarStorage("mailUser", mailUser);

  if (nombreUser !== "" && mailUser !== "") {
    Swal.fire(
      '¡Muchas gracias!',
      'Te suscribiste a las ofertas semanales',
      'success'
    );
  } else {
    Swal.fire(
      'Error en los datos ingresados',
      'Por favor, vuelve a ingresarlos',
      'error'
    );
  }
};

datosFormulario.onsubmit = (e) => {
  e.preventDefault();
};



//Class constructor stock
class Stock{
    constructor(id,nombre,precio,cantidad,img){
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.cantidad = cantidad;
        this.img = img;
    }
}

//Array que contiene el stock completo, se va a completar desde el .json
const STOCK = []

//Tomamos el div para insertar nuestro carrito, y creamos un array para almacenar los productos seleccionados por el usuario
const carritoHTML = document.getElementById("carrito")
const carrito = []

//Capturamos el boton para ver el carrito y añadimos el evento sobre el click
const btnVerCarrito = document.getElementById("btnVerCarrito")
btnVerCarrito.addEventListener("click", () => verCarrito())

//Tomamos el div para luego insertar el contenido del carrito cuando presionamos sobre el boton
const carritoVer = document.getElementById("carritoVer")

//Carrito en LS
let carritoLS = JSON.parse(localStorage.getItem("carrito"))


//Funciones que utilizaremos

//Funcion para traer los productos desde .json
function pedirProductos(){
  fetch("./productos.json")
  .then(res => res.json())
  .then(data => {
    STOCK.splice(0); // Vaciar el array STOCK
    data.forEach((productoData) => {
      const producto = new Stock(
        productoData.id,
        productoData.nombre,
        productoData.precio,
        productoData.cantidad,
        productoData.img
      );
      STOCK.push(producto);
    });
    listaProductos(STOCK); // Llamar a listaProductos con el nuevo STOCK
  });
}



//Funcion para agregar cards del array STOCK o si queremos agregar otro tipo de productos
function listaProductos(productosAMostrar){
    const cardProductos = document.getElementById("cardProductos")
    productosAMostrar.forEach((stock => {
        let divCard = document.createElement("div")
        divCard.classList.add("divCard")
        divCard.innerHTML = `
        <div class="card text-center card-modif">
            <img src= ${stock.img} class="card-img-top">
            <div class="card-body">
                <h5 class="card-title">${stock.nombre}</h5>
                <p class="card-text">$${stock.precio}</p>
                <p class="card-text">Cantidad:${stock.cantidad}</p>
                <input type="button" class="btn btn-success" value="Agregar" onclick="agregarAlCarrito(${stock.id})">
            </div>
        </div>`
        cardProductos.append(divCard)
    }))
}

//Funcion para agregar productos al carrito
const agregarAlCarrito = (producto) => {
  if (carritoLS) {
      const productoEnCarrito = carritoLS.find((item) => item.id === producto);
      if (productoEnCarrito) {
          productoEnCarrito.cantidad++;
      } else {
          const productoNuevo = STOCK.find((item) => item.id === producto);
          carritoLS.push(productoNuevo);
      }
  } else {
      const productoNuevo = STOCK.find((item) => item.id === producto);
      carritoLS = [productoNuevo];
  }
  actualizarCarrito()
  actualizarStorage("carrito", JSON.stringify(carritoLS))
};


//Funcion para eliminar productos del carrito
const eliminarDelCarrito = (producto) =>{
    if(producto.cantidad > 1){
        producto.cantidad--
    }else{
        const index = carritoLS.indexOf(producto);
        carritoLS.splice(index, 1)
    }
    actualizarCarrito()
    if (carritoLS === null || carritoLS.length === 0){
      localStorage.removeItem("carrito");
    }else{
      actualizarStorage("carrito",JSON.stringify(carritoLS))
    }

}

//Funcion para actualizar el carrito
const actualizarCarrito = () => {
    carritoHTML.innerHTML = "";
    carritoHTML.classList.add("carrito")
      carritoLS.forEach((producto) => {
          const contenedor = document.createElement("div");
          contenedor.classList.add("card","text-center","mb-3","card-carrito");
          const mensaje = document.createElement("div");
          mensaje.classList.add("card-body")
          mensaje.innerText = `Agregaste ${producto.cantidad} producto/s ${producto.nombre}`;
          const botonEliminar = document.createElement("button");
          const costoTotal = document.createElement("p");
          costoTotal.innerText = `Costo total: $${producto.precio*producto.cantidad}`
          botonEliminar.textContent = "Eliminar";
          botonEliminar.classList.add("btn","btn-danger")
          botonEliminar.addEventListener('click', () => {
              eliminarDelCarrito(producto);
          })
          contenedor.appendChild(mensaje);  
          contenedor.appendChild(costoTotal);
          contenedor.appendChild(botonEliminar);
          
        carritoHTML.appendChild(contenedor);
        document.body.append(carritoHTML)
      });     
  }

//Funcion para actualizar el contenido del storage
function actualizarStorage(clave, valor){
    localStorage.setItem(clave, valor)
}

//Funcion para ver el carrito
function verCarrito(){

  if (carritoLS !== null && carritoLS.length != 0)
      {
      for (item of carritoLS){
          let datosProd = STOCK.find(e => e.id == item.id)
          let card = document.createElement("div")
          card.classList.add("card","text-center","mb-3","carrito")
          card.innerHTML = `
              <div class="card" style="width: 18rem;">
              <img class="card-img-top" src="${datosProd.img}">
              <div class="card-body">
              <h5 class="card-title">${datosProd.nombre}</h5>
              <p class="card-text">Cantidad: ${item.cantidad}</p>
              
              </div>
              </div>`
          carritoVer.append(card)
      }
      cardProductos.style.display = "none"
      carritoHTML.style.display = "none"

      let precioFinal = carritoLS.reduce((acum, item) => {
        let producto = STOCK.find(elem => elem.id === item.id)
        return acum + (producto.precio * item.cantidad)
        }, 0)

      let carritoFinal = document.getElementById("carritoFinal")
      carritoFinal.innerHTML += `
          <div>
          <h6> Total a pagar: $ ${precioFinal} </h6>
          <input type="button" value="Finalizar Compra" onClick="finalizarCompra()" class="btn btn-primary btn-modif">
          <input type="button" value="Vaciar Carrito" onClick="limpiarCart()" class="btn btn-danger">
          </div>
          `
  }else{
      swal.fire({
          title: "Error",
          text: "El carrito no tiene productos",
          icon: "error"
      })
  }
}

//Funcion para finalizar la compra y actualizar la pagina luego de 2 segundos
function finalizarCompra() {
  localStorage.removeItem("carrito");
  swal.fire({
    title: "Exito!",
    text: "Realizaste tu compra!",
    icon: "success"
  });

  setTimeout(function() {
    location.reload();
  }, 2000);
}

//Funcion para limpiar el carrito y actualizar la pagina luego de 2 segundos
function limpiarCart(){
  while(carritoLS.lenght > 0){
      carritoLS.pop()
  }
  localStorage.removeItem("carrito")
  swal.fire({
    text: "Vaciaste el carrito, seras redirigido en breve",
    icon: "success"})

  setTimeout(function() {
    location.reload();
  }, 2000);
}

//Ejecutar el codigo cuando este listo el DOM
document.addEventListener("DOMContentLoaded", () => {
  pedirProductos()
  } )
