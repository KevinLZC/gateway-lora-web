import express from 'express';
import { getData, postData, healthCheck } from '../controllers/data.controller.js';

const router = express.Router();

router.get('/getData', async (req, res) => {
  const {statusCode, statusMessage} = await getData();
  res.status(statusCode).json(statusMessage);
});

router.post('/postData', async (req, res) => {
  const {statusCode, statusMessage} = await postData(req.body);
  res.status(statusCode).json(statusMessage);
});

router.get('/healthCheck', async (req, res) => {
  const healthCheckData = await healthCheck();
  res.status(200).json(healthCheckData);
});


export default router;