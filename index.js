const express = require('express');
const { sendWhatsAppMessage, connectToWhatsApp } = require('./config/WhatsAppClient');


const app = express();
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
