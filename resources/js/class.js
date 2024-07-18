class Carta {

    constructor(numero, palo) {
        this.numero = numero
        this.palo = palo
        this.destapada = false
        this.valorTruco = 0
        this.valorEnvido = 0
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

    darValorTruco() {
        if (this.numero == 1 && this.palo == 'E') {
            this.valorTruco = 14
        }
        if (this.numero == 1 && this.palo == 'B') {
            this.valorTruco = 13
        }
        if (this.numero == 7 && this.palo == 'E') {
            this.valorTruco = 12
        }
        if (this.numero == 7 && this.palo == 'O') {
            this.valorTruco = 11
        }
        if (this.numero == 3 || this.numero == 2) {
            this.valorTruco = (this.numero + 7)
        }
        if (this.numero == 1 && (this.palo == 'O' || this.palo == 'C')) {
            this.valorTruco = 8
        }
        if (this.numero == 12 || this.numero == 11 || this.numero == 10) {
            this.valorTruco = (this.numero - 5)
        }
        if (this.numero == 7 && (this.palo == 'B' || this.palo == 'C')) {
            this.valorTruco = 4
        }
        if (this.numero == 6 || this.numero == 5 || this.numero == 4) {
            this.valorTruco = (this.numero - 3)
        }
    }

    darValorEnvido() {
        if (this.numero != 10 && this.numero != 11 && this.numero != 12) {
            this.darValorEnvido = this.numero
        } else {
            this.darValorEnvido = 0
        }
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
        this.puntosEnvido = 0
        this.flor = false
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
            return { cartaTirada: cartaTirada, posicion: posicion }
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
            cartaUser.darValorTruco()
            cartaCPU.darValorTruco()
            cartaUser.darValorEnvido()
            cartaCPU.darValorEnvido()
            this.user.cartas.push(cartaUser)
            this.CPU.cartas.push(cartaCPU)
        }
        this.user.cartas.forEach((elm) => { elm.destaparCarta() })
        this.user.verCartas('.cardsManoUser', 'cardUser')
        this.CPU.verCartas('.cardsManoCPU', 'cardCPU')
        this.calculoEnvido(this.CPU)
        this.calculoEnvido(this.user)
    }

    ganadorPartida(cartaUser, cartaCPU) {
        if (cartaUser.valorTruco > cartaCPU.valorTruco) {
            this.user.puntos += 1
        } else if (cartaUser.valorTruco < cartaCPU.valorTruco) {
            this.CPU.puntos += 1
        }
    }

    calculoEnvido(jugador) {
        jugador.flor = false;
        if (jugador.cartas[0].palo == jugador.cartas[1].palo) {
            if (jugador.cartas[0].palo == jugador.cartas[2].palo) {
                jugador.flor = true;
            } else {
                jugador.puntosEnvido = jugador.cartas[0].valorEnvido + jugador.cartas[1].valorEnvido + 20;
            };
        }
        if (jugador.cartas[0].palo == jugador.cartas[2].palo) {
            jugador.puntosEnvido = jugador.cartas[0].valorEnvido + jugador.cartas[2].valorEnvido + 20;
        }
        if (jugador.cartas[1].palo == jugador.cartas[2].palo) {
            jugador.puntosEnvido = jugador.cartas[1].valorEnvido + jugador.cartas[2].valorEnvido + 20;
        }

        console.log(jugador.nombre)
        console.log(jugador.puntosEnvido)
        console.log(jugador)
        console.log(jugador.cartas[0])
        console.log(jugador.cartas[1].valorEnvido)
        console.log(jugador.cartas[2].valorEnvido)
    }
}

