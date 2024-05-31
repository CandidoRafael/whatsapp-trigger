const express = require('express');
const { sendWhatsAppMessage, connectToWhatsApp } = require('./config/WhatsAppClient');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json())

app.get('/', (req, res) => {
    res.send("Hello to my API");
})

// const number = "Here is a phone number"

// setTimeout(async () => {
//    await sendWhatsAppMessage(number, "Esse teste funcionou") 
// }, 1000 * 60 * 5);

app.listen(3001, () => {
    console.log('Server is Running PORT: ', 3001);
    connectToWhatsApp();
})
