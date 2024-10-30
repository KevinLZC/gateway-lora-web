import express from 'express';
import { getData, postData, deleteData, healthCheck } from '../controllers/data.controller.js';

const router = express.Router();

router.get('/getData', async (req, res) => {
  const data = await getData();
  res.status(200).json(data);
});

router.post('/postData', async (req, res) => {
  const result = await postData(req.body);
  res.status(201).json(result);
});

router.delete('/deleteData', async (req, res) => {
  const result = await deleteData();
  res.status(200).json(result);
});

router.get('/healthCheck', async (req, res) => {
  const healthCheckData = await healthCheck();
  res.status(200).json(healthCheckData);
});


export default router;