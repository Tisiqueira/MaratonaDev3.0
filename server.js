//configurando  o servidor
const express = require("express")
const server = express()


//configure o servidor para apresentar arquivos estaticos
server.use(express.static('public'))

//habilitar body do formulario
server.use(express.urlencoded({extends:true}))

//configurar a conexão com o banco de dados
const Pool = require('pg').Pool
const db = new Pool({
    user: 'postgres',
    password: '12348',
    host: 'localhost',
    port: 5432,
    database: 'doe'
})

//configurando a template engine
const nunjucks = require("nunjucks")
const { query } = require("express")
nunjucks.configure("./", {
    express: server,
    noCache: true,
})




// configurar a apresentação da pagina
server.get("/", function(req, res){
 db.query("SELECT * FROM donors",function(err,result){
     if(err)return res.send("Erro no bando de dados.")

     const donors = result.rows
     return res.render("index.html",{donors})
 })



})
server.post("/", function(req, res){
    //Postar o formulario
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood

    if(name == "" || email == "" || blood == "") {
        return res.send("Todos os campos são obrigatorios")
    }

    //Add no meu banco de dados
    const query = `
     INSERT INTO donors ("name", "email", "blood") 
     VALUES ($1,$2,$3)`

     const values = [name,email,blood]

    db.query (query, values, function(err){
        if(err) return res.send("Erro no banco de dados.")

        return res.redirect("/")
    })

    
})


//ligar o serv e permitir o acesso a porta 3000
server.listen(3000, function(){
    console.log("Iniciei o servidor.")
})
