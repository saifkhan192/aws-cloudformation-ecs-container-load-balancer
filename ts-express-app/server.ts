import { Request, Response } from 'express';
import express = require('express');
import { establishDatabaseConnection, createDatabaseConnection } from './db';
import { User } from './entity/user';
import { sendEventToBus } from './util';
import { callService } from './services';

const app = express();
app.use(express.json());

app.get('/', async (req: Request, res: Response) => {
  res.json({ welcome: true, host: process.env.HOSTNAME, SERVICE_NAME: process.env.SERVICE_NAME });
});

app.get('/health', async (req: Request, res: Response) => {
  res.json({ healthy: true, host: process.env.HOSTNAME, SERVICE_NAME: process.env.SERVICE_NAME });
});

// test-communication
app.get('/test', async (req: Request, res: Response) => {
  let getCustomResponse = Promise.resolve({ status: 0, data: null });
  if (req.query.customUrl) {
    getCustomResponse = callService(req.query.customUrl);
  }

  const [customResponse, bffResponse, coreResponse] = await Promise.allSettled([
    getCustomResponse,
    await callService(process.env.URL_API_BFF),
    await callService(process.env.URL_API_CORE),
  ]);

  res.json({
    host: process.env.HOSTNAME,
    SERVICE_NAME: process.env.SERVICE_NAME,

    URL_API_BFF: process.env.URL_API_BFF,
    URL_API_CORE: process.env.URL_API_CORE,

    customResponse,
    bffResponse,
    coreResponse,
  });
});

app.get('/send-event', async (req: Request, res: Response) => {
  const result = await sendEventToBus('core.user-updated', { name: 'khan', address: '123' });
  res.json({ sent: true, result, host: process.env.HOSTNAME });
});

// register routes
app.get('/users-create', async (req: Request, res: Response) => {
  const userRepository = (await createDatabaseConnection()).getRepository(User);
  // const entityManager = userRepository.create()
  const user1 = new User();
  user1.username = 'asd';
  user1.password = 'pass1234';
  user1.email = 'email@test2.com';
  await userRepository.save(user1);
  res.send({ userSaved: true, host: process.env.HOSTNAME });
});

app.get('/users', async (req: Request, res: Response) => {
  const userRepository = (await createDatabaseConnection()).getRepository(User);
  const users = await userRepository.findBy({});
  res.json({ users, host: process.env.HOSTNAME });
});

const initExpressGraphql = async () => {
  const PORT = process.env.PORT || 3000;
  app.listen({ port: PORT }, () => {
    console.log(`🚀 Server running at http://localhost:${PORT} host:`, process.env.HOSTNAME);
  });
};

const bootstrap = async (): Promise<void> => {
  await establishDatabaseConnection();
  initExpressGraphql();
};

bootstrap();
