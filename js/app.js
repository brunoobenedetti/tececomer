
let carritoDeCompras = []
const listaProductos = "json/catalogo.json";
const productos = []

const contenedorProductos = document.getElementById('contenedor-productos');
const contenedorCarrito = document.getElementById('carrito-contenedor');

const botonTerminar = document.getElementById('terminar')
const finCompra = document.getElementById('fin-compra')

const contadorCarrito = document.getElementById('contadorCarrito');
const precioTotal = document.getElementById('precioTotal');

fetch(listaProductos)
    .then((response) => response.json())
    .then((datos) => {
        datos.forEach((producto) =>{
            productos.push(producto);
        });
    })
    .catch((error) => console.log(error))
    .finally(() => 
mostrarProductos(productos));

function mostrarProductos(array){
    contenedorProductos.innerHTML= ""
    array.forEach(item => {
        let div = document.createElement('div')
            div.classList.add('producto')
            div.innerHTML += `
                <div class="card">
                    <div class="card-image">
                        <img src=${item.img}>
                        <span class="card-title">${item.nombre}</span>
                    </div>
                    <div class="card-content">
                        <p>${item.desc}</p>
                        <p>Marca: ${item.marca}</p>
                        <p> $${item.precio}</p>
                        <a  id="agregar${item.id}" class="btn-floating halfway-fab waves-effect waves-light red"><i class="fi fi-sr-shopping-bag-add"></i></a>
                    </div>
                </div>
                `
    contenedorProductos.appendChild(div)
        let btnAgregar = document.getElementById(`agregar${item.id}`)
            btnAgregar.addEventListener('click',()=>{
                agregarAlCarrito(item.id)
                let productoAgregar = productos.find(elemento => elemento.id == item.id)
            localStorage.setItem('producto',JSON.stringify(productoAgregar))
                Toastify({
                    text:"Producto agregado al carrito",
                    duration: 3000,
                    gravity: "buttom",
                    position: "left",
                    style:
                    {
                        background: "linear-gradient(to right, #295a99,#77acf2 )",
                    }
                }).showToast();
                
        })
    })
}
function agregarAlCarrito(id) {
    let yaEsta = carritoDeCompras.find(item=> item.id == id)
    if(yaEsta){
        yaEsta.cantidad ++;
        document.getElementById(`und${yaEsta.id}`).innerHTML =` <p id=und${yaEsta.id}>Und:${yaEsta.cantidad}</p>`
        actualizarCarrito()
    }else{
        let productoAgregar = productos.find(elemento => elemento.id == id)
        productoAgregar.cantidad = 1
        carritoDeCompras.push(productoAgregar)
        actualizarCarrito()
        mostrarCarrito(productoAgregar) 
    }
    localStorage.setItem('carrito', JSON.stringify(carritoDeCompras))
    
}

function mostrarCarrito(productoAgregar) {

    let div = document.createElement('div')
        div.className = 'productoEnCarrito'
        div.innerHTML=`
            <p>${productoAgregar.nombre}</p>
            <p>Precio: $${productoAgregar.precio}</p>
            <p id="und${productoAgregar.id}">Und:${productoAgregar.cantidad}</p>
            <button id="eliminar${productoAgregar.id}" class="boton-eliminar"><i class="fas fa-trash-alt"></i></button>
                    `
    contenedorCarrito.appendChild(div);

    let btnEliminar = document.getElementById(`eliminar${productoAgregar.id}`)
    btnEliminar.addEventListener('click',()=>{
        if(productoAgregar.cantidad == 1){
            btnEliminar.parentElement.remove()
            carritoDeCompras = carritoDeCompras.filter(item=> item.id != productoAgregar.id)
                actualizarCarrito()
            localStorage.setItem('carrito', JSON.stringify(carritoDeCompras))
        }else{
            productoAgregar.cantidad --;
            document.getElementById(`und${productoAgregar.id}`).innerHTML =` <p id=und${productoAgregar.id}>Und:${productoAgregar.cantidad}</p>`
                actualizarCarrito()
            localStorage.setItem('carrito', JSON.stringify(carritoDeCompras))
            
            }
        
        
    })
}
function  actualizarCarrito (){
    contadorCarrito.innerText = [...carritoDeCompras].reduce((acc,el)=> acc + el.cantidad, 0)
    precioTotal.innerText = carritoDeCompras.reduce((acc,el)=> acc + (el.precio * el.cantidad), 0)
}
function recuperar() {
    let recuperarLS = JSON.parse(localStorage.getItem('carrito'))
        if(recuperarLS){
            recuperarLS.forEach(el=> {
                mostrarCarrito(el)
            carritoDeCompras.push(el)
                actualizarCarrito()
            })
        }
}
recuperar()