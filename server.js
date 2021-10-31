`use strict`

const http=require(`http`).createServer(servidor)
    fs=require(`fs`),
    io=require(`socket.io`)(http),
    port=3000,
    conexiones=0

function servidor(req,res){
    fs.readFile(`index.html`,(err,data)=>{
        if(err){
            res.statusCode=500
            res.setHeader(`Content-type`,`text/html`)
            return res.end(`<h1>Error interno de servidor</h1>`)
        }

        res.statusCode=200
        res.setHeader(`Content-type`,`text/html`)
        return res.end(data,`utf-8`)
    })
}

io.on(`connection`,(socket)=>{
    socket.emit(`mi_mensaje`,{mensaje: `Hola mundo con Socket.IO`})
    socket.on(`mensaje_front`,(data)=>console.log(data))
    conexiones++
    console.log(`clientes conectados: ${conexiones}`)
    socket.emit(`usuarios_activos`,{usuarios:conexiones})
    socket.broadcast.emit(`usuarios_activos`,{usuarios:conexiones})
    socket.on(`disconnect`,()=>{
        conexiones--
        console.log(`clientes conectados: ${conexiones}`)
        socket.broadcast.emit(`usuarios_activos`,{usuarios:conexiones})
    })
})

http.listen(port,()=>{
    console.log(`Servidor corriendo en http://127.0.0.1:${port}`)
})
