import mqtt from 'mqtt';

export const inicializeMqtt = () => {
  const client = mqtt.connect('mqtt://localhost:1883');
  const topic = 'lora/data';
  
  client.subscribe(topic, (error) => {
    if (error) {
      console.error('Error subscribing to topic:', error);
    }
  });

  client.on('connect', () => {
    console.log('Connected to MQTT broker');
  });

  client.on('error', (error) => {
    console.error('MQTT error:', error);
  });

  return client;
}