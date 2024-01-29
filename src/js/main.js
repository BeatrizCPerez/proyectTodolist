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
        const usuariosSection = document.querySelector('.distribucion_usuarios');

        usuariosSection.innerHTML = "";

        usuarios.slice(0, 3).forEach(usuario => {
            const usuarioElemento = document.createElement('div');
            usuarioElemento.innerHTML = `<p>${usuario.nombre}, ${usuario.edad} años, Email: ${usuario.email}, Teléfono: ${usuario.telefono}</p>`;
            usuariosSection.appendChild(usuarioElemento);
        });
    } catch (error) {
        console.error('Error al cargar usuarios:', error.message);
    }
}

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

function validarFormatoCorreo(email) {
    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regexCorreo.test(email);
}

function mostrarMensajeError(mensaje) {
    const mensajeError = document.createElement('div');
    mensajeError.style.color = 'red';
    mensajeError.style.fontSize = '20px';
    mensajeError.textContent = mensaje;

    document.body.appendChild(mensajeError);

    setTimeout(() => {
        mensajeError.remove();
    }, 5000);
}
