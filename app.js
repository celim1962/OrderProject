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
    let total = 0;
    let body = req.body;

    let content = `親愛的貴賓 ${body.keyinfo.name} 先生/小姐 您好\n`;
    content += `您的訂購資訊如下:\n`;
    content += `------------------\n`;

    body.data.map(item => {
        content += `${item.name} x${item.count} =  $${item.price * item.count}\n`;
        total += item.price * item.count
    })

    if(total<5000){
        content += '運費: $290\n';
        total = total+290;
    }

    content += `\n總計金額為 $${total}\n`;
    content += `------------------\n`;
    content += `匯款資訊:\n`;
    content += ` 代號:700\n`;
    content += ` 存簿帳號:0111000 1048835\n\n`;
    content += `連絡電話: ${body.keyinfo.phone}\n`;
    content += `寄送地址: ${body.keyinfo.address}\n`;
    content += `備註: ${body.keyinfo.notes}\n`;
    content += `------------------\n`;
    content += `感謝您的訂購，請參照上述匯款資訊，門市會在確認匯款成功後透過宅配發貨\n`;
    content += `多謝!\n\n`;
    content += `喜福宅鮮 團隊`;

    let sender = 'amazingfood7777@gmail.com';//'hungyeelin@gmail.com';

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
        subject: '喜福宅鮮 訂購信件(測試用)',
        text: content
    };



    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error)
        } 
    });

    // const mailOptions2 = {
    //     from: process.env.sender || sender,
    //     to: process.env.sender || sender,
    //     subject: '喜福宅鮮 訂購信件(測試用)',
    //     text: content
    // };

    // transporter.sendMail(mailOptions2, (error, info) => {
    //     if (error) {
    //         console.log(error)
    //     } 
    // });

    return res.json('finish')



})

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})

