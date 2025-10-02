import { banco, setClienteActual, getClienteActual, limpiarClienteActual, AlertManager } from '../main.js';
import { Cliente } from './Clases.js';

// Elementos del DOM
let elementos = {};

export function inicializarUI() {
    console.log('Inicializando interfaz de usuario...');
    inicializarElementosDOM();
    inicializarManejadoresEventos();
    console.log('UI inicializada correctamente');
}

function inicializarElementosDOM() {
    console.log('Buscando elementos DOM...');
    
    // Pantallas
    elementos.loginScreen = document.getElementById('login-screen');
    elementos.registerScreen = document.getElementById('register-screen');
    elementos.transactionScreen = document.getElementById('transaction-screen');
    
    // Elementos de la interfaz
    elementos.userNameElement = document.getElementById('user-name');
    elementos.accountsContainer = document.getElementById('accounts-container');
    
    // Selectores de cuentas
    elementos.saldoCuentaSelect = document.getElementById('saldo-cuenta');
    elementos.depositoCuentaSelect = document.getElementById('deposito-cuenta');
    elementos.retiroCuentaSelect = document.getElementById('retiro-cuenta');
    elementos.transferenciaOrigenSelect = document.getElementById('transferencia-origen');
    elementos.movimientosCuentaSelect = document.getElementById('movimientos-cuenta');
    
    // Elementos de registro
    elementos.regContrasena = document.getElementById('reg-contrasena');
    elementos.regContrasenaConfirm = document.getElementById('reg-contrasena-confirm');
    
    // Verificar que todos los elementos esenciales existen
    const elementosEsenciales = [
        'loginScreen', 'registerScreen', 'transactionScreen',
        'userNameElement', 'accountsContainer'
    ];
    
    for (const elemento of elementosEsenciales) {
        if (!elementos[elemento]) {
            console.error(`Elemento esencial no encontrado: ${elemento}`);
        }
    }
    
    console.log('Elementos DOM inicializados:', Object.keys(elementos).length);
}

function inicializarManejadoresEventos() {
    console.log('Inicializando manejadores de eventos...');
    
    try {
        // Login y Navegación
        document.getElementById('login-btn').addEventListener('click', manejarLogin);
        document.getElementById('show-register-btn').addEventListener('click', () => showScreen(elementos.registerScreen));
        document.getElementById('back-to-login-btn').addEventListener('click', () => showScreen(elementos.loginScreen));
        
        // Registro
        document.getElementById('register-btn').addEventListener('click', manejarRegistro);
        
        // Validación de contraseñas en tiempo real
        if (elementos.regContrasena && elementos.regContrasenaConfirm) {
            elementos.regContrasena.addEventListener('input', validarContrasenas);
            elementos.regContrasenaConfirm.addEventListener('input', validarContrasenas);
        }
        
        // Operaciones principales
        document.getElementById('logout-btn').addEventListener('click', manejarLogout);
        document.getElementById('consultar-saldo-btn').addEventListener('click', () => mostrarOperacion('consultar-saldo-container'));
        document.getElementById('depositar-btn').addEventListener('click', () => mostrarOperacion('depositar-container'));
        document.getElementById('retirar-btn').addEventListener('click', () => mostrarOperacion('retirar-container'));
        document.getElementById('transferir-btn').addEventListener('click', () => mostrarOperacion('transferir-container'));
        document.getElementById('consultar-movimientos-btn').addEventListener('click', () => mostrarOperacion('movimientos-container'));
        document.getElementById('abrir-cuenta-btn').addEventListener('click', () => mostrarOperacion('abrir-cuenta-container'));
        document.getElementById('editar-perfil-btn').addEventListener('click', () => mostrarOperacion('editar-perfil-container'));
        
        // Botones de volver
        document.querySelectorAll('.operation-container .btn-secondary').forEach(btn => {
            if (btn.textContent.includes('Volver')) {
                btn.addEventListener('click', (e) => {
                    e.target.closest('.operation-container').style.display = 'none';
                });
            }
        });
        
        // Ejecutar operaciones
        if (elementos.saldoCuentaSelect) {
            elementos.saldoCuentaSelect.addEventListener('change', manejarCambioSaldo);
        }
        document.getElementById('depositar-execute-btn').addEventListener('click', manejarDeposito);
        document.getElementById('retirar-execute-btn').addEventListener('click', manejarRetiro);
        document.getElementById('transferir-execute-btn').addEventListener('click', manejarTransferencia);
        document.getElementById('abrir-cuenta-execute-btn').addEventListener('click', manejarAbrirCuenta);
        document.getElementById('editar-perfil-execute-btn').addEventListener('click', manejarEditarPerfil);
        
        // Movimientos
        if (elementos.movimientosCuentaSelect) {
            elementos.movimientosCuentaSelect.addEventListener('change', manejarCambioMovimientos);
        }
        
        console.log('Manejadores de eventos inicializados correctamente');
    } catch (error) {
        console.error('Error al inicializar manejadores de eventos:', error);
    }
}

// Funciones de navegación
export function showScreen(screen) {
    // Ocultar todas las pantallas
    elementos.loginScreen.classList.remove('active');
    elementos.registerScreen.classList.remove('active');
    elementos.transactionScreen.classList.remove('active');
    
    // Ocultar todos los contenedores de operaciones
    document.querySelectorAll('.operation-container').forEach(container => {
        container.style.display = 'none';
    });
    
    // Mostrar la pantalla solicitada
    screen.classList.add('active');
}

function mostrarOperacion(containerId) {
    // Ocultar todos los contenedores primero
    document.querySelectorAll('.operation-container').forEach(container => {
        container.style.display = 'none';
    });
    
    // Mostrar el contenedor solicitado
    const container = document.getElementById(containerId);
    if (container) {
        container.style.display = 'block';
        
        // Inicializar datos si es necesario
        if (containerId === 'editar-perfil-container') {
            inicializarEditarPerfil();
        }
    }
}

// Funciones de actualización de UI
export function actualizarInformacionCuentas() {
    const cliente = getClienteActual();
    
    if (!elementos.accountsContainer) return;
    
    // Limpiar el contenedor
    elementos.accountsContainer.innerHTML = '';
    
    if (cliente && cliente.cuentas.length > 0) {
        cliente.cuentas.forEach(cuenta => {
            const accountCard = document.createElement('div');
            accountCard.className = 'account-card';
            accountCard.innerHTML = `
                <h3>Cuenta de ${cuenta.tipo}</h3>
                <p><strong>Número:</strong> ${cuenta.numeroCuenta}</p>
                <p><strong>Saldo:</strong> $${cuenta.consultarSaldo().toLocaleString()}</p>
                <p><strong>Tipo:</strong> ${cuenta.tipo.toUpperCase()}</p>
            `;
            elementos.accountsContainer.appendChild(accountCard);
        });
    } else {
        const noAccounts = document.createElement('p');
        noAccounts.textContent = 'No tiene cuentas asociadas.';
        elementos.accountsContainer.appendChild(noAccounts);
    }
    
    // Actualizar los selectores de cuentas
    llenarSelectCuentas();
}

function llenarSelectCuentas() {
    const cliente = getClienteActual();
    const selects = [
        elementos.saldoCuentaSelect,
        elementos.depositoCuentaSelect,
        elementos.retiroCuentaSelect,
        elementos.transferenciaOrigenSelect,
        elementos.movimientosCuentaSelect
    ];
    
    selects.forEach(select => {
        if (!select) return;
        
        select.innerHTML = '';
        
        if (cliente && cliente.cuentas.length > 0) {
            cliente.cuentas.forEach(cuenta => {
                const option = document.createElement('option');
                option.value = cuenta.numeroCuenta;
                option.textContent = `${cuenta.tipo.toUpperCase()} - ${cuenta.numeroCuenta} ($${cuenta.consultarSaldo().toLocaleString()})`;
                select.appendChild(option);
            });
        } else {
            const option = document.createElement('option');
            option.textContent = 'No tiene cuentas';
            select.appendChild(option);
        }
    });
}

// Funciones de validación
function validarContrasenas() {
    const contrasena = elementos.regContrasena.value;
    const confirmacion = elementos.regContrasenaConfirm.value;
    
    if (contrasena && confirmacion) {
        if (contrasena === confirmacion) {
            elementos.regContrasena.classList.remove('password-mismatch');
            elementos.regContrasenaConfirm.classList.remove('password-mismatch');
            elementos.regContrasena.classList.add('password-match');
            elementos.regContrasenaConfirm.classList.add('password-match');
            return true;
        } else {
            elementos.regContrasena.classList.remove('password-match');
            elementos.regContrasenaConfirm.classList.remove('password-match');
            elementos.regContrasena.classList.add('password-mismatch');
            elementos.regContrasenaConfirm.classList.add('password-mismatch');
            return false;
        }
    }
    return false;
}

// Manejadores de eventos principales
function manejarLogin() {
    console.log('Manejando login...');
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (!username || !password) {
        AlertManager.warning('Por favor ingrese usuario y contraseña');
        return;
    }
    
    try {
        const cliente = banco.autenticar(username, password);
        if (cliente) {
            setClienteActual(cliente);
            elementos.userNameElement.textContent = `${cliente.nombre} ${cliente.apellido}`;
            actualizarInformacionCuentas();
            showScreen(elementos.transactionScreen);
            AlertManager.success(`Bienvenido, ${cliente.nombre} ${cliente.apellido}`);
            
            // Limpiar campos de login
            document.getElementById('username').value = '';
            document.getElementById('password').value = '';
        } else {
            AlertManager.error('Usuario o contraseña incorrectos');
        }
    } catch (error) {
        AlertManager.error(error.message);
    }
}

function manejarRegistro() {
    console.log('Manejando registro...');
    const nombre = document.getElementById('reg-nombre').value;
    const apellido = document.getElementById('reg-apellido').value;
    const direccion = document.getElementById('reg-direccion').value;
    const identificacion = document.getElementById('reg-identificacion').value;
    const usuario = document.getElementById('reg-usuario').value;
    const contrasena = document.getElementById('reg-contrasena').value;
    const tipoCuenta = document.getElementById('reg-tipo-cuenta').value;
    
    if (!nombre || !apellido || !direccion || !identificacion || !usuario || !contrasena || !tipoCuenta) {
        AlertManager.warning('Por favor complete todos los campos');
        return;
    }
    
    if (!validarContrasenas()) {
        AlertManager.error('Las contraseñas no coinciden');
        return;
    }
    
    try {
        const nuevoCliente = new Cliente(nombre, apellido, direccion, identificacion, usuario, contrasena);
        banco.registrarCliente(nuevoCliente, tipoCuenta);
        
        AlertManager.success('Registro exitoso. Ahora puede iniciar sesión.');
        
        // Limpiar el formulario
        document.getElementById('reg-nombre').value = '';
        document.getElementById('reg-apellido').value = '';
        document.getElementById('reg-direccion').value = '';
        document.getElementById('reg-identificacion').value = '';
        document.getElementById('reg-usuario').value = '';
        document.getElementById('reg-contrasena').value = '';
        document.getElementById('reg-contrasena-confirm').value = '';
        document.getElementById('reg-tipo-cuenta').value = '';
        
        // Volver a la pantalla de login
        showScreen(elementos.loginScreen);
    } catch (error) {
        AlertManager.error(error.message);
    }
}

function manejarLogout() {
    AlertManager.confirm('¿Está seguro de que desea cerrar sesión?', 'Cerrar Sesión')
        .then((result) => {
            if (result.isConfirmed) {
                limpiarClienteActual();
                showScreen(elementos.loginScreen);
                AlertManager.info('Sesión cerrada correctamente');
            }
        });
}

// Manejadores de operaciones específicas
function manejarCambioSaldo() {
    const cuentaSeleccionada = elementos.saldoCuentaSelect.value;
    const cliente = getClienteActual();
    
    if (cuentaSeleccionada && cliente) {
        try {
            const saldo = cliente.consultarSaldo(cuentaSeleccionada);
            const saldoResult = document.getElementById('saldo-result');
            
            if (saldoResult) {
                saldoResult.innerHTML = `
                    <div style="padding: 15px; background-color: #d4edda; color: #155724; border-radius: 8px; margin-top: 15px;">
                        <strong>Saldo actual:</strong> $${saldo.toLocaleString()}
                    </div>
                `;
            }
        } catch (error) {
            AlertManager.error(error.message);
        }
    }
}

function manejarDeposito() {
    const cuentaSeleccionada = elementos.depositoCuentaSelect.value;
    const monto = parseFloat(document.getElementById('deposito-monto').value);
    const cliente = getClienteActual();
    
    if (!cuentaSeleccionada || !monto || monto <= 0) {
        AlertManager.warning('Por favor seleccione una cuenta e ingrese un monto válido');
        return;
    }
    
    try {
        const nuevoSaldo = cliente.realizarDeposito(cuentaSeleccionada, monto);
        AlertManager.success(`Depósito exitoso. Nuevo saldo: $${nuevoSaldo.toLocaleString()}`);
        actualizarInformacionCuentas();
        document.getElementById('depositar-container').style.display = 'none';
        document.getElementById('deposito-monto').value = '';
    } catch (error) {
        AlertManager.error(error.message);
    }
}

function manejarRetiro() {
    const cuentaSeleccionada = elementos.retiroCuentaSelect.value;
    const monto = parseFloat(document.getElementById('retiro-monto').value);
    const cliente = getClienteActual();
    
    if (!cuentaSeleccionada || !monto || monto <= 0) {
        AlertManager.warning('Por favor seleccione una cuenta e ingrese un monto válido');
        return;
    }
    
    try {
        const nuevoSaldo = cliente.realizarRetiro(cuentaSeleccionada, monto);
        AlertManager.success(`Retiro exitoso. Nuevo saldo: $${nuevoSaldo.toLocaleString()}`);
        actualizarInformacionCuentas();
        document.getElementById('retirar-container').style.display = 'none';
        document.getElementById('retiro-monto').value = '';
    } catch (error) {
        AlertManager.error(error.message);
    }
}

function manejarTransferencia() {
    const cuentaOrigen = elementos.transferenciaOrigenSelect.value;
    const cuentaDestinoNumero = document.getElementById('transferencia-destino').value;
    const monto = parseFloat(document.getElementById('transferencia-monto').value);
    const cliente = getClienteActual();
    
    if (!cuentaOrigen || !cuentaDestinoNumero || !monto || monto <= 0) {
        AlertManager.warning('Por favor complete todos los campos con valores válidos');
        return;
    }
    
    try {
        // Buscar la cuenta destino
        const cuentaDestino = banco.buscarCuenta(cuentaDestinoNumero);
        if (!cuentaDestino) {
            throw new Error("La cuenta destino no existe");
        }
        
        if (cuentaOrigen === cuentaDestinoNumero) {
            throw new Error("No puede transferir a la misma cuenta");
        }
        
        AlertManager.confirm(`¿Está seguro de que desea transferir $${monto.toLocaleString()} a la cuenta ${cuentaDestinoNumero}?`, 'Confirmar Transferencia')
            .then((result) => {
                if (result.isConfirmed) {
                    cliente.realizarTransferencia(cuentaOrigen, cuentaDestino, monto);
                    AlertManager.success(`Transferencia exitosa de $${monto.toLocaleString()} a la cuenta ${cuentaDestinoNumero}`);
                    actualizarInformacionCuentas();
                    document.getElementById('transferir-container').style.display = 'none';
                    document.getElementById('transferencia-destino').value = '';
                    document.getElementById('transferencia-monto').value = '';
                }
            });
    } catch (error) {
        AlertManager.error(error.message);
    }
}

function manejarAbrirCuenta() {
    const tipoCuenta = document.getElementById('nueva-cuenta-tipo').value;
    const cliente = getClienteActual();
    
    if (!tipoCuenta) {
        AlertManager.warning('Por favor seleccione un tipo de cuenta');
        return;
    }
    
    try {
        const nuevaCuenta = banco.abrirNuevaCuenta(cliente, tipoCuenta);
        AlertManager.success(`Nueva cuenta ${tipoCuenta} creada exitosamente. Número de cuenta: ${nuevaCuenta.numeroCuenta}`);
        actualizarInformacionCuentas();
        document.getElementById('abrir-cuenta-container').style.display = 'none';
        document.getElementById('nueva-cuenta-tipo').value = '';
    } catch (error) {
        AlertManager.error(error.message);
    }
}

function inicializarEditarPerfil() {
    const cliente = getClienteActual();
    if (!cliente) return;
    
    document.getElementById('editar-nombre').value = cliente.nombre;
    document.getElementById('editar-apellido').value = cliente.apellido;
    document.getElementById('editar-direccion').value = cliente.direccion;
    document.getElementById('editar-usuario').value = cliente.usuario;
    document.getElementById('editar-contrasena').value = '';
    document.getElementById('editar-nueva-contrasena').value = '';
    document.getElementById('editar-confirmar-contrasena').value = '';
}

function manejarEditarPerfil() {
    const nombre = document.getElementById('editar-nombre').value;
    const apellido = document.getElementById('editar-apellido').value;
    const direccion = document.getElementById('editar-direccion').value;
    const usuario = document.getElementById('editar-usuario').value;
    const contrasenaActual = document.getElementById('editar-contrasena').value;
    const nuevaContrasena = document.getElementById('editar-nueva-contrasena').value;
    const confirmarContrasena = document.getElementById('editar-confirmar-contrasena').value;
    const cliente = getClienteActual();
    
    if (!nombre || !apellido || !direccion || !usuario || !contrasenaActual) {
        AlertManager.warning('Por favor complete todos los campos obligatorios');
        return;
    }
    
    // Verificar contraseña actual
    if (contrasenaActual !== cliente.contrasena) {
        AlertManager.error('La contraseña actual es incorrecta');
        return;
    }
    
    // Si se ingresó una nueva contraseña, validar que coincidan
    if (nuevaContrasena && nuevaContrasena !== confirmarContrasena) {
        AlertManager.error('Las nuevas contraseñas no coinciden');
        return;
    }
    
    try {
        // Actualizar datos del cliente
        cliente.nombre = nombre;
        cliente.apellido = apellido;
        cliente.direccion = direccion;
        cliente.usuario = usuario;
        
        // Actualizar contraseña si se proporcionó una nueva
        if (nuevaContrasena) {
            cliente.contrasena = nuevaContrasena;
        }
        
        // Actualizar nombre en la interfaz
        elementos.userNameElement.textContent = `${cliente.nombre} ${cliente.apellido}`;
        
        AlertManager.success('Información actualizada correctamente');
        document.getElementById('editar-perfil-container').style.display = 'none';
    } catch (error) {
        AlertManager.error(error.message);
    }
}

function manejarCambioMovimientos() {
    const cuentaSeleccionada = elementos.movimientosCuentaSelect.value;
    const cliente = getClienteActual();
    
    if (cuentaSeleccionada && cliente) {
        try {
            const movimientos = cliente.consultarMovimientos(cuentaSeleccionada);
            const movimientosResult = document.getElementById('movimientos-result');
            
            if (!movimientosResult) return;
            
            movimientosResult.innerHTML = '';
            
            if (movimientos.length === 0) {
                movimientosResult.innerHTML = '<p style="text-align: center; padding: 15px;">No hay movimientos para mostrar</p>';
            } else {
                const movimientosList = document.createElement('ul');
                movimientosList.className = 'movimientos-list';
                
                // Ordenar movimientos por fecha (más recientes primero)
                movimientos.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
                
                // Mostrar todos los movimientos
                movimientos.forEach(mov => {
                    const li = document.createElement('li');
                    li.className = 'movimiento-item';
                    
                    let tipoClase = '';
                    let signo = '';
                    let montoMostrar = mov.monto;
                    
                    if (mov.tipo === 'deposito') {
                        tipoClase = 'deposito';
                        signo = '+';
                    } else if (mov.tipo === 'retiro') {
                        tipoClase = 'retiro';
                        signo = '-';
                    } else if (mov.tipo === 'transferencia') {
                        tipoClase = 'transferencia';
                        signo = mov.monto > 0 ? '+' : '-';
                        montoMostrar = Math.abs(mov.monto);
                    }
                    
                    li.innerHTML = `
                        <span>${new Date(mov.fecha).toLocaleString()}</span>
                        <span class="${tipoClase}">${signo}$${montoMostrar.toLocaleString()}</span>
                        <span>Saldo: $${mov.saldoResultante.toLocaleString()}</span>
                        ${mov.descripcion ? `<span>${mov.descripcion}</span>` : ''}
                    `;
                    
                    movimientosList.appendChild(li);
                });
                
                movimientosResult.appendChild(movimientosList);
            }
        } catch (error) {
            AlertManager.error(error.message);
        }
    }
}