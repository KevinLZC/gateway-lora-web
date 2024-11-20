import {PrismaClient} from '@prisma/client';

export const prisma = new PrismaClient();

export const postData = async (data) => {
  try {
    const {value, timestamp_sent_lora, timestamp_sent_mqtt, timestamp_saved_db, rssi} = data;

    if (!value || !timestamp_sent_mqtt || !timestamp_sent_mqtt || !timestamp_saved_db || !rssi) {
      throw new Error('Missing data');
    }

    await prisma.dataRecived.create({
      data: {
        value,
        timestamp_sent_lora,
        timestamp_sent_mqtt,
        timestamp_saved_db,
        rssi
      }
    });
    return {statusCode: 201, statusMessage: "success"};
  } catch (e) {
    console.error(e);
    return {statusCode: 400, statusMessage: "Failed"};
  }
};

export const getData = async () => {
  try {
    const data = await prisma.dataRecived.findMany({
      orderBy: {
        timestamp_saved_db: 'desc'
      },
    });
    return {statusCode: 200, statusMessage: data};
  } catch (e) {
    console.error(e);
    return {statusCode: 500, statusMessage: "Failed"};
  }
}

export const healthCheck = () => {
  return {
    status: 'API is running',
    uptime: process.uptime(),
    memoryUsage: process.memoryUsage(),
    timestamp: new Date().toISOString(),
  };
};