
const canvas = document.getElementById("pong");
const ctx = canvas.getContext('2d'); 

// cargar sonidos
let tocar = new Audio();
let pared = new Audio();
let usuarioScore = new Audio();
let pcScore = new Audio();

tocar.src = "sounds/hit.mp3";
pared.src = "sounds/wall.mp3";
pcScore.src = "sounds/comScore.mp3";
usuarioScore.src = "sounds/userScore.mp3"; 

const bola  = {
    x : canvas.width/2,
    y : canvas.height/2,
    radius : 10,
    velocidadX : 5,
    velocidadY : 5,
    velocidad : 7,
    color : "WHITE"
 }
const usuario = {
    x : 0, // left side of canvas
    y : (canvas.height - 100)/2, // -100 the height of paddle
    width : 10,
    height : 100,
    score : 0,
    color : "WHITE"
}
const pc = {
    x : canvas.width - 10, // - width of paddle
    y : (canvas.height - 100)/2, // -100 the height of paddle
    width : 10,
    height : 100,
    score : 0,
    color : "WHITE"
}
const red = {
    x : (canvas.width - 2)/2,
    y : 0,
    height : 10,
    width : 2,
    color : "WHITE"
}
function dibujarRectangulo(x, y, w, h, color){
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function dibujarCirculo(x, y, r, color){
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x,y,r,0,Math.PI*2,true);
    ctx.closePath();
    ctx.fill();
}
//reconocer el touch
    let iniciaX = null;
    let iniciaY = null;
    canvas.addEventListener('touchstart', evt => {
        const toquInicial = evt.touches[0];
        iniciaX = toquInicial.clientX;
        iniciaY = toquInicial.clientY;
      });
    canvas.addEventListener('touchmove', evt => {
        if (iniciaX && iniciaY) {
          const mueve = evt.touches[0];
          var mueveX = mueve.clientX;
          var mueveY = mueve.clientY;
          var difX = mueveX - iniciaX;
          var difY = mueveY - iniciaY;
          // Checa que el movimiento no sea muy corto,
          if (Math.abs(difX) + Math.abs(difY) > 150) {
            if (Math.abs(difX) > Math.abs(difY)) {
              if (difY > 70) {
                usuario.y = evt.clientY - rect.top - usuario.height/2;
            } else {
            }
            // Reinicia valores.
            iniciaX = null;
            iniciaY = null;
          }
        }
    }});
// mouse
canvas.addEventListener("mousemove", getMousePos);
 function getMousePos(evt){
    let rect = canvas.getBoundingClientRect();
    
    usuario.y = evt.clientY - rect.top - usuario.height/2;
}

function resetearPelota(){
    bola.x = canvas.width/2;
    bola.y = canvas.height/2;
    bola.velocidadX = -bola.velocidadX;
    bola.velocidad = 7;
}
function dibujarRed(){
    for(let i = 0; i <= canvas.height; i+=15){
        dibujarRectangulo(red.x, red.y + i, red.width, red.height, red.color);
    }
}
function dibujarTexto(text,x,y){
    ctx.fillStyle = "#FFF";
    ctx.font = "75px fantasy";
    ctx.fillText(text, x, y);
}

function colision(b,p){
    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;

    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;
    
    return p.left < b.right && p.top < b.bottom && p.right > b.left && p.bottom > b.top;
}

function actualizar(){
    if( bola.x - bola.radius < 0 ){
        pc.score++;
        pcScore.play();
        resetearPelota();
    }else if( bola.x + bola.radius > canvas.width){
        usuario.score++;
        usuarioScore.play();
        resetearPelota();
    }
    bola.x += bola.velocidadX;
    bola.y += bola.velocidadY;
    pc.y += ((bola.y - (pc.y + pc.height/2)))*0.1;
    if(bola.y - bola.radius < 0 || bola.y + bola.radius > canvas.height){
        bola.velocidadY = -bola.velocidadY;
        pared.play();
    }
    let player = (bola.x + bola.radius < canvas.width/2) ? usuario : pc;
    if(colision(bola,player)){
        tocar.play();
        let collidePoint = (bola.y - (player.y + player.height/2));
        collidePoint = collidePoint / (player.height/2);
        let angleRad = (Math.PI/4) * collidePoint;
        let direction = (bola.x + bola.radius < canvas.width/2) ? 1 : -1;
        bola.velocidadX = direction * bola.velocidad * Math.cos(angleRad);
        bola.velocidadY = bola.velocidad * Math.sin(angleRad);
        bola.velocidad += 0.1;
    }
}

function render(){

    dibujarRectangulo(0, 0, canvas.width, canvas.height, "#000");

    dibujarTexto(usuario.score,canvas.width/4,canvas.height/5);

    dibujarTexto(pc.score,3*canvas.width/4,canvas.height/5);
    
    dibujarRed();
    
    dibujarRectangulo(usuario.x, usuario.y, usuario.width, usuario.height, usuario.color);
    
    dibujarRectangulo(pc.x, pc.y, pc.width, pc.height, pc.color);
    
    dibujarCirculo(bola.x, bola.y, bola.radius, bola.color);
}
function juego(){
    actualizar();
    render();
}
let framePorSegundo = 50;

let loop = setInterval(juego,1000/framePorSegundo);


//Mensajes de Inicio
/** @interface */
class Saludo {
    saluda() { throw new Error("Error"); }
  }
  /** @implements {Saludo} */
  class SaludoEnInglés {
    /** @override */
    saluda() {
      alert("Hi this is a ping pong game, enjoy it");
    }
  }
  /** @implements {Saludo} */
  class SaludoEnEspañol {
    /** @override */
    saluda() {
      alert("Hola, este es un juego de ping pong, disfrútalo");
    }
  }
  const saludos =
    [new SaludoEnEspañol(), new SaludoEnInglés()];
  for (var saludo of saludos) {
    saludo.saluda();
  }

  class Inteligencia {
    constructor(nombre) {
      this.nombre = nombre;
    }
    presentate() {
      alert(`Hola. Soy ${this.nombre}.`);
    }
    /** @abstract */
    accion() { throw new Error("Error"); }
  }
  class Maquina extends Inteligencia {
    constructor(nombre) {
      super(nombre);
    }
    /** @override */
    accion() { alert("Soy una IA experta en ping pong, ¿Crees poder ganarme?"); }
  }
    const maquina = [new Maquina("Loria")];
  for (const m of maquina) {
    m.presentate();
    m.accion();
  } 

  customElements.define("baila-rina", class extends HTMLElement {
    connectedCallback() {
      this.x = 100;
      this.innerHTML = "&#x1F46F;";
    }
    muévete() {
      let y = 30;
      this.style.right = `${this.x}px`;
      this.style.top = `${y}px`;
      this.x = this.x > 800 ? 0 : this.x + 10;
    }
  });
  setInterval(() => bailarina.muévete(), 120);