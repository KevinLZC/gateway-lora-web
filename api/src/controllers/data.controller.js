import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

export const postData = async (data) => {
  const { temperature, altitude, pressure, sended_at, received_at, saved_at } = data;

  console.log(data);

  await prisma.dataRecived.create({
    data: {
      temperature,
      altitude,
      sended_at,
      received_at,
      pressure,
      saved_at
    }
  });

  return "Data saved";
};

export const getData = async () => {
  return await prisma.dataRecived.findMany();
}

export const deleteData = async () => {
  await prisma.dataRecived.deleteMany();
  return "Data deleted";
}

export const healthCheck = async () => {
  const healthCheckData = {
    status: 'API is running',
    uptime: process.uptime(),
    memoryUsage: process.memoryUsage(),
    timestamp: new Date().toISOString(),
  };
  return healthCheckData;
};