// CLASE CUENTA - Representa una cuenta bancaria básica
class Cuenta {
    constructor(numeroCuenta, saldo = 0) {
        this.numeroCuenta = numeroCuenta;
        this.saldo = saldo;
        this.movimientos = [];
    }

    consultarSaldo() {
        return this.saldo;
    }

    realizarDeposito(monto) {
        if (monto <= 0) {
            throw new Error("El monto debe ser mayor a cero");
        }
        this.saldo += monto;
        this.movimientos.push({
            tipo: "deposito",
            monto: monto,
            fecha: new Date(),
            saldoResultante: this.saldo
        });
        return this.saldo;
    }

    realizarRetiro(monto) {
        if (monto <= 0) {
            throw new Error("El monto debe ser mayor a cero");
        }
        if (monto > this.saldo) {
            throw new Error("Fondos insuficientes");
        }
        this.saldo -= monto;
        this.movimientos.push({
            tipo: "retiro",
            monto: monto,
            fecha: new Date(),
            saldoResultante: this.saldo
        });
        return this.saldo;
    }

    consultarMovimientos() {
        return this.movimientos;
    }
}

// CLASE CUENTA DE AHORROS - Extiende la clase Cuenta
class CuentaAhorros extends Cuenta {
    constructor(numeroCuenta, saldo = 0) {
        super(numeroCuenta, saldo);
        this.tipo = "ahorros";
    }
    
    realizarRetiro(monto) {
        if (monto > this.saldo) {
            throw new Error("Fondos insuficientes. La cuenta de ahorros no permite sobregiro.");
        }
        return super.realizarRetiro(monto);
    }
}

// CLASE CUENTA CORRIENTE - Extiende la clase Cuenta
class CuentaCorriente extends Cuenta {
    constructor(numeroCuenta, saldo = 0, sobregiro = 500000) {
        super(numeroCuenta, saldo);
        this.tipo = "corriente";
        this.sobregiro = sobregiro;
    }

    realizarRetiro(monto) {
        if (monto <= 0) {
            throw new Error("El monto debe ser mayor a cero");
        }
        if (monto > this.saldo + this.sobregiro) {
            throw new Error(`Fondos insuficientes. Límite de sobregiro excedido. Límite: $${this.sobregiro}`);
        }
        this.saldo -= monto;
        this.movimientos.push({
            tipo: "retiro",
            monto: monto,
            fecha: new Date(),
            saldoResultante: this.saldo
        });
        return this.saldo;
    }
}

// CLASE CLIENTE - Representa un cliente del banco
class Cliente {
    constructor(nombre, apellido, direccion, numeroIdentificacion, usuario, contrasena) {
        this.nombre = nombre;
        this.apellido = apellido;
        this.direccion = direccion;
        this.numeroIdentificacion = numeroIdentificacion;
        this.usuario = usuario;
        this.contrasena = contrasena;
        this.cuentas = [];
    }

    agregarCuenta(cuenta) {
        this.cuentas.push(cuenta);
    }

    consultarSaldo(numeroCuenta) {
        const cuenta = this.cuentas.find(c => c.numeroCuenta === numeroCuenta);
        if (!cuenta) {
            throw new Error("Cuenta no encontrada");
        }
        return cuenta.consultarSaldo();
    }

    realizarDeposito(numeroCuenta, monto) {
        const cuenta = this.cuentas.find(c => c.numeroCuenta === numeroCuenta);
        if (!cuenta) {
            throw new Error("Cuenta no encontrada");
        }
        return cuenta.realizarDeposito(monto);
    }

    realizarRetiro(numeroCuenta, monto) {
        const cuenta = this.cuentas.find(c => c.numeroCuenta === numeroCuenta);
        if (!cuenta) {
            throw new Error("Cuenta no encontrada");
        }
        return cuenta.realizarRetiro(monto);
    }

    consultarMovimientos(numeroCuenta) {
        const cuenta = this.cuentas.find(c => c.numeroCuenta === numeroCuenta);
        if (!cuenta) {
            throw new Error("Cuenta no encontrada");
        }
        return cuenta.consultarMovimientos();
    }

    realizarTransferencia(origenNumeroCuenta, destinoCuenta, monto) {
        const cuentaOrigen = this.cuentas.find(c => c.numeroCuenta === origenNumeroCuenta);
        if (!cuentaOrigen) {
            throw new Error("Cuenta de origen no encontrada");
        }
        
        cuentaOrigen.realizarRetiro(monto);
        destinoCuenta.realizarDeposito(monto);
        
        cuentaOrigen.movimientos.push({
            tipo: "transferencia",
            monto: -monto,
            fecha: new Date(),
            saldoResultante: cuentaOrigen.saldo,
            descripcion: `Transferencia a cuenta ${destinoCuenta.numeroCuenta}`
        });
        
        destinoCuenta.movimientos.push({
            tipo: "transferencia",
            monto: monto,
            fecha: new Date(),
            saldoResultante: destinoCuenta.saldo,
            descripcion: `Transferencia de cuenta ${cuentaOrigen.numeroCuenta}`
        });
    }
}

export { Cuenta, CuentaAhorros, CuentaCorriente, Cliente };