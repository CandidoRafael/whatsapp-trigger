const { Boom } = require("@hapi/boom");
const { default: makeWASocket, useMultiFileAuthState, Browsers, DisconnectReason } = require("@whiskeysockets/baileys");
const { default: pino } = require("pino");

let sock;
async function connectToWhatsApp () {
    
    const { saveCreds, state } = await useMultiFileAuthState("auth_info_baileys")
     sock = makeWASocket({
        printQRInTerminal: true,
        qrTimeout: 15000,
        keepAliveIntervalMs: 10000,
        syncFullHistory: false,
        downloadHistory: false,
        logger: pino({ level: "silent" }),
        markOnlineOnConnect: true,
        version: [2, 2413, 1],
        browser: Browsers.ubuntu("Chrome"),
        auth: state,
        linkPreviewImageThumbnailWidth: 1280,
        generateHighQualityLinkPreview: true,
    });
    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update
        if(connection === 'close') {
            const shouldReconnect = (lastDisconnect.error = Boom)?.output?.statusCode !== DisconnectReason.loggedOut
            console.log('connection closed due to ', lastDisconnect.error, ', reconnecting ', shouldReconnect)
            // reconnect if not logged out
            
            if(shouldReconnect) {
                console.log('DEVE RECONECTAR')
                connectToWhatsApp()
            }

        } else if(connection === 'open') {
            console.log('opened connection')
        }
    })
    sock.ev.on("creds.update", saveCreds);
    sock.ev.on("messages.upsert", async ({ messages,type }) => {
        try {
            if(type === "notify") {
                if(!messages[0]?.key.fromMe) {
                    const captureMessage = messages[0]?.message?.conversation
                    const numberWa = messages[0]?.key?.remoteJid;
                   
                    if(captureMessage === "ping") {
                        await sock.sendMessage(
                            numberWa,
                            {
                                text: "Pong"
                            },
                           
                        )
                    }
                }
            }
        } catch (error) {
            console.log(error);
        }
    } )

    
    return sock;
}
async function sendWhatsAppMessage(phone = 0, message = "") {
    if (!sock) {
        await connectToWhatsApp();
    }
    await sock.sendMessage(`55${phone}@s.whatsapp.net`, { text: message });
}

module.exports = { sendWhatsAppMessage, connectToWhatsApp }