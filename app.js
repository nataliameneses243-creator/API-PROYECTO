//CONFIGURACION GLOBAL
const API_URL = "http://localhost:10000";
const TOKEN_KEY = "token";

//UTILIDADES
const guardarToken = (token) => localStorage.setItem(TOKEN_KEY,token);
const obtenerToken = () => localStorage.getItem(TOKEN_KEY);
const eliminarToken = () => localStorage.removeItem(TOKEN_KEY);

const alerta = (mensaje, tipo="info") => {
    const colores = {
        info: "#38bdf8",
        success: "#22c55e",
        error: "#ef4444",
        warning: "#facc15",
        
    };

    const div = document.createElement("div");
    div.textContent = mensaje;
    div.style.position = "fixed";
    div.style.botton = "20px";
    div.style.left = "50%"
    div.style.transform = "translateX(-50%)";
    div.style.background = colores[tipo];
    div.style.color = "#fff";
    div.style.padding = "12px 24px";
    div.style.borderRadius = "8px";
    div.fontWeight = "600";
    div.style.boxShadow = "0 6px 20px rgba(0, 0, 0, 0.25)";
    div.style.zIndex = "9999";

    document.body.appendChild(div);
    setTimeout(()=> div, remove(), 10000);
};

/* AUTENTICACION*/

const formLogin = document.getElementById("formlogin");
const formregistro = document.getElementById("formRegistro");
const toggleregistro = document.getElementById("toggleRegistro");

if (toggleregistro) {
    toggleregistro.addEventListener("click", (e) => {
        e.preventDefault();
        formregistro.classList.toggle("oculto");
        formLogin.classList.toggle("oculto");
    });
}


/* REGISTRO DE USUARIO*/

if (formregistro) {
    formregistro.addEventListener("submit", async (e) => {
        e.preventDefault();
        const nombre = document.getElementById("nombre").value;
        const correo = document.getElementById("correoReg").value;
        const password = document.getElementById("passwordReg").value;

        try {
            const res = await fetch(`${API_URL}/usuarios/registro`,{
                method: "POST",
                headers: { "Content-Type": "application/json"},
                body: JSON.stringify({nombre,correo,password}),
            });
            const data = await res.json();

            if(res.ok && data.token) {
                guardarToken(data.token);
                alerta("Inicio de sesion exitoso", "success");
                setTimeout(() => (window.location.href = "dashboard.html"), 1000);
            } else {
                alerta(data.mensaje || "Credenciales invalidas", "error");
            }
        } catch {
            alerta("Error de conexion con el servidor", "error");
        }
    });
}

/* INICIO DE SESION */

if(formLogin) {
    formLogin.addEventListener("submit", async (e) => {
        e.preventDefault();
        const correo = document.getElementById("correo").value;
        const password = document.getElementById("password").value;

        try {
            const res = await fetch(`${API_URL}/usuarios/login`,{
                method: "POST",
                headers: {"Content-Type": "aplication/json"},
                body: JSON.stringify({correo,password}),
            });
            const data = await res.json();

            if (res.ok && data.token) {
                guardarToken(data.token);
                alerta("inicio de sesion exitoso", "success");
                setTimeout(() => (window.location.href) = "dashboard.html", 1000);
            } else {
                alerta(data.mensaje || "Credenciales Invalidas", "error");
            }
        } catch {
            alerta("Error de conexion con el servidor", "error");
        }
 
    });
}

/* Dashboard CRUD productos*/

const formProducto = document.getElementById("formProucto");
const listaProductos = documents.getElementById("listaProductos");
const btnCerrar = document.getElementById("cerrarSesion");

if(btnCerrar){
    btnCerrar.addEventListener("click", () => {
        eliminarToken();
        alerta("Sesion cerrada correctamente", "info");
        setTimeout(() => (window.location.href = "index.html"), 1000);
    });
}

//obtener lista de productos

async function cargarProductos() {
    try{
        const res = await fetch(`${API_URL}/productos`);
        const data = await res.json();

        listaProductos.innerHTML = "";
        if (data.length === 0) {
            listaProductos.innerHTML = "<p>No hay productos registrados<p>";
            return;
        }
        data.forEach((p) => {
            const li = document.createElement("li")
            li.innerHTML = `
            <di>
            <strong>${p.nombre}</strong><br>
            <span>${p.precio}</span><br>
            <small>${p.descripcion || ""}</small>
            </div>
            <div>
            <button class="editar" data-id="${p._id}">Editar</button>
            <button class="eliminar" data-id="${p._id}">Eliminar</button>
            </div>
            `;
            listaProductos.appendChild(li);
            
        });

        //asignar eventos
        document.querySelectorAll(".eliminar").forEach((btn) => {
            btn.addEventListener("click", () => eliminarProducto(btn.dataset.id));
        });

        document.querySelectorAll(".editar").forEach((btn) =>{
            btn.addEventListener("click", () => editarProducto(btn.dataset.id));
        });
    } catch{
        alerta("Error al cargar productos", "error");
    }
}

//Crear producto

if(formProducto) {
    formProducto.addEventListener("submit", async (e) => {
        e.preventDefault();
        const nombre = document.getElementById("nombreProducto").value;
        const precio = document.getElementById("precioProducto").value;
        const descripcion = document.getElementById("descripcionProducto").value;

        try {
            const res = await fetch(`${API_URL}/productos`,{
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${obtenerToken()}`,
                },
                body: JSON.stringify({nombre, precio, descripcion}),
            });

            const data = await res.json();
            if(res.ok) {
                alerta("Producto agregado correctamente", "success");
                formProducto.reset();
                cargarProductos();
            } else {
                alerta(data.mensaje || "Error al crear producto", "error");
            }
        } catch {
            alerta("Error de conexion con el servidor", "error");
        }
    });
}


//ELIMINAR PRODUCTO

async function eliminarProducto(id) {
    if(!confirm("Deseas eliminar este producto")) return;
    try{
        const res = await fetch(`${API_URL}/productos/${id}`,{
            method: "DELETE",
            headers: { Authorization: `Bearer %{obtenerToken()}`},
        });
        const data = await res.json();
        if (res.ok) {
            alerta("Producto eliminado", "success");
            cargarProductos();
        } else {
            alerta(data.mensaje || "Error al eliminar", "error");
        }
    } catch {
        alerta("Error de conexion al servidor", "error");
    }
}


//EDITAR PRODUCTOS

async function editarProducto(id) {
    const nuevoNombre = prompt("Nuevo nombre del producto");
    if (!nuevoNombre) return;
    const nuevoPrecio = prompt("Nuevo precio");
    const nuevaDescrpcion = prompt("Nueva descripcion");

    try{
        const res = await fetch (`${API_URL}/productos/${id}`,{
            method= "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${obtenerToken()}`,
            },
            body: JSON.stringify({
                nombre: nuevoNombre,
                precio: nuevoPrecio,
                descripcion: nuevaDescrpcion,
            }),
        });
        const data = await res.json();
        if(res.ok) {
            alerta("Producto actualizado", "success");
            cargarProductos;
        } else {
            alerta(data.mensaje || "Error al actualizar", "error");
        }
    } catch{
        alerta ("Error de conexion con el servidor", "error");
    }
}


//Inicializar si estamos en el dashboard
if(window.location.pathname.includes("dashboard.html")) {
    if(!obtenerToken()) {
        alerta("Debes iniciar sesion primero", "warning");
        setTimeout(() => (window.location.href = "index.html"), 1000);
    } else {
        cargarProductos();
    }

}