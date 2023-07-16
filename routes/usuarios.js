const express = require('express')
const router = express.Router()

/** conectando com o banco remoto */
const postgres = require('postgres');
require('dotenv').config();

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID } = process.env;
const URL = `postgres://${PGUSER}:${PGPASSWORD}@${PGHOST}/${PGDATABASE}?options=project%3D${ENDPOINT_ID}`;

const sql = postgres(URL, { ssl: 'require' });


router.get('/', async (req, res, next) => {
    const users = await sql`select * from usuarios`
    return res.status(200).send(users)
})

router.get('/:id', async (req, res, next) => {
    const id = req.params.id
    const user = await sql`select * from usuarios where id = ${id}`
    return res.status(200).send(user)
})

router.post('/', async (req, res, next) => {
    const { login, senha, username } = req.body
    const user = await sql`insert into usuarios(login, senha, username) values (${login}, ${senha}, ${username})`
    return res.status(201).send('criado')
})


router.put('/:id', async (req, res, next) => {
    const id = req.params.id
    const userBanco = await sql`select * from usuarios where id = ${id}`
    const userBody = req.body

    if(userBody.login !== null){
        userBanco.login = userBody.login
    }
    if(userBody.senha !== null){
        userBanco.senha = userBody.senha
    }
    if(userBody.username !== null){
        userBanco.username = userBody.username
    }


    const userAtual = await sql`update usuarios set login = ${userBanco.login}, senha = ${userBanco.senha}, username = ${userBanco.username} where id = ${id}`

    return res.status(200).send(userAtual)
})

router.delete('/:id', async (req, res, next) => {
    const id = req.params.id
    await sql`delete from usuarios where id = ${id}`
    return res.status(200).send({
        mensagem: 'usuario removido com sucesso'
    })
})



module.exports = router
