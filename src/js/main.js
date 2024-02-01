document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('miFormulario').addEventListener('submit', (event) => {
        event.preventDefault();
        anadirUsuario();
    });
    document.getElementById('miFormulario').addEventListener('input', function(event) {
        const input = event.target;

        // Verifica si el input es válido y no está vacío
        if (input.validity.valid && input.value.trim() !== '') {
            input.nextElementSibling.style.opacity = 1; // Muestra el icono de tick
        } else {
            input.nextElementSibling.style.opacity = 0; // Oculta el icono si el input no es válido o está vacío
        }
    });

    // Cambia el tipo de botón de "submit" a "button" en el formulario HTML
    // y agrega un event listener al botón de añadir
    document.getElementById('botonAñadir').addEventListener('click', () => {
        anadirUsuario();
    });

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
    const nuevoNombre = document.getElementById('nombre').value;
    const nuevaEdad = document.getElementById('edad').value;
    const nuevoEmail = document.getElementById('email').value;
    const nuevoTelefono = document.getElementById('telefono').value;

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

    // Objeto con la información del nuevo usuario
    const nuevoUsuario = {
        nombre: nuevoNombre,
        edad: nuevaEdad,
        email: nuevoEmail,
        telefono: nuevoTelefono,
    };

    try {
        // Realiza una solicitud POST a la API para agregar el nuevo usuario
        const response = await fetch('http://localhost:3000/usuarios', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(nuevoUsuario),
        });

        // Verifica si la solicitud fue exitosa
        if (response.ok) {
            // Recarga la lista de usuarios después de agregar uno nuevo
            cargarUsuarios();
            // Limpia los campos del formulario
            limpiarFormulario();
        } else {
            console.error('Error al añadir usuario:', response.statusText);
        }
    } catch (error) {
        console.error('Error al añadir usuario:', error.message);
    }
}


// Limpia los campos del formulario
function limpiarFormulario() {
    document.querySelector('.nombre input').value = '';
    document.querySelector('.edad input').value = '';
    document.querySelector('.email input').value = '';
    document.querySelector('.telefono input').value = '';
}

function enviarFormulario() {
    const nombre = document.getElementById('nombre');
    const edad = document.getElementById('edad');
    const email = document.getElementById('email');
    const telefono = document.getElementById('telefono');

    // Validaciones de los campos
    if (!/^[a-zA-Z]+$/.test(nombre.value)) {
        mostrarMensajeError('Por favor, ingrese un nombre válido (solo letras).');
        return;
    }

    if (isNaN(edad.value)) {
        mostrarMensajeError('Por favor, ingrese una edad válida (número).');
        return;
    }

    if (!validarFormatoCorreo(email.value)) {
        mostrarMensajeError('Por favor, ingrese un correo electrónico válido.');
        return;
    }
    // Crea un objeto
    const formData = new FormData(); 
    // Añade el valor al objeto
    formData.append('Nombre', nombre.value);
    formData.append('Edad', edad.value);
    formData.append('E-mail', email.value);
    formData.append('Teléfono', telefono.value);

    const endpoint = 'https://formspree.io/f/mgegawke';
    fetch(endpoint, {
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json',
        },
    })
    .then(response => {
        if (response.ok) {
            alert('Formulario enviado con éxito');
            limpiarFormulario();
            ocultarTicks(); // Llamada a la función para ocultar los ticks
        } else {
            throw new Error('Error al enviar el formulario');
        }
    })
    .catch(error => {
        console.error('Error:', error.message);
        alert('Hubo un error al enviar el formulario');
    });
}

// Nueva función para ocultar los ticks
function ocultarTicks() {
    const ticks = document.querySelectorAll('.icono-tick');
    ticks.forEach(tick => {
        tick.style.opacity = 0;
    });
}
// Función para editar la información de un usuario
async function editarUsuario(id) {
    // Solicita al usuario ingresar la nueva información
    const nuevoNombre = prompt('Ingrese el nuevo nombre:');
    const nuevaEdad = prompt('Ingrese la nueva edad:');
    const nuevoEmail = prompt('Ingrese el nuevo correo electrónico:');
    const nuevoTelefono = prompt('Ingrese el nuevo número de teléfono:');

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

    if (!/^6\d{8,9}$/.test(nuevoTelefono)) {
        mostrarMensajeError('Por favor, ingrese un número de teléfono válido.');
        return;
    }

    // Objeto con la información actualizada del usuario
    const usuarioActualizado = {
        nombre: nuevoNombre,
        edad: nuevaEdad,
        email: nuevoEmail,
        telefono: nuevoTelefono,
    };

    try {
        // Envía una solicitud PUT a la API para actualizar la información del usuario
        const response = await fetch(`http://localhost:3000/usuarios/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(usuarioActualizado),
        });

        // Si la solicitud es exitosa, recarga la lista de usuarios
        if (response.ok) {
            cargarUsuarios();
        } else {
            console.error('Error al editar usuario:', response.statusText);
        }
    } catch (error) {
        console.error('Error al editar usuario:', error.message);
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
    // Pregunta al usuario si está seguro de eliminar
    const confirmacion = confirm('¿Seguro que desea eliminar este usuario?');

}
