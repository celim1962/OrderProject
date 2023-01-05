const express = require('express')
const cors = require('cors')
const fs = require('fs')
const bodyParser = require('body-parser')
const reader = require('xlsx')


const app = express()
const port = process.env.PORT|| 3000

app.use(bodyParser.json())
app.use(cors())
app.use(express.static('Assets'))
app.use(express.static('Pages/css'))
app.use(express.static('Pages/js'))

app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/Pages/index.html`)
})

app.get('/info/:type', (req, res) => {
    const file = reader.readFile('./DB.xlsx')
    let type = req.params.type==='items'?0:1
    let data = []

    reader.utils.sheet_to_json(file.Sheets[file.SheetNames[type]]).map(item=>data.push(item))
    res.json(data)
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})

