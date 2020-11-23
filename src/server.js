const express = require("express")
const server = express()

//pegar o banco de dados

const db = require("./database/db")

//configurar pasta publica
server.use(express.static("public"))

//habilitar o uso do req.body na nossa aplicação
server.use(express.urlencoded({extended:true}))

//utilizando template engine
const nunjucks = require("nunjucks")
nunjucks.configure("src/views", {
    express: server,
    noCache: true
})
//Configurar caminhos da minha aplicação
//pagina inicial
//req: requisição
//res: resposta
server.get("/", (req, res) => {
    return res.render("index.html") //Pega o diretoria do arquivo

})

server.get("/create-point", (req, res) => {

    //req.query: query strings da nossa url
    //console.log(req.query)
    return res.render("create-point.html") //Pega o diretoria do arquivo

})

server.post("/savepoint", (req, res) => {

    //req.body: o corpo do nosso formulário
    //console.log(req.body)
    //inserir dados no banco de dados

    const query =`
        INSERT INTO places(
        image,
        name,
        address,
        address2,
        state,
        city,
        items

   ) VALUES (?,?,?,?,?,?,?);`

const values = [
    req.body.image,
    req.body.name,
    req.body.address,
    req.body.address2,
    req.body.state,
    req.body.city,
    req.body.items
]

   function afterInsertData(err){
       if(err){
           console.log(err)
           return res.send("Erro no cadastro!")
        }

        console.log("Cadastrado com sucesso")
        console.log(this) //Não se pode usar arrow function com o this

        return res.render("create-point.html", {saved: true}) 


    }



    db.run(query, values, afterInsertData)


})





server.get("/search-results", (req, res) => {
    //pegar os dados do banco de dados 
    

    const search = req.query.search

    if(search == ""){
            //Pesquisa vazia
        return res.render("search-results.html", {total: 0}) 


    }

    //pegar dados do BD
    db.all(`SELECT * FROM places WHERE city LIKE '%${search}%'`, function(err, rows){
          if(err){
             return console.log(err)
          }

          const total = rows.length

          //Mostrar a página html com os dados do BD
        return res.render("search-results.html", {places: rows, total}) //Pega o diretoria do arquivo
                                                                //se o objeto tem o mesmo nome da const, fica só total
      })



})

//ligar o sercidor
server.listen(3000)