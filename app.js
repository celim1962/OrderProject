// DB url:https://docs.google.com/spreadsheets/d/1ajLpcb7UdvDVmlTC1P5hJNbmAwPF7oqcnEqlZttfw50/edit?hl=zh-TW#gid=0
const express = require('express')
const cors = require('cors')
const fs = require('fs')
const bodyParser = require('body-parser')

const getData = require('./Tools/GetData.js')
const AddData = require('./Tools/AddData.js')
const DeleteData = require('./Tools/DeleteData.js')
const Model = require('./Tools/Model.js')

const app = express()
const port = 3000

app.use(bodyParser.json())
app.use(cors())
app.use(express.static('Assets'))
app.use(express.static('Pages/css'))
app.use(express.static('Pages/js'))

app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/Pages/index.html`)
})



app.get('/info/:type', async (req, res) => {
    let type = req.params.type;
    let data = await getData(type)

    res.json(data)
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})

