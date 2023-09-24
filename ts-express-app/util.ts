import { EventBridgeClient, PutEventsCommand } from '@aws-sdk/client-eventbridge';
export const ebClient = new EventBridgeClient({
  region: process.env.AWS_DEFAULT_REGION || 'us-east-1',
});

export const sendEventToBus = async (eventName: string, detail: any) => {
  const params = {
    Entries: [
      {
        Source: eventName,
        Detail: JSON.stringify(detail),
        EventBusName: process.env.EVENT_BUS_NAME || 'core-events-bus',
        DetailType: 'core-custom.event',
      },
    ],
  };
  try {
    const result = await ebClient.send(new PutEventsCommand(params));
    console.log('Success: Event sent:', JSON.stringify(result));
    return result;
  } catch (err) {
    console.log('Error:', err);
    return {};
  }
};
