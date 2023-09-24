const { Consumer } = require("sqs-consumer");
// const EventEmitter = require('events');
const EventEmitter2 = require("eventemitter2");

// const emitter = new EventEmitter();
const emitter = new EventEmitter2();

// load env file ./src/.env.development
if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test") {
    // require("../config/index");
}

// For refference: https://github.com/bbc/sqs-consumer
// https://github.com/EventEmitter2/EventEmitter2

// TODO: https://github.com/alexandregama/python-sqs-consumer/blob/master/sqs-message-consumer.py

const configs = {
    shouldDeleteMessages: true,
    batchSize: 5,
    queueUrl: process.env.SQS_QUEUE_URL || 'https://sqs.us-east-1.amazonaws.com/990844713352/DemoFifoQueue.fifo',
    region: process.env.AWS_REGION || 'us-east-1',
};
console.log('configs:', JSON.stringify(configs));

if (!configs.queueUrl) throw Error("queueUrl is not set");

emitter.on("core.new-user-created", (event) => {
    console.log("user crated", JSON.stringify(event));
});

emitter.on("core.some-error", (event) => {
    throw Error("some error", JSON.stringify(event))
});


const handleMessageBatch = async (inputMessages) => {
    const all = inputMessages.map(async (message) => {
        // console.log("message:", JSON.stringify(message));
        const event = JSON.parse(message.Body);
        console.log("event:", JSON.stringify(event));
        return emitter.emitAsync(event.source, event);
    });
    await Promise.all(all);
};

const app = Consumer.create({
    ...configs,
    handleMessageBatch,
});

app.on("error", (err) => {
    // event will be sent to DemoFifoQueue-deadletter.fifo
    console.error('error:', err.message);
});

app.on("processing_error", (err) => {
    console.error('processing_error:', err.message);
});

console.log("Consumer is starting...");
app.start();
console.log("Consumer is started 👍");