// ============================================================
// CLASE CALCULADORA: contiene toda la lógica de la calculadora
// ============================================================
class Calculadora {
    // El constructor recibe los dos elementos de la pantalla
    constructor(operacionPreviaElemento, operacionActualElemento) {
        this.operacionPreviaElemento = operacionPreviaElemento;
        this.operacionActualElemento = operacionActualElemento;
        this.limpiar();  // Al crear la calculadora, la limpiamos
    }

    // Resetea todo a cero
    limpiar() {
        this.operacionActual = '';
        this.operacionPrevia = '';
        this.operador = undefined;
    }

    // Borra el último dígito
    borrar() {
        this.operacionActual = this.operacionActual.toString().slice(0, -1);
    }

    // Agrega un número (o el punto decimal) a la operación actual
    agregarNumero(numero) {
        // Si ya hay un punto y quieren agregar otro, no lo permitimos
        if (numero === '.' && this.operacionActual.includes('.')) return;
        this.operacionActual = this.operacionActual.toString() + numero.toString();
    }

    // Cuando el usuario elige +, -, ×, ÷
    elegirOperador(operador) {
        // Si no hay número escrito, ignoramos
        if (this.operacionActual === '') return;
        // Si ya había una operación previa, calculamos primero
        if (this.operacionPrevia !== '') {
            this.calcular();
        }
        this.operador = operador;
        this.operacionPrevia = this.operacionActual;
        this.operacionActual = '';
    }

    // Realiza el cálculo cuando se presiona =
    calcular() {
        let resultado;
        const previo = parseFloat(this.operacionPrevia);
        const actual = parseFloat(this.operacionActual);

        // Si alguno no es número válido, no hacemos nada
        if (isNaN(previo) || isNaN(actual)) return;

        // Elegimos qué operación hacer según el operador
        switch (this.operador) {
            case '+':
                resultado = previo + actual;
                break;
            case '-':
                resultado = previo - actual;
                break;
            case '×':
                resultado = previo * actual;
                break;
            case '÷':
                // Protegemos contra división por cero
                if (actual === 0) {
                    alert('¡No se puede dividir entre cero!');
                    this.limpiar();
                    return;
                }
                resultado = previo / actual;
                break;
            default:
                return;
        }

        this.operacionActual = resultado;
        this.operador = undefined;
        this.operacionPrevia = '';
    }

    // Formatea el número con separadores de miles (ej: 1000000 → 1.000.000)
    obtenerNumeroFormato(numero) {
        const cadenaNumero = numero.toString();
        const numeroEntero = parseFloat(cadenaNumero.split('.')[0]);
        const numeroDecimal = cadenaNumero.split('.')[1];

        let mostrarEntero;
        if (isNaN(numeroEntero)) {
            mostrarEntero = '';
        } else {
            // 'es' aplica el formato español (puntos como separadores de miles)
            mostrarEntero = numeroEntero.toLocaleString('es', { maximumFractionDigits: 0 });
        }

        if (numeroDecimal != null) {
            return `${mostrarEntero}.${numeroDecimal}`;
        } else {
            return mostrarEntero;
        }
    }

    // Actualiza los textos de la pantalla en el HTML
    actualizarPantalla() {
        this.operacionActualElemento.innerText =
            this.obtenerNumeroFormato(this.operacionActual) || '0';

        if (this.operador != null) {
            this.operacionPreviaElemento.innerText =
                `${this.obtenerNumeroFormato(this.operacionPrevia)} ${this.operador}`;
        } else {
            this.operacionPreviaElemento.innerText = '';
        }
    }
}

// ============================================================
// CONECTAR LA CLASE CON EL HTML
// ============================================================

// Seleccionamos todos los botones y elementos que necesitamos
const botonesNumero = document.querySelectorAll('[data-numero]');
const botonesOperador = document.querySelectorAll('[data-operacion]');
const botonIgual = document.querySelector('[data-igual]');
const botonBorrar = document.querySelector('[data-borrar]');
const botonTodo = document.querySelector('[data-todo]');
const operacionPreviaElemento = document.querySelector('[data-operacion-previa]');
const operacionActualElemento = document.querySelector('[data-operacion-actual]');

// Creamos una instancia de nuestra Calculadora
const calculadora = new Calculadora(operacionPreviaElemento, operacionActualElemento);

// Cuando se hace clic en un número, lo agregamos y actualizamos pantalla
botonesNumero.forEach(boton => {
    boton.addEventListener('click', () => {
        calculadora.agregarNumero(boton.innerText);
        calculadora.actualizarPantalla();
    });
});

// Cuando se hace clic en un operador
botonesOperador.forEach(boton => {
    boton.addEventListener('click', () => {
        calculadora.elegirOperador(boton.innerText);
        calculadora.actualizarPantalla();
        
    });
});

// Botón igual
botonIgual.addEventListener('click', () => {
    calculadora.calcular();
    calculadora.actualizarPantalla();
});

// Botón AC (borra todo)
botonTodo.addEventListener('click', () => {
    calculadora.limpiar();
    calculadora.actualizarPantalla();
});

// Botón DEL (borra un dígito)
botonBorrar.addEventListener('click', () => {
    calculadora.borrar();
    calculadora.actualizarPantalla();
});

// ============================================================
// BONUS: Soporte para teclado
// ============================================================
document.addEventListener('keydown', (event) => {
    if (event.key >= '0' && event.key <= '9') {
        calculadora.agregarNumero(event.key);
    } else if (event.key === '.') {
        calculadora.agregarNumero('.');
    } else if (event.key === '+' || event.key === '-') {
        calculadora.elegirOperador(event.key);
    } else if (event.key === '*') {
        calculadora.elegirOperador('×');
    } else if (event.key === '/') {
        event.preventDefault();  // evita que el navegador abra "buscar"
        calculadora.elegirOperador('÷');
    } else if (event.key === 'Enter' || event.key === '=') {
        calculadora.calcular();
    } else if (event.key === 'Backspace') {
        calculadora.borrar();
    } else if (event.key === 'Escape') {
        calculadora.limpiar();
    }
    calculadora.actualizarPantalla();
});