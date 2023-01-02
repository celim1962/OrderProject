const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const getData = require('./Tools/GetData.js')
const dbUrl = 'https://docs.google.com/spreadsheets/d/1ajLpcb7UdvDVmlTC1P5hJNbmAwPF7oqcnEqlZttfw50/edit?hl=zh-TW#gid=0';
const docID = dbUrl.split('/')[5]
const sheetID = dbUrl.split('/')[6].split('gid=')[1]

const app = express()
const port = 3000

app.use(bodyParser.json())
app.use(cors())

app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/Pages/index.html`)
})

app.get('/info/:term', async (req, res) => {
    let term = req.params.term;
    let data = await getData(docID, sheetID, term)
    
    res.json(data)
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})