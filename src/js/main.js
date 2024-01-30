document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('miFormulario').addEventListener('submit', (event) => {
        event.preventDefault();
        anadirUsuario();
    });

    cargarUsuarios();
});

async function cargarUsuarios() {
    try {
        const response = await fetch('http://localhost:3000/usuarios');
        const usuarios = await response.json();
        const usuariosSection = document.getElementById('usuariosSection');

        usuariosSection.innerHTML = "";

        usuarios.slice(0, 3).forEach(usuario => {
            const usuarioElemento = document.createElement('div');
            usuarioElemento.classList.add('usuario-item'); // Agrega una clase para personalizar los estilos
            usuarioElemento.innerHTML = `
                <p>Nombre: ${usuario.nombre},     ${usuario.edad} años, Email: ${usuario.email}, Teléfono: ${usuario.telefono}</p>
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

// Resto del código sin cambios...



async function anadirUsuario() {
    const nuevoNombre = document.querySelector('.nombre input').value;
    const nuevaEdad = document.querySelector('.edad input').value;
    const nuevoEmail = document.querySelector('.email input').value;
    const nuevoTelefono = document.querySelector('.telefono input').value;

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

    if (response.ok) {
        cargarUsuarios();
        limpiarFormulario();
    } else {
        console.error('Error al añadir usuario.');
    }
}

function limpiarFormulario() {
    document.querySelector('.nombre input').value = '';
    document.querySelector('.edad input').value = '';
    document.querySelector('.email input').value = '';
    document.querySelector('.telefono input').value = '';
}

async function editarUsuario(id) {
    // Se solicita al usuario ingresar la nueva información para el usuario.
    const nuevoNombre = prompt('Ingrese el nuevo nombre:');
    const nuevaEdad = prompt('Ingrese la nueva edad:');
    const nuevoEmail = prompt('Ingrese el nuevo correo electrónico:');

    // Validar que el nombre solo contenga letras
    if (!/^[a-zA-Z]+$/.test(nuevoNombre)) {
        mostrarMensajeError('Por favor, ingrese un nombre válido (solo letras).');
        return;
    }

    // Validar que la edad sea un número
    if (isNaN(nuevaEdad)) {
        mostrarMensajeError('Por favor, ingrese una edad válida (número).');
        return;
    }

    // Validar el formato del correo electrónico
    if (!validarFormatoCorreo(nuevoEmail)) {
        mostrarMensajeError('Por favor, ingrese un correo electrónico válido.');
        return;
    }

    // Se realiza una solicitud PUT a la API para actualizar la información del usuario.
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

    // Si la solicitud es exitosa, se recargan los datos para reflejar el cambio en la tabla.
    if (response.ok) {
        cargarDatos();
    } else {
        // En caso de error, se muestra un mensaje en la consola.
        console.error('Error al editar usuario.');
    }
}







async function eliminarUsuario(id) {
    const confirmacion = confirm('¿Seguro que desea eliminar este usuario?');

    if (confirmacion) {
        const response = await fetch(`http://localhost:3000/usuarios/${id}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            cargarUsuarios();
        } else {
            console.error('Error al eliminar usuario.');
        }
    }
}

function validarFormatoCorreo(email) {
    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regexCorreo.test(email);
}

function mostrarMensajeError(mensaje) {
    const mensajeError = document.getElementById('mensajeError');
    mensajeError.textContent = mensaje;

    setTimeout(() => {
        mensajeError.textContent = ''; // Limpiar el mensaje después de un tiempo
    }, 5000);
}



