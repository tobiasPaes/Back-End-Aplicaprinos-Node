const express = require('express')
// const sql = require('../App')
const router = express.Router()

/** conectando com o banco remoto */
const postgres = require('postgres');
require('dotenv').config();

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID } = process.env;
const URL = `postgres://${PGUSER}:${PGPASSWORD}@${PGHOST}/${PGDATABASE}?options=project%3D${ENDPOINT_ID}`;

const sql = postgres(URL, { ssl: 'require' });

async function getPgVersion() {
  const result = await sql`select version()`;
  console.log(result);
}

getPgVersion();



router.get('/', async (req, res, next) => {
    const caprinos = await sql`select * from caprino`
    console.log(caprinos)
    return res.status(200).send(caprinos)
})

router.get('/:id', async (req, res, next) => {
    const id = req.params.id
    const cap = await sql`select * from caprino where cod = ${id}`
    return res.status(200).send(cap)
})

router.post('/', async (req, res, next) => {
    const { cod, genero, idade } = req.body
    const cap = await sql`insert into caprino(cod, genero, idade) values (${cod}, ${genero}, ${idade})`
    return res.status(201).send('criado')
})


router.put('/:id', async (req, res, next) => {
    const id = req.params.id
    const capBanco = await sql`select * from caprino where cod = ${id}`
    const capBody = req.body

    if(capBody.genero !== null){
        capBanco.genero = capBody.genero
    }
    if(capBody.qnt_reproducao !== null){
        capBanco.qnt_reproducao = capBody.qnt_reproducao
    }
    if(capBody.idade !== null){
        capBanco.idade = capBody.idade
    }
    if(capBody.vacina !== null){
        capBanco.vacina = capBody.vacina
    }
    if(capBody.peso_atual !== null){
        capBanco.peso_atual = capBody.peso_atual
    }
    if(capBody.peso_novo !== null){
        capBanco.peso_novo = capBody.peso_novo
    }

    const capAtual = await sql`update caprino set genero = ${capBanco.genero}, qnt_reproducao = ${capBanco.qnt_reproducao}, idade = ${capBanco.idade}, vacina = ${capBanco.vacina}, peso_atual = ${capBanco.peso_atual}, peso_novo = ${capBanco.peso_novo} where cod = ${id}`

    return res.status(200).send(capAtual)
})

router.delete('/:id', async (req, res, next) => {
    const id = req.params.id
    await sql`delete from caprino where cod = ${id}`
    return res.status(200).send({
        mensagem: 'caprino removido com sucesso'
    })
})



module.exports = router
