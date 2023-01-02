const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const app = express()
const port = 3000

app.use(bodyParser.json())
app.use(cors())

app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/Pages/index.html`)
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})