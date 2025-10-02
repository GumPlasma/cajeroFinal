import { Cliente, CuentaAhorros, CuentaCorriente } from './Clases.js';

class BancoElBro {
    constructor() {
        this.clientes = [];
        this.cuentas = [];
        this.cargarDatosIniciales();
    }

    cargarDatosIniciales() {
        // Crear clientes de ejemplo
        const cliente1 = new Cliente("Juan", "Perez", "Calle 123", "12345678", "juanperez", "password123");
        const cliente2 = new Cliente("Maria", "Gomez", "Avenida 456", "87654321", "mariagomez", "password456");
        
        // Crear cuentas para los clientes
        const cuenta1 = new CuentaAhorros("1000000001", 500000);
        const cuenta2 = new CuentaCorriente("1000000002", 1000000);
        const cuenta3 = new CuentaAhorros("1000000003", 750000);
        const cuenta4 = new CuentaCorriente("1000000004", 2000000);
        
        // Asignar cuentas a clientes
        cliente1.agregarCuenta(cuenta1);
        cliente1.agregarCuenta(cuenta2);
        cliente2.agregarCuenta(cuenta3);
        cliente2.agregarCuenta(cuenta4);
        
        // Agregar clientes al banco
        this.clientes.push(cliente1);
        this.clientes.push(cliente2);
        
        // Agregar todas las cuentas al array general
        this.cuentas.push(cuenta1, cuenta2, cuenta3, cuenta4);
        
        // Simular algunas transacciones iniciales
        cuenta1.realizarDeposito(200000);
        cuenta1.realizarRetiro(50000);
        cuenta2.realizarDeposito(300000);
        cuenta2.realizarRetiro(150000);
    }

    autenticar(usuario, contrasena) {
        return this.clientes.find(cliente => 
            cliente.usuario === usuario && cliente.contrasena === contrasena
        );
    }

    registrarCliente(cliente, tipoCuenta) {
        // Verificar si el usuario ya existe
        if (this.clientes.some(c => c.usuario === cliente.usuario)) {
            throw new Error("El usuario ya existe");
        }
        
        // Verificar si la identificación ya existe
        if (this.clientes.some(c => c.numeroIdentificacion === cliente.numeroIdentificacion)) {
            throw new Error("El número de identificación ya está registrado");
        }
        
        // Crear una cuenta del tipo seleccionado para el nuevo cliente
        const numeroCuenta = this.generarNumeroCuenta();
        let nuevaCuenta;
        
        if (tipoCuenta === "ahorros") {
            nuevaCuenta = new CuentaAhorros(numeroCuenta, 0);
        } else if (tipoCuenta === "corriente") {
            nuevaCuenta = new CuentaCorriente(numeroCuenta, 0);
        } else {
            throw new Error("Tipo de cuenta no válido");
        }
        
        cliente.agregarCuenta(nuevaCuenta);
        this.cuentas.push(nuevaCuenta);
        
        this.clientes.push(cliente);
        return cliente;
    }

    generarNumeroCuenta() {
        // Genera un número de cuenta de 10 dígitos
        const min = 1000000000;
        const max = 9999999999;
        const numero = Math.floor(Math.random() * (max - min + 1)) + min;
        return numero.toString();
    }

    buscarCuenta(numeroCuenta) {
        return this.cuentas.find(cuenta => cuenta.numeroCuenta === numeroCuenta);
    }

    abrirNuevaCuenta(cliente, tipoCuenta) {
        const numeroCuenta = this.generarNumeroCuenta();
        let nuevaCuenta;
        
        if (tipoCuenta === "ahorros") {
            nuevaCuenta = new CuentaAhorros(numeroCuenta, 0);
        } else if (tipoCuenta === "corriente") {
            nuevaCuenta = new CuentaCorriente(numeroCuenta, 0);
        } else {
            throw new Error("Tipo de cuenta no válido");
        }
        
        cliente.agregarCuenta(nuevaCuenta);
        this.cuentas.push(nuevaCuenta);
        
        return nuevaCuenta;
    }
}

export { BancoElBro };