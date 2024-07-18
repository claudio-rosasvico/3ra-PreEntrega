let user = localStorage.getItem('user')
let nombreManoUser = document.querySelector('.nombreUser')
nombreManoUser.innerText = `Tus cartas ${user}`
let nombreMesaUser = document.querySelector('#nombreMesa')
nombreMesaUser.innerText = `Cartas de ${user}`

let mesaUser = document.querySelector('.mesaUser')
let mesaCPU = document.querySelector('.mesaCPU')

let puntosUser = document.querySelector('.puntosUser')
let puntosCPU = document.querySelector('.puntosCPU')

let panel = document.querySelector('.panel')
let botonEnvido = document.querySelector('button#envido')
botonEnvido.disabled = true
let botonTruco = document.querySelector('button#truco')
botonTruco.disabled = true

let usuarios
let usuario
fetch('/../resources/db/usuarios.json')
    .then((response) => response.json())
    .then((data) => usuarios = data)
    .then((usuarios) => usuario = usuarios.find((elm) => (elm) && elm.nombre == user))
    .catch((error) => console.warn(`Error: ${error}`))

let partida = new Partida
partida.comenzar(user)

let repartir = document.querySelector('#repartir')
repartir.onclick = () => {
    limpiarMesa()
    partida.repartirCartas()
    repartir.disabled = true
    leerCartasRepartidas()
    partida.puntosPartida = 0
    partida.truco = false
    botonEnvido.disabled = false
    botonTruco.disabled = false
    if (partida.user.flor) {
        botonEnvido.innerText = 'Flor'
    } else {
        botonEnvido.innerText = 'Envido'
    }
}

const leerCartasRepartidas = () => {
    let cartasUser = document.querySelectorAll('.cardUser')
    let cartasCPU = document.querySelectorAll('.cardCPU')
    cartasUser.forEach((carta, index) => {
        carta.onclick = () => {
            let cartaTiradaUser = partida.user.tirarCarta(index)
            mesaUser.innerHTML += `<img src="/resources/img/naipes/${cartaTiradaUser.getCarta()}.png" alt="cardMesa${index + 1}" class="p-1 cardMesa">`
            carta.remove()
            let cartaTiradaCPU = partida.CPU.tirarCarta()
            mesaCPU.innerHTML += `<img src="/resources/img/naipes/${cartaTiradaCPU.cartaTirada.getCarta()}.png" alt="cardMesa${index + 1}" class="p-1 cardMesa">`
            cartasCPU[cartaTiradaCPU.posicion].remove()
            cartasCPU = document.querySelectorAll('.cardCPU')
            partida.ganadorMano(cartaTiradaUser, cartaTiradaCPU.cartaTirada)
            if (partida.CPU.cartas.length == 0) {
                botonTruco.disabled = true
                botonEnvido.disabled = true
                repartir.disabled = false
                partida.calculoTruco()
                puntosUser.innerText = `${user}: ${partida.user.puntos}`
                puntosCPU.innerText = `CPU: ${partida.CPU.puntos}`
                verificarPuntos()
            }
        }
    })
}

const limpiarMesa = () => {
    let cartasUser = document.querySelectorAll('.cardMesa')
    cartasUser.forEach((carta) => {
        carta.remove()
    })

}

const verificarPuntos = () => {
    let puntosUser = partida.user.puntos
    let puntosCPU = partida.CPU.puntos
    let imgMazo = document.querySelector('.mazo')
    let botones = document.querySelector('.botones')
    let gane = true
    if ((puntosUser >= 10 || puntosCPU >= 10) && puntosUser != puntosCPU) {
        if (puntosUser > puntosCPU) {
            imgMazo.innerHTML = '<img class="mt-5 text-center" src="/resources/img/gane.gif" alt="" srcset="">'
        } else if (puntosUser < puntosCPU) {
            imgMazo.innerHTML = '<img class="mt-5 text-center" src="/resources/img/perdi.gif" alt="" srcset="">'
            gane = false
        }
        botones.innerHTML = `<button class="btn btn-primary mt-1" id="reiniciar">Reiniciar</button>
                            <button class="btn btn-warning mt-1" id="cambiarUsuario">Cambiar Usuario</button>`
        let reiniciar = document.querySelector('#reiniciar')
        let cambiarUsuario = document.querySelector('#cambiarUsuario')
        reiniciar.onclick = () => { location.reload() }
        cambiarUsuario.onclick = () => { window.location.href = '/../index.html' }
    }

}

botonEnvido.onclick = () => {
    if (botonEnvido.innerText == 'Flor') {
        Swal.fire({
            title: "¡FELICITACIONES!",
            text: "Sumas 5 ptos con tu Flor",
            icon: "success"
        });
        partida.user.puntos += 5
    } else if (partida.CPU.puntosEnvido > partida.user.puntosEnvido) {
        partida.CPU.puntos += 2
        Swal.fire({
            title: "Lo Siento 👎",
            text: `CPU tiene ${partida.CPU.puntosEnvido} y gana 2 ptos`,
            icon: "error"
        });
    } else if (partida.CPU.puntosEnvido < partida.user.puntosEnvido) {
        Swal.fire({
            title: "¡FELICITACIONES!",
            text: `Ganaste con ${partida.user.puntosEnvido} y sumaste 2 ptos`,
            icon: "success"
        });
        partida.user.puntos += 2
    } else {
        Swal.fire({
            title: "¡FELICITACIONES!",
            text: `¡¡Empataron!! Te doy los puntos a vos por ser amigo de PEPE 😊`,
            icon: "info"
        });
        partida.user.puntos += 2
    }
    botonEnvido.disabled = true
}

botonTruco.onclick = () => {
    partida.truco = true
    botonTruco.disabled = true
    botonEnvido.disabled = true
    Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Cantaste Truco",
        showConfirmButton: false,
        timer: 2000,
        width: '20em',
    });
}
