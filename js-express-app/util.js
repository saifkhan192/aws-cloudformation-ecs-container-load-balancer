process.env.AWS_SDK_JS_SUPPRESS_MAINTENANCE_MODE_MESSAGE = '1'
const AWS = require('aws-sdk');
AWS.config.update({ region: process.env.AWS_DEFAULT_REGION || 'us-east-1' });

const ebevents = new AWS.EventBridge({ apiVersion: '2015-10-07' });

module.exports.sendEventToBus = async (eventName, detail) => {
    const params = {
        Entries: [
            {
                Source: eventName,
                Detail: JSON.stringify(detail),
                EventBusName: process.env.EVENT_BUS_NAME || "core-events-bus",
                DetailType: "core-custom.event",
            }
        ]
    };
    try {
        const data = await ebevents.putEvents(params).promise();
        console.log("Success: Event sent:", JSON.stringify(data));
    } catch (err) {
        console.log("Error:", err);
    }
};