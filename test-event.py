import json
import boto3
from datetime import datetime

client = boto3.client('events', region_name='us-east-1')


detail = {
    "name": "Saif",
    "email": "saif@test.com",
    "time": datetime.now().isoformat(),
}

put_response = client.put_events(
    Entries=[
        {
            'Source': 'core.new-user-created',
            'DetailType': 'UserCreated',
            'Detail': json.dumps(detail),
            'EventBusName': 'core-events-bus'
        }
    ]
)
print(put_response)


put_response = client.put_events(
    Entries=[
        {
            'Source': 'core.some-error', # will be sent to DemoFifoQueue-deadletter.fifo
            'DetailType': 'SomeError',
            'Detail': json.dumps(detail),
            'EventBusName': 'core-events-bus'
        }
    ]
)
print(put_response)
