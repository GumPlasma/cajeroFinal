import { BancoElBro } from './mudules/Banco.js';
import { AlertManager } from './mudules/AlertManager.js';
import { inicializarUI } from './mudules/UI.js';

// Instancia global del banco
export const banco = new BancoElBro();

// Variable global del cliente actual
export let clienteActual = null;

// Función para establecer el cliente actual
export function setClienteActual(cliente) {
    clienteActual = cliente;
}

// Función para obtener el cliente actual
export function getClienteActual() {
    return clienteActual;
}

// Función para limpiar el cliente actual (logout)
export function limpiarClienteActual() {
    clienteActual = null;
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM cargado, inicializando UI...');
    inicializarUI();
});

// Exportar AlertManager para uso en otros módulos
export { AlertManager };