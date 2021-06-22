const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const { message } = require('./models')

async function messageHistory(){
    let messages = await message.findAll()
    messages =  JSON.parse(JSON.stringify(messages));
    io.emit('all chat', messages)
}

app.use('/style', express.static(__dirname + '/src/view/style'))
app.use('/js', express.static(__dirname + '/src/view/js'))

app.get('/', (req, res) => {
    res.sendFile(__dirname+'/src/view/index.html');
});

app.get('/data', (req, res) => {
    res.send({
        name: 'test',
        text: 'hai'
    });
});

let countUser = 0;
let interval;

io.on('connection', (socket) => {
    console.log('a user connected :', socket.id);
    countUser = countUser + 1;
    // await messageHistory()

    // if (interval) {
    //     clearInterval(interval)
    // }
    
    //   interval = setInterval(async () => {
    //     await messageHistory();
    //   }, 5000);

    socket.on('disconnect', () => {
        console.log('user disconnected');
        countUser = countUser - 1
        io.emit('count user', countUser);
    });

    socket.on('get chat', async (msg) => {
        await message.create(msg)
        messageHistory();
    });
    
    // io.emit('chat message', messageHistory());

    io.emit('count user', countUser);
    
    messageHistory();
});
  
server.listen(3000, () => {
    console.log('listening on *:3000');
});