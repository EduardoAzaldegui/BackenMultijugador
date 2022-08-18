//nos permite usar la libreria que instalamos es una importacion
const express = require("express")
const cors = require("cors")

//una variable que va almacenar una instancia del servidor que va a estar usando
const app = express()
app.set('port', process.env.PORT || 8080);

app.use(cors())
app.use(express.json())

const jugadores=[]

class Jugador{
  constructor(id){
    this.id=id;
  }

  asignarMokepon(mokepon){
     this.mokepon=mokepon;
  }

  actualizarPosicion(x, y) {
    this.x = x
    this.y = y
  }

  asignarAtaques(ataques) {
    this.ataques = ataques
  }

}

class Mokepon{
   constructor(nombre){
    this.nombre=nombre;
   }
}

//escuchando las peticiones del cliente
app.get("/unirse", (req, res) => {
  const id = `${Math.random()}`

  const jugador =new Jugador(id);

  jugadores.push(jugador);

  //introduciendo un metadata para permitir
  //conecciones de recursos externos al servidor
  //aqui habilitamos desde cualquier origen
  res.setHeader("Access-Control-Allow-Origin","*")

  res.send(id)

})


app.post("/mokepon/:jugadorId",(req,res)=>{
  //accediendo a la variable que esta en la url
  const jugadorId = req.params.jugadorId || ""
  const nombre = req.body.mokepon || ""
  const mokepon= new Mokepon(nombre)

  const jugadorIndex = jugadores.findIndex((jugador) => jugadorId === jugador.id)
  if(jugadorIndex>=0){
    jugadores[jugadorIndex].asignarMokepon(mokepon)
  }

  console.log(jugadores)
  console.log(jugadorId)
  res.end()
})


app.post("/mokepon/:jugadorId/posicion", (req, res) => {
  const jugadorId = req.params.jugadorId || ""
  const x = req.body.x || 0
  const y = req.body.y || 0

  const jugadorIndex = jugadores.findIndex((jugador) => jugadorId === jugador.id)

  if (jugadorIndex >= 0) {
    jugadores[jugadorIndex].actualizarPosicion(x, y)
  }

  //devuelve a los enemigos les avisa tu nueva posicion
  const enemigos = jugadores.filter((jugador) => jugadorId !== jugador.id)

  res.send({
    enemigos
  })

  res.end()
})


//enviar ataques elegidos
app.post("/mokepon/:jugadorId/ataques", (req, res) => {
  const jugadorId = req.params.jugadorId || ""
  const ataques = req.body.ataques || []
  
  const jugadorIndex = jugadores.findIndex((jugador) => jugadorId === jugador.id)

  if (jugadorIndex >= 0) {
    jugadores[jugadorIndex].asignarAtaques(ataques)
  }


//obteniendo los ataques del jugador
app.get("/mokepon/:jugadorId/ataques", (req, res) => {
    const jugadorId = req.params.jugadorId || ""
    const jugador = jugadores.find((jugador) => jugador.id === jugadorId)
    res.send({
      ataques: jugador.ataques || []
    })
  })
  res.end()
})



//con esto iniciamos el servidor
app.listen(app.get('port'),() => {
  console.log("Servidor funcionando")
})
