import { Consumer } from 'sqs-consumer';
import { EventEmitter2 } from 'eventemitter2';

const emitter = new EventEmitter2();

const configs = {
  shouldDeleteMessages: true,
  batchSize: 5,
  queueUrl:
    process.env.SQS_QUEUE_URL || 'https://sqs.us-east-1.amazonaws.com/990844713352/DemoFifoQueue.fifo',
  region: process.env.AWS_REGION || 'us-east-1',
};
console.log('configs:', JSON.stringify(configs));

if (!configs.queueUrl) throw Error('queueUrl is not set');

emitter.on('core.new-user-created', (event) => {
  console.log('user crated', JSON.stringify(event));
});

emitter.on('core.some-error', (event) => {
  console.log(JSON.stringify(event));
  throw Error('some error');
});

const handleMessageBatch = async (inputMessages: [any]) => {
  const all = inputMessages.map(async (message) => {
    // console.log("message:", JSON.stringify(message));
    const event = JSON.parse(message.Body);
    console.log('event:', JSON.stringify(event));
    return emitter.emitAsync(event.source, event);
  });
  await Promise.all(all);
};

const consumer = Consumer.create({ ...configs, handleMessageBatch });

consumer.on('error', (err) => {
  // event will be sent to DemoFifoQueue-deadletter.fifo
  console.error('error:', err.message);
});

consumer.on('processing_error', (err) => {
  console.error('processing_error:', err.message);
});

process.on('exit', () => {
  console.log('shutting down on exit');
});

process.on('SIGINT', () => {
  console.log('shutting down on SIGINT');
});

console.log('Consumer is starting..');
consumer.start();
console.log('Consumer is listening for the queue: 👍');
