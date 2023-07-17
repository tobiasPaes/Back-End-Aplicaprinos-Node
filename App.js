const express = require('express') // importando o express
const app = express() // instanciando o express
const morgan = require('morgan') // importando o morgan
const bodyParser = require('body-parser') // importando o body-parser

/** conectando com o banco remoto */
// const postgres = require('postgres');
// require('dotenv').config();

// const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID } = process.env;
// const URL = `postgres://${PGUSER}:${PGPASSWORD}@${PGHOST}/${PGDATABASE}?options=project%3D${ENDPOINT_ID}`;

// const sql = postgres(URL, { ssl: 'require' });

// async function getPgVersion() {
//   const result = await sql`select version()`;
//   console.log(result);
// }

// getPgVersion();


const rotaCaprinos = require('./routes/caprinos') // importando a rota("controller")
const rotaUsuarios = require('./routes/usuarios')
const rotaAdim = require('./routes/admin')
const rotaAlimentacao = require('./routes/alimentacao')

app.use(morgan('dev')) // mostra as requisicoes no terminal
app.use(bodyParser.urlencoded({ extended: false })) // permite apenas dados simples
app.use(bodyParser.json()) // formato json no body

/** configuracao de CORS */
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header(
        'Access-Controll-Allow-Header',
        'Content-Type, Origin, X-Requested-With, Accept, Authorization')
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, GET, DELETE')
        return res.status(200).send({})
    }

    next()
})

app.use('/caprinos', rotaCaprinos) // chamando o caminho quando ele for requisitado
app.use('/usuarios', rotaUsuarios)
app.use('/admin', rotaAdim)
app.use('/alimentacao', rotaAlimentacao)

// app.get('/', async (req, res, next) => {
//     console.log('ta aq')
//     const caprinos = await sql`select * from caprino`
//     console.log(caprinos)
//     res.status(200).send({
//         mensagem: 'usando o get'
//     })
// })

/** tratando requisicoes erradas */
app.use((req, res, next) => {
    const err = new Error('Pagina nao encontrada')
    res.status(404)
    next(err)
})

/** terminando o tratamento dos erros de requisicao */
app.use((err, req, res, next) => {
    res.status(err.status || 500)
    return res.send({
        erro:{
            mensagem: err.message
        }
    })
})


module.exports = app // exportando
