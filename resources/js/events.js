let fecha = new Date()
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
let usuarios = JSON.parse(localStorage.getItem('usuarios'))
let usuario = usuarios.find((elm) => elm.nombre == user)
if (user != 'invitado') {
    usuario.fecha == undefined ? panel.append('Primera vez que jugás') : panel.append(`Tu último juego fue el ${usuario.fecha} y lo ${usuario.gane ? 'GANASTE 🏆' : 'PERDISTE 😒'}`)
}

let partida = new Partida
partida.comenzar(user)

let repartir = document.querySelector('#repartir')
repartir.onclick = () => {
    limpiarMesa()
    partida.repartirCartas()
    repartir.disabled = true
    leerCartasRepartidas()
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
            partida.ganadorPartida(cartaTiradaUser, cartaTiradaCPU.cartaTirada)
            if (partida.CPU.cartas.length == 0) {
                repartir.disabled = false
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
    if ((puntosUser >= 5 || puntosCPU >= 5) && puntosUser != puntosCPU) {
        // Declaración de Ganador
        if (puntosUser > puntosCPU) {
            imgMazo.innerHTML = '<img class="mt-5 text-center" src="/resources/img/gane.gif" alt="" srcset="">'
        } else if (puntosUser < puntosCPU) {
            imgMazo.innerHTML = '<img class="mt-5 text-center" src="/resources/img/perdi.gif" alt="" srcset="">'
            gane = false
        }
        // Registro de resultado en usuario del localstorage
        if (user != 'invitado') {
            usuarios = usuarios.map(usuario => {
                if (usuario.nombre == user && usuario.fecha == undefined) {
                    return { ...usuario, fecha: fecha.toLocaleDateString(), gane: gane }
                } else if ((usuario.nombre == user && usuario.fecha != undefined)) {
                    return { nombre: usuario.nombre, pass: usuario.pass, fecha: fecha.toLocaleDateString(), gane: gane }
                }
            })
            localStorage.setItem('usuarios', JSON.stringify(usuarios))
        }
        // Habilitar botones para volver a jugar
        botones.innerHTML = `<button class="btn btn-primary mt-1" id="reiniciar">Reinicia</button>
                            <button class="btn btn-warning mt-1" id="cambiarUsuario">Cambiar Usuario</button>`
        let reiniciar = document.querySelector('#reiniciar')
        let cambiarUsuario = document.querySelector('#cambiarUsuario')
        reiniciar.onclick = () => { location.reload() }
        cambiarUsuario.onclick = () => { window.location.href = '/../index.html' }
    }

}