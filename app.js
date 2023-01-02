const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const getData = require('./Tools/GetData.js')
const AddData = require('./Tools/AddData.js')
const Model = require('./Tools/Model.js') 

const app = express()
const port = 3000

app.use(bodyParser.json())
app.use(cors())

app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/Pages/index.html`)
})

app.get('/info/:type', async (req, res) => {
    let type = req.params.type;
    let data = await getData(type)

    res.json(data)
})

// app.get('/add/:type',async(req,res)=>{
//     let payload = Model.itemsModel;
//     payload.item = '綠茶';
//     payload.price = 50;
//     payload.in_stock = 150

//     await AddData(Model.typeItems,payload);
//     res.send('finish')
// })


app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})