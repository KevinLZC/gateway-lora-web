import express from 'express';
import http from 'http';
import cors from 'cors';
import {Server as SocketIOServer} from 'socket.io';
import data from './routes/data.route.js';
import {inicializeMqtt} from './services/mqtt.service.js';
import {postData} from './controllers/data.controller.js';

const app = express();

const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: "http://localhost:63342 ",
  }
});

app.use(express.json());
app.use(express.urlencoded({extended: true}));

const corsOptions = {
  origin: ["http://localhost:63342", "http://localhost:3000", "ws://localhost:3000"],
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
  console.log(data);
  const extendedData = {
    ...data,
    timestamp_saved_db: new Date().toISOString(),
  }
  await postData(extendedData);
  io.emit('data', extendedData);
});

app.use('/api', data);

const serverInstance = app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

const shutdownHandler = () => {
  console.log('Shutting down server...');
  serverInstance.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });

  // Si el servidor no se cierra después de un tiempo, forzar la salida
  setTimeout(() => {
    console.error('Forcing server shutdown...');
    process.exit(1);
  }, 5000); // Espera 5 segundos antes de forzar el cierre
};

// Maneja señales para apagado limpio
process.on('SIGINT', shutdownHandler);
process.on('SIGTERM', shutdownHandler);

// Opcional: Maneja errores no capturados
process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
  shutdownHandler();
});