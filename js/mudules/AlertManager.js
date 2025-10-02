class AlertManager {
    // Muestra una alerta de éxito
    static success(message, title = "Éxito") {
        return Swal.fire({
            title: title,
            text: message,
            icon: 'success',
            confirmButtonColor: '#28a745',
            confirmButtonText: 'Aceptar'
        });
    }
    
    // Muestra una alerta de error
    static error(message, title = "Error") {
        return Swal.fire({
            title: title,
            text: message,
            icon: 'error',
            confirmButtonColor: '#dc3545',
            confirmButtonText: 'Aceptar'
        });
    }
    
    // Muestra una alerta de advertencia
    static warning(message, title = "Advertencia") {
        return Swal.fire({
            title: title,
            text: message,
            icon: 'warning',
            confirmButtonColor: '#ffc107',
            confirmButtonText: 'Aceptar'
        });
    }
    
    // Muestra una alerta de confirmación
    static confirm(message, title = "Confirmar") {
        return Swal.fire({
            title: title,
            text: message,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#28a745',
            cancelButtonColor: '#dc3545',
            confirmButtonText: 'Sí',
            cancelButtonText: 'No'
        });
    }
    
    // Muestra una alerta de información
    static info(message, title = "Información") {
        return Swal.fire({
            title: title,
            text: message,
            icon: 'info',
            confirmButtonColor: '#17a2b8',
            confirmButtonText: 'Aceptar'
        });
    }
}

export { AlertManager };