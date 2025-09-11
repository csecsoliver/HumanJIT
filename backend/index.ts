import express from 'express';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { Server } from 'socket.io';
import { channels, Channel } from './channel';

const PORT = process.env.PORT || 3000;

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.CORS_ORIGIN || "http://localhost:5173"
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
    socket.once("join", (channel) => {
        // Validate channel name
        if (typeof channel !== 'string' || channel.length === 0 || channel.length > 50) {
            socket.emit('error', 'Invalid channel name');
            return;
        }
        
        // Sanitize channel name
        const sanitizedChannel = channel.replace(/[^a-zA-Z0-9_-]/g, '');
        if (sanitizedChannel !== channel) {
            socket.emit('error', 'Channel name contains invalid characters');
            return;
        }
        
        if (!channels[sanitizedChannel]) {
            new Channel(sanitizedChannel);
        }
        
        try {
            channels[sanitizedChannel].addPlayer(socket);
            console.log("joined channel");
        } catch (error) {
            socket.emit('error', error instanceof Error ? error.message : 'Failed to join channel');
        }
    })
});

server.listen(PORT, () => {
    console.log(`server running at http://localhost:${PORT}`);
});