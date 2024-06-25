class Carta {

    constructor(numero, palo) {
        this.numero = numero
        this.palo = palo
        this.destapada = false
        this.valor = this.darValor(numero, palo)
    }

    getCarta() {
        return (this.destapada == false) ? 'tapada' : (this.numero + this.palo);
    }

    getCartaEnMano() {
        console.log(this.numero + this.palo)
    }

    taparCarta() {
        this.destapada = false
    }

    destaparCarta() {
        this.destapada = true
    }

    darValor(numero, palo) {
        if (numero == 1 && palo == 'E') {
            return 14
        }
        if (numero == 1 && palo == 'B') {
            return 13
        }
        if (numero == 7 && palo == 'E') {
            return 12
        }
        if (numero == 7 && palo == 'O') {
            return 11
        }
        if (numero == 3 || numero == 2) {
            return (numero + 7)
        }
        if (numero == 1 && (palo == 'O' || palo == 'C')) {
            return 8
        }
        if (numero == 12 || numero == 11 || numero == 10) {
            return (numero - 5)
        }
        if (numero == 7 && (palo == 'B' || palo == 'C')) {
            return 4
        }
        if (numero == 6 || numero == 5 || numero == 4) {
            return (numero - 3)
        }
        return 0;
    }

}

class Mazo {

    constructor() {
        this.cartas = []
    }

    completarMazo() {
        const palos = ['O', 'C', 'E', 'B']
        let mazoCompleto = []
        palos.forEach(element => {
            for (let i = 1; i <= 12; i++) {
                mazoCompleto.push(new Carta(i, element))
            }
        })
        this.cartas = mazoCompleto.filter(element => (element.numero != 8 && element.numero != 9))
    }

    mostrarMazo() {
        console.log(this.cartas)
    }

    mezclarCartas() {
        let mazoMezclado = new Mazo
        if (this.cartas.length > 1) {
            while (this.cartas.length > 0) {
                let i = Math.floor(Math.random() * (this.cartas.length))
                let valor = this.cartas[i]
                mazoMezclado.cartas.push(valor)
                this.cartas.splice(i, 1)
            }
        } else {
            console.log('El mazo está vacío')
        }
        return mazoMezclado
    }
}

class Jugador {

    constructor(nombre, user) {
        this.nombre = nombre
        this.cartas = []
        this.cartasEnMesa = []
        this.puntos = 0
        this.user = user
        this.ultimoPartido = {}
    }

    verCartas(ubicacion, clase) {
        let nodo = document.querySelector(ubicacion)
        this.cartas.forEach((elm, index) => {
            nodo.innerHTML += `<img src="/resources/img/naipes/${elm.getCarta()}.png" value="${index}" alt="cardUser1" class="cardMano ${clase}">`
        })

    }

    tirarCarta(posicion = -1) {
        if (posicion == -1) {
            posicion = Math.floor((Math.random() * (this.cartas.length)))
            let cartaTirada = this.cartas[posicion]
            cartaTirada.destapada = true
            this.cartas.splice(posicion, 1)
            return {cartaTirada: cartaTirada, posicion: posicion}
        } else {
            let cartaTirada = this.cartas[posicion]
            return cartaTirada
        }
    }

}

class Partida {

    constructor() {
        this.user
        this.CPU = new Jugador('CPU', false)
    }

    comenzar(nombre) {
        let nombreJugador = nombre || 'invitado'
        this.user = new Jugador(nombreJugador, true)
    }

    repartirCartas() {
        let naipes = new Mazo
        naipes.completarMazo()
        naipes = naipes.mezclarCartas()
        this.user.cartas = []
        this.CPU.cartas = []
        for (let i = 0; i < 3; i++) {
            let cartaUser = naipes.cartas.pop()
            let cartaCPU = naipes.cartas.pop()
            this.user.cartas.push(cartaUser)
            this.CPU.cartas.push(cartaCPU)
        }
        this.user.cartas.forEach((elm) => { elm.destaparCarta() })
        this.user.verCartas('.cardsManoUser', 'cardUser')
        this.CPU.verCartas('.cardsManoCPU', 'cardCPU')
    }

    ganadorPartida(cartaUser, cartaCPU){
        if (cartaUser.valor > cartaCPU.valor) {
            this.user.puntos += 1
        } else if (cartaUser.valor < cartaCPU.valor) {
            this.CPU.puntos += 1
        }
    }
}

