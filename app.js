const express = require('express')
const cors = require('cors')
const fs = require('fs')
const bodyParser = require('body-parser')
const reader = require('xlsx')
const nodemailer = require('nodemailer');


const app = express()
const port = process.env.PORT || 3000

app.use(bodyParser.json())
app.use(cors())
app.use(express.static('Assets'))
app.use(express.static('Pages/css'))
app.use(express.static('Pages/js'))
app.use(express.static('Pages/'))
require('secrets')

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

app.post('/notify', (req, res) => {
    let result = true;

    let body = req.body;
    let content = `親愛的貴賓 ${body.keyinfo.name} 先生/小姐 您好\n您的訂購資訊如下:
    \n------------------\n`;

    let total = 0;

    body.data.map(item => {
        content += `${item.name} x${item.count} =  $${item.price * item.count}\n`;
        total += item.price * item.count
    })

    content += `------------------\n\n連絡電話: ${body.keyinfo.phone}\n`;
    content += `備註: ${body.keyinfo.notes}\n`;
    content += `------------------\n總計金額為 $${total}\n\n感謝您的訂購，稍後門市人員會致電聯絡付款事項\n多謝!\n\nOrderProject 團隊`;


    let sender = 'hungyeelin@gmail.com';

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.sender || sender,
            pass: process.env.pass
        }
    });

    const mailOptions = {
        from: process.env.sender || sender,
        to: body.keyinfo.email,
        subject: 'OrderProject訂購測試信件(此為系統信件請勿回復)',
        text: content
    };



    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.send(false)
        } else {
            return res.json(info)
        }
    });



})

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})

