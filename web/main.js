import { io } from "./socket/socket.io.esm.min.js";

const socket = io("http://localhost:3000");
const statusEl = document.getElementById('status');
const messageList = document.getElementById('message-list');

function formatTimeDifference(ms) {
  const seconds = Math.floor(ms / 1000);
  const milliseconds = ms % 1000;
  return `${seconds} sec ${milliseconds} ms`;
}

function formatDateTime(timestamp) {
  const date = new Date(timestamp);
  const dateString = date.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
  const timeString = date.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });
  const milliseconds = date.getMilliseconds(); // Obtener los milisegundos
  return `${dateString} ${timeString}.${milliseconds.toString().padStart(3, '0')}`;
}

function createMessageElement(message) {
  const sentToReceivedDiff = formatTimeDifference(new Date(message.timestamp_sent_mqtt) - new Date(message.timestamp_sent_lora));
  const receivedToSavedDiff = formatTimeDifference(new Date(message.timestamp_saved_db) - new Date(message.timestamp_sent_mqtt));
  const totalTime = formatTimeDifference(new Date(message.timestamp_saved_db) - new Date(message.timestamp_sent_lora));

  const messageRow = document.createElement('tr');
  messageRow.innerHTML = `
      <td>${message.value}</td>
      <td>${formatDateTime(message.timestamp_sent_lora)}</td>
      <td>${formatDateTime(message.timestamp_sent_mqtt)}</td>
      <td>${formatDateTime(message.timestamp_saved_db)}</td>
      <td>${message.rssi}</td>
      <td>${sentToReceivedDiff}</td>
      <td>${receivedToSavedDiff}</td>
      <td>${totalTime}</td>
    `;
  return messageRow;
}

fetch('http://localhost:3000/api/getData')
    .then(response => response.json())
    .then(data => {
      data.map(message => {
        const messageRow = createMessageElement(message);
        messageList.appendChild(messageRow);
      });
    });

socket.on('connect', () => {
  statusEl.textContent = 'Connected';
  statusEl.classList.remove('text-danger');
  statusEl.classList.add('text-success');
});

socket.on('disconnect', () => {
  statusEl.textContent = 'Disconnected';
  statusEl.classList.remove('text-success');
  statusEl.classList.add('text-danger');
});

socket.on('data', (data) => {
  const messageRow = createMessageElement(data);
  messageList.prepend(messageRow);
});

socket.on('mqtt_error', (error) => {
  const errorRow = document.createElement('tr');
  errorRow.classList.add('table-danger');
  errorRow.innerHTML = `<td colspan="7">Error: ${error.error}</td>`;
  messageList.prepend(errorRow);
});