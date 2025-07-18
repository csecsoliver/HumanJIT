import express from 'express';
import { createServer } from 'node:https';
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

app.get('/', (req, res) => {
    //   res.sendFile(join(__dirname, 'index.html'));
    res.send("Go away");
    const _asd = res as Response;
    
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

server.listen(25555, () => {
    console.log('server running at http://localhost:25555');
});