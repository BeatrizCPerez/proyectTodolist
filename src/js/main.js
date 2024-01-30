// Espera a que el DOM esté completamente cargado antes de ejecutar código
document.addEventListener('DOMContentLoaded', () => {
    // Agrega un evento al formulario para prevenir su envío por defecto y llamar a la función anadirUsuario
    document.getElementById('miFormulario').addEventListener('submit', (event) => {
        event.preventDefault();
        anadirUsuario();
    });

    // Carga la lista de usuarios al cargar la página
    cargarUsuarios();
});

// Función asincrónica para cargar usuarios desde la API
async function cargarUsuarios() {
    try {
        // Realiza una solicitud GET a la API para obtener la lista de usuarios
        const response = await fetch('http://localhost:3000/usuarios');
        const usuarios = await response.json();
        const usuariosSection = document.getElementById('usuariosSection');

        // Limpia el contenido actual del contenedor de usuarios
        usuariosSection.innerHTML = "";

        // Crea elementos HTML para cada usuario y los agrega al contenedor
        usuarios.slice(0, 5).forEach(usuario => {
            const usuarioElemento = document.createElement('div');
            usuarioElemento.classList.add('usuario-item');
            usuarioElemento.innerHTML = `
                <p> <img src="/public/male.png" class="male">Nombre: ${usuario.nombre}, ${usuario.edad} años, <img src="/public/mail.png" class="mail"> Email: ${usuario.email},<img src="/public/whatsapp.png" class="whatsapp"> Teléfono: ${usuario.telefono}</p>
                <button type="button" class="boton-eliminar" onclick="eliminarUsuario('${usuario.id}')">
                    <img src="/public/papelera.png" class="papelera">
                </button>
                <button type="button" class="boton-editar" onclick="editarUsuario('${usuario.id}')">
                    Editar
                </button>
            `;
            usuariosSection.appendChild(usuarioElemento);
        });
    } catch (error) {
        console.error('Error al cargar usuarios:', error.message);
    }
}

// Función para añadir un nuevo usuario
async function anadirUsuario() {
    // Obtiene valores del formulario
    const nuevoNombre = document.querySelector('.nombre input').value;
    const nuevaEdad = document.querySelector('.edad input').value;
    const nuevoEmail = document.querySelector('.email input').value;
    const nuevoTelefono = document.querySelector('.telefono input').value;

    // Validaciones de los campos
    if (!/^[a-zA-Z]+$/.test(nuevoNombre)) {
        mostrarMensajeError('Por favor, ingrese un nombre válido (solo letras).');
        return;
    }

    if (isNaN(nuevaEdad)) {
        mostrarMensajeError('Por favor, ingrese una edad válida (número).');
        return;
    }

    if (!validarFormatoCorreo(nuevoEmail)) {
        mostrarMensajeError('Por favor, ingrese un correo electrónico válido.');
        return;
    }

    // Envía una solicitud POST a la API para añadir un nuevo usuario
    const response = await fetch('http://localhost:3000/usuarios', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            nombre: nuevoNombre,
            edad: nuevaEdad,
            email: nuevoEmail,
            telefono: nuevoTelefono,
        }),
    });

    // Si la solicitud es exitosa, recarga la lista de usuarios y limpia el formulario
    if (response.ok) {
        cargarUsuarios();
        limpiarFormulario();
    } else {
        console.error('Error al añadir usuario.');
    }
}

// Limpia los campos del formulario
function limpiarFormulario() {
    document.querySelector('.nombre input').value = '';
    document.querySelector('.edad input').value = '';
    document.querySelector('.email input').value = '';
    document.querySelector('.telefono input').value = '';
}

// Función para editar la información de un usuario
async function editarUsuario(id) {
    // Solicita al usuario ingresar la nueva información
    const nuevoNombre = prompt('Ingrese el nuevo nombre:');
    const nuevaEdad = prompt('Ingrese la nueva edad:');
    const nuevoEmail = prompt('Ingrese el nuevo correo electrónico:');

    // Validaciones de los campos
    if (!/^[a-zA-Z]+$/.test(nuevoNombre)) {
        mostrarMensajeError('Por favor, ingrese un nombre válido (solo letras).');
        return;
    }

    if (isNaN(nuevaEdad)) {
        mostrarMensajeError('Por favor, ingrese una edad válida (número).');
        return;
    }

    if (!validarFormatoCorreo(nuevoEmail)) {
        mostrarMensajeError('Por favor, ingrese un correo electrónico válido.');
        return;
    }

    // Envía una solicitud PUT a la API para actualizar la información del usuario
    const response = await fetch(`http://localhost:3000/usuarios/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            nombre: nuevoNombre,
            edad: nuevaEdad,
            email: nuevoEmail,
        }),
    });

    // Si la solicitud es exitosa, recarga la lista de usuarios
    if (response.ok) {
        cargarDatos();
    } else {
        console.error('Error al editar usuario.');
    }
}

// Función para eliminar un usuario
async function eliminarUsuario(id) {
    // Pregunta al usuario si está seguro de eliminar
    const confirmacion = confirm('¿Seguro que desea eliminar este usuario?');

    if (confirmacion) {
        // Envía una solicitud DELETE a la API para eliminar el usuario
        const response = await fetch(`http://localhost:3000/usuarios/${id}`, {
            method: 'DELETE',
        });

        // Si la solicitud es exitosa, recarga la lista de usuarios
        if (response.ok) {
            cargarUsuarios();
        } else {
            console.error('Error al eliminar usuario.');
        }
    }
}

// Validación del formato del correo electrónico
function validarFormatoCorreo(email) {
    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regexCorreo.test(email);
}

// Muestra un mensaje de error y lo limpia después de un tiempo
function mostrarMensajeError(mensaje) {
    const mensajeError = document.getElementById('mensajeError');
    mensajeError.textContent = mensaje;

    setTimeout(() => {
        mensajeError.textContent = '';
    }, 5000);
}

function enviarUsuarios() {
    // Puedes realizar acciones adicionales aquí si es necesario
    alert('Formulario enviado');

    // Limpia el formulario después de enviarlo
    limpiarFormulario();

    // Limpia la sección de usuarios después de enviar el formulario
    limpiarUsuariosSection();
}

// Función para limpiar la sección de usuarios
function limpiarUsuariosSection() {
    const usuariosSection = document.getElementById('usuariosSection');
    usuariosSection.innerHTML = "";
}

async function eliminarUsuarioEnDB(id) {
    // Envía una solicitud DELETE a la API para eliminar el usuario
    const response = await fetch(`http://localhost:3000/usuarios/${id}`, {
        method: 'DELETE',
    });

    // Si la solicitud no es exitosa, imprime un mensaje de error en la consola
    if (!response.ok) {
        console.error('Error al eliminar usuario de la base de datos.');
    }
}