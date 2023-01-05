const express = require('express')
const cors = require('cors')
const fs = require('fs')
const bodyParser = require('body-parser')
const reader = require('xlsx')
const nodemailer = require('nodemailer');
require('secrets')


const app = express()
const port = process.env.PORT || 3000

app.use(bodyParser.json())
app.use(cors())
app.use(express.static('Assets'))
app.use(express.static('Pages/css'))
app.use(express.static('Pages/js'))
app.use(express.static('Pages/'))

app.get('/', (req, res) => {
    res.sendFile(`./Pages/index.html`)
})

app.get('/info/:type', (req, res) => {
    const file = reader.readFile('./DB.xlsx')
    let type = req.params.type === 'items' ? 0 : 1
    let data = []

    reader.utils.sheet_to_json(file.Sheets[file.SheetNames[type]]).map(item => data.push(item))
    res.json(data)
})

app.get('/notify', (req, res) => {
    const myEmail = 'hungyeelin@gmail.com';

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: myEmail,
            pass: process.env.pass
        }
    });

    const mailOptions = {
        from: myEmail,
        to: 'hungyeelin@gmail.com',
        subject: 'TestOrderProject',
        text: 'This message prove the gmail sending function is working'
    };

    transporter.sendMail(mailOptions, (error, info)=> {
        if (error) {
            console.log(error);
        }else{
            console.log(info)
        }
    });

    res.json('finish it!')
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})

