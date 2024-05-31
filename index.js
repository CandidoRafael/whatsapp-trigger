const express = require('express');
const { sendWhatsAppMessage, connectToWhatsApp } = require('./config/WhatsAppClient');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json())

app.get('/', (req, res) => {
    res.send("Hello to my API");
})

setTimeout(async () => {
   await sendWhatsAppMessage(6291752626, "Esse teste funcionou") 
}, 1000 * 60);

app.listen(3001, () => {
    console.log('Servidor Rodando PORTA: ', 3001);
    connectToWhatsApp();
})
