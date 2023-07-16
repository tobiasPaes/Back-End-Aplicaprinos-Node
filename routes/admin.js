const express = require('express')
const router = express.Router()

/** conectando com o banco remoto */
const postgres = require('postgres');
require('dotenv').config();

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID } = process.env;
const URL = `postgres://${PGUSER}:${PGPASSWORD}@${PGHOST}/${PGDATABASE}?options=project%3D${ENDPOINT_ID}`;

const sql = postgres(URL, { ssl: 'require' });


router.get('/', async (req, res, next) => {
    const admin = await sql`select * from administrador`
    return res.status(200).send(admin)
})

router.get('/:id', async (req, res, next) => {
    const id = req.params.id
    const admin = await sql`select * from administrador where id = ${id}`
    return res.status(200).send(admin)
})

router.post('/', async (req, res, next) => {
    const { login, senha, username, adm} = req.body
    const admin = await sql`insert into administrador(login, senha, username, adm) values (${login}, ${senha}, ${username}, ${adm})`
    return res.status(201).send(admin)
})


router.put('/:id', async (req, res, next) => {
    const id = req.params.id
    const adminBanco = await sql`select * from administrador where id = ${id}`
    const adminBody = req.body

    if(adminBody.login !== null){
        adminBanco.login = adminBody.login
    }
    if(adminBody.senha !== null){
        adminBanco.senha = adminBody.senha
    }
    if(adminBody.username !== null){
        adminBanco.username = adminBody.username
    }


    const adminAtual = await sql`update administrador set login = ${adminBanco.login}, senha = ${adminBanco.senha}, username = ${adminBanco.username} where id = ${id}`

    return res.status(200).send(adminAtual)
})

router.delete('/:id', async (req, res, next) => {
    const id = req.params.id
    await sql`delete from administrador where id = ${id}`
    return res.status(200).send({
        mensagem: 'usuario removido com sucesso'
    })
})



module.exports = router
