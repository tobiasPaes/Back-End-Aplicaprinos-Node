const express = require('express')
const router = express.Router()

/** conectando com o banco remoto */
const postgres = require('postgres');
require('dotenv').config();

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID } = process.env;
const URL = `postgres://${PGUSER}:${PGPASSWORD}@${PGHOST}/${PGDATABASE}?options=project%3D${ENDPOINT_ID}`;

const sql = postgres(URL, { ssl: 'require' });


router.get('/', async (req, res, next) => {
    const admin = await sql`select * from alimentacao`
    return res.status(200).send(admin)
})

router.get('/:id', async (req, res, next) => {
    const id = req.params.id
    const admin = await sql`select * from alimentacao where id = ${id}`
    return res.status(200).send(admin)
})

router.post('/', async (req, res, next) => {
    const { piquete, consumoconcentradodiario} = req.body
    const admin = await sql`insert into alimentacao(piquete, consumoConcentradoDiario) values (${piquete}, ${consumoconcentradodiario})`
    return res.status(201).send(admin)
})


router.put('/:id', async (req, res, next) => {
    const id = req.params.id
    const alimBanco = await sql`select * from alimentacao where id = ${id}`
    const alimBody = req.body

    if(alimBody.piquete !== null){
        alimBanco.piquete = alimBody.piquete
    }
    if(alimBody.consumoconcentradodiario !== null){
        alimBanco.consumoconcentradodiario = alimBody.consumoconcentradodiario
    }


    const alimAtual = await sql`update alimentacao set piquete = ${alimBanco.piquete}, consumoconcentradodiario = ${alimBanco.consumoconcentradodiario} where id = ${id}`

    return res.status(200).send(alimAtual)
})

router.delete('/:id', async (req, res, next) => {
    const id = req.params.id
    await sql`delete from alimentacao where id = ${id}`
    return res.status(200).send({
        mensagem: 'usuario removido com sucesso'
    })
})



module.exports = router
