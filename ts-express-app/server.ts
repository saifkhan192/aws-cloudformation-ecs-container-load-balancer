import { Request, Response } from 'express';
import express = require('express');
import { establishDatabaseConnection, createDatabaseConnection } from './db';
import { User } from './entity/user';
import { sendEventToBus } from './util';
import { testService1 } from './services';
// create and setup express app
const app = express();
app.use(express.json());

app.get('/', async (req: Request, res: Response) => {
  res.json({ welcome: true, host: process.env.HOSTNAME });
});

app.get('/health', async (req: Request, res: Response) => {
  res.json({ healthy: true, host: process.env.HOSTNAME });
});

app.get('/testService1', async (req: Request, res: Response) => {
  let url = req.query.url || 'http://localhost:3000/health';
  const resp = await testService1(url);
  res.json({ resp, host: process.env.HOSTNAME });
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
