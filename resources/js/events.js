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

let usuarios
let usuario
fetch('/../resources/db/usuarios.json')
    .then((response) => response.json())
    .then((data) => usuarios = data)
    .then((usuarios) => usuario = usuarios.find((elm) => (elm) && elm.nombre == user))
    .catch((error) => console.warn(`Eror: ${error}`))

let partida = new Partida
partida.comenzar(user)

let repartir = document.querySelector('#repartir')
repartir.onclick = () => {
    limpiarMesa()
    partida.repartirCartas()
    repartir.disabled = true
    leerCartasRepartidas()
    if(partida.user.flor){
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
    if ((puntosUser >= 10 || puntosCPU >= 10) && puntosUser != puntosCPU) {
        // Declaración de Ganador
        if (puntosUser > puntosCPU) {
            imgMazo.innerHTML = '<img class="mt-5 text-center" src="/resources/img/gane.gif" alt="" srcset="">'
        } else if (puntosUser < puntosCPU) {
            imgMazo.innerHTML = '<img class="mt-5 text-center" src="/resources/img/perdi.gif" alt="" srcset="">'
            gane = false
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

botonEnvido.onclick = () => {
    if(botonEnvido.innerText == 'Flor'){
        Swal.fire("¡¡Felicitaciones!! Sumaste 5 ptos con tu flor");
    } else if(partida.CPU.puntosEnvido > partida.user.puntosEnvido){
        Swal.fire(`¡¡Lo siento!! CPU tiene ${partida.CPU.puntosEnvido}`);
    } else if(partida.CPU.puntosEnvido < partida.user.puntosEnvido){
        Swal.fire(`¡¡FELICITACIONES!! GANASTE`);
    }
    console.log(partida.CPU.puntosEnvido)
    console.log(partida.user.puntosEnvido)
}
