let usuarios
fetch('./resources/db/usuarios.json')
    .then((response) => response.json())
    .then((data) => usuarios = data)
    .catch((error) => console.log(`Error: ${error}`))

localStorage.setItem('user', '')
let saludo = document.querySelector('#saludo')
let formLogin = document.querySelector('form')
let aviso = document.createElement('p')

formLogin.onsubmit = (e) => {
    e.preventDefault()
    let nombre = (formLogin[0].value).toUpperCase()
    let pass = formLogin[1].value
    nombre ? validarUsuario(nombre, pass) : (
        aviso.innerText = 'Debe ingresar un nombre',
        saludo.append(aviso)
    )
}

const validarUsuario = (nombre, pass) => {
    let usuario_input = usuarios.find((elm) => (elm) && elm.nombre == nombre)
    if (usuario_input) {
        if (usuario_input.contraseña == pass) {
            aviso.innerText = `Hola otra vez ${nombre} al TRUCO ARGENTINO
En breve comenzaremos...`
            localStorage.setItem('user', nombre)
            setTimeout(() => {
                window.location.href = '/pages/panel.html'
            }, 3000);
        } else {
            aviso.innerText = '❌ La Contaseña es incorrecta'
            setTimeout(() => {
                aviso.remove()
            }, 3000);
        }
    } else {
        aviso.innerText = `✅ Bienvenid@ ${nombre} al TRUCO ARGENTINO
En breve comenzaremos...`
        localStorage.setItem('user', nombre)
        setTimeout(() => {
            window.location.href = '/pages/panel.html'
        }, 3000);
    }
    saludo.append(aviso)
}
let invitado = document.querySelector('.invitado')
invitado.onclick = () => {
    aviso.innerText = '✅ Bienvenido Invitado. Recuerda que sin usuario no guardaremos tu juego'
    saludo.append(aviso)
    setTimeout(() => {
        window.location.href = '/pages/panel.html'
    }, 3000);
    localStorage.setItem('user', 'invitado')
}
