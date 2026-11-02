// ===== ELEMENTOS DEL FORMULARIO =====
const form = document.getElementById('contactForm');
const nombre = document.getElementById('nombre');
const correo = document.getElementById('correo');
const telefono = document.getElementById('telefono');
const tipoSolicitud = document.getElementById('tipoSolicitud');
const mensaje = document.getElementById('mensaje');
const politicas = document.getElementById('politicas');
const grupoPdf = document.getElementById('grupoPdf');
const archivoPdf = document.getElementById('archivoPdf');
const uploadBox = document.getElementById('uploadBox');
const errorPdf = document.getElementById('errorPdf');

// ===== ELEMENTOS DEL TOAST Y MODAL =====
const toast = document.getElementById('toast');
const modal = document.getElementById('modal');
const modalCerrar = document.getElementById('modalCerrar');

let toastTimeout = null;

// ===== MOSTRAR / OCULTAR CAMPO PDF SEGÚN EL TIPO DE SOLICITUD =====
tipoSolicitud.addEventListener('change', function () {
    // El campo del PDF aparece al elegir PQRS (incluye solicitud de empleo)
    if (this.value === 'pqrs') {
        grupoPdf.style.display = 'block';
    } else {
        grupoPdf.style.display = 'none';
        archivoPdf.value = '';
        errorPdf.style.display = 'none';
        uploadBox.querySelector('.upload-box__text').textContent = 'Haga clic aquí o arrastre su hoja de vida en PDF';
    }
    // Al cambiar la opción, ocultamos el toast si está visible
    ocultarToast();
});

// ===== MOSTRAR TOAST =====
function mostrarToast() {
    // Limpiamos cualquier temporizador anterior
    if (toastTimeout) {
        clearTimeout(toastTimeout);
    }

    // Quitamos la clase de oculto y mostramos
    toast.classList.remove('toast--hidden');
    toast.classList.add('toast--visible');

    // Después de 10 segundos exactos lo ocultamos
    toastTimeout = setTimeout(function () {
        ocultarToast();
    }, 10000);
}

// ===== OCULTAR TOAST =====
function ocultarToast() {
    toast.classList.remove('toast--visible');
    toast.classList.add('toast--hidden');
}

// ===== VALIDAR Y SUBIR EL PDF =====
archivoPdf.addEventListener('change', function () {
    const archivo = this.files[0];

    if (!archivo) {
        return;
    }

    // Validar que sea PDF
    if (archivo.type !== 'application/pdf') {
        errorPdf.textContent = 'El archivo debe ser un PDF.';
        errorPdf.style.display = 'block';
        this.value = '';
        return;
    }

    // Validar que no supere los 10 MB
    if (archivo.size > 10 * 1024 * 1024) {
        errorPdf.textContent = 'El archivo no puede superar los 10 MB.';
        errorPdf.style.display = 'block';
        this.value = '';
        return;
    }

    // Si todo está bien, mostramos el nombre del archivo y el toast
    errorPdf.style.display = 'none';
    uploadBox.querySelector('.upload-box__text').textContent = 'Archivo seleccionado: ' + archivo.name;
    mostrarToast();
});

// ===== ARRASTRAR Y SOLTAR EL PDF =====
uploadBox.addEventListener('click', function () {
    archivoPdf.click();
});

uploadBox.addEventListener('dragover', function (e) {
    e.preventDefault();
    this.classList.add('upload-box--dragging');
});

uploadBox.addEventListener('dragleave', function () {
    this.classList.remove('upload-box--dragging');
});

uploadBox.addEventListener('drop', function (e) {
    e.preventDefault();
    this.classList.remove('upload-box--dragging');

    const archivo = e.dataTransfer.files[0];

    if (!archivo) {
        return;
    }

    // Validar que sea PDF
    if (archivo.type !== 'application/pdf') {
        errorPdf.textContent = 'El archivo debe ser un PDF.';
        errorPdf.style.display = 'block';
        return;
    }

    // Validar que no supere los 10 MB
    if (archivo.size > 10 * 1024 * 1024) {
        errorPdf.textContent = 'El archivo no puede superar los 10 MB.';
        errorPdf.style.display = 'block';
        return;
    }

    // Si todo está bien, mostramos el nombre del archivo y el toast
    errorPdf.style.display = 'none';
    uploadBox.querySelector('.upload-box__text').textContent = 'Archivo seleccionado: ' + archivo.name;
    mostrarToast();
});

// ===== MOSTRAR ERROR EN UN CAMPO =====
function mostrarError(campo, error) {
    campo.classList.add('form__input--error');
    error.style.display = 'block';
}

// ===== LIMPIAR ERROR DE UN CAMPO =====
function limpiarError(campo, error) {
    campo.classList.remove('form__input--error');
    error.style.display = 'none';
}

// ===== VALIDAR CORREO =====
function esCorreoValido(correoTexto) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(correoTexto);
}

// ===== VALIDAR TELÉFONO =====
function esTelefonoValido(telefonoTexto) {
    const soloNumeros = telefonoTexto.replace(/\s/g, '');
    return /^[0-9]{7,15}$/.test(soloNumeros);
}

// ===== ENVÍO DEL FORMULARIO =====
form.addEventListener('submit', function (e) {
    e.preventDefault();

    let valido = true;

    // Validar nombre
    if (nombre.value.trim() === '') {
        mostrarError(nombre, document.getElementById('errorNombre'));
        valido = false;
    } else {
        limpiarError(nombre, document.getElementById('errorNombre'));
    }

    // Validar correo
    if (correo.value.trim() === '' || !esCorreoValido(correo.value.trim())) {
        mostrarError(correo, document.getElementById('errorCorreo'));
        valido = false;
    } else {
        limpiarError(correo, document.getElementById('errorCorreo'));
    }

    // Validar teléfono
    if (telefono.value.trim() === '' || !esTelefonoValido(telefono.value.trim())) {
        mostrarError(telefono, document.getElementById('errorTelefono'));
        valido = false;
    } else {
        limpiarError(telefono, document.getElementById('errorTelefono'));
    }

    // Validar tipo de solicitud
    if (tipoSolicitud.value === '') {
        mostrarError(tipoSolicitud, document.getElementById('errorTipo'));
        valido = false;
    } else {
        limpiarError(tipoSolicitud, document.getElementById('errorTipo'));
    }

    // Validar mensaje
    if (mensaje.value.trim() === '') {
        mostrarError(mensaje, document.getElementById('errorMensaje'));
        valido = false;
    } else {
        limpiarError(mensaje, document.getElementById('errorMensaje'));
    }

    // Validar políticas
    if (!politicas.checked) {
        document.getElementById('errorPoliticas').style.display = 'block';
        valido = false;
    } else {
        document.getElementById('errorPoliticas').style.display = 'none';
    }

    // Si es PQRS, validar el PDF
    if (tipoSolicitud.value === 'pqrs') {
        if (!archivoPdf.files[0]) {
            errorPdf.textContent = 'Debe adjuntar su hoja de vida en PDF.';
            errorPdf.style.display = 'block';
            valido = false;
        } else {
            errorPdf.style.display = 'none';
        }
    }

    // Si todo es válido, mostramos el modal de éxito
    if (valido) {
        ocultarToast();
        modal.classList.add('modal--visible');
        form.reset();
        grupoPdf.style.display = 'none';
        uploadBox.querySelector('.upload-box__text').textContent = 'Haga clic aquí o arrastre su hoja de vida en PDF';
    }
});

// ===== CERRAR MODAL =====
modalCerrar.addEventListener('click', function () {
    modal.classList.remove('modal--visible');
});

// Cerrar modal al hacer clic fuera de él
modal.addEventListener('click', function (e) {
    if (e.target === modal) {
        modal.classList.remove('modal--visible');
    }
});

// ===== LIMPIAR ERROR AL ESCRIBIR =====
nombre.addEventListener('input', function () {
    limpiarError(this, document.getElementById('errorNombre'));
});

correo.addEventListener('input', function () {
    limpiarError(this, document.getElementById('errorCorreo'));
});

telefono.addEventListener('input', function () {
    limpiarError(this, document.getElementById('errorTelefono'));
});

tipoSolicitud.addEventListener('change', function () {
    limpiarError(this, document.getElementById('errorTipo'));
});

mensaje.addEventListener('input', function () {
    limpiarError(this, document.getElementById('errorMensaje'));
});

politicas.addEventListener('change', function () {
    document.getElementById('errorPoliticas').style.display = 'none';
});

