import express from 'express';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { Server } from 'socket.io';
import { channels, Channel } from './channel';

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*"
    }
}
);

const __dirname = dirname(fileURLToPath(import.meta.url));

app.use('/assets', express.static(join(__dirname, 'assets')));
app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'index.html'));
});
app.get('/favicon.ico', (req, res) => {
    res.sendFile(join(__dirname, 'favicon.ico'));
});


io.on('connection', (socket) => {
    console.log('a user connected');
    socket.once("join", (channel)=>{
        if (!channels[channel]){
            new Channel(channel);
        }
        channels[channel].addPlayer(socket);
        console.log("joined channel")
    })
});

server.listen(80, () => {
    console.log('server running at http://localhost:25555');
});