import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server as SocketIOServer } from 'socket.io';
import data from './routes/data.route.js';
import { inicializeMqtt } from './services/mqtt.service.js';
import { postData } from './controllers/data.controller.js';

const app = express();

const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: "http://127.0.0.1:5500",
  }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
  origin: ["http://127.0.0.1:5500", "http://localhost:3000", "ws://localhost:3000"],
};
app.use(cors(corsOptions));

const clientmqtt = inicializeMqtt();

io.on('connection', (socket) => {
  console.log('New WebSocket client connected');

  socket.on('disconnect', () => {
    console.log('WebSocket client disconnected');
  });
});

clientmqtt.on('message', async (topic, message) => {
  const data = JSON.parse(message.toString());
  const sended_at = new Date(data.sended_at);
  const received_at = new Date(data.received_at);
  const dataExtendend = {
    ...data,
    sended_at,
    received_at,
    saved_at: new Date(),
  };
  await postData(dataExtendend);
  io.emit('data', dataExtendend);
});

app.use('/api', data);

server.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

const shutdownHandler = () => {
  console.log('Shutting down server...');
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
};

process.on('SIGINT', shutdownHandler);