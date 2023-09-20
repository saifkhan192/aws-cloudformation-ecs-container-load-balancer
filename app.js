const express = require('express');
const app = express();
const { sendEventToBus } = require('./util.js');


// const ENV_VAR_ONE = process.env.ENV_VAR_ONE;

app.get('/', (req, res) => {
  console.log("route: /")
  res.json({
    NODE_VERSION: process.env.NODE_VERSION,
    HOSTNAME: process.env.HOSTNAME,
    VERSION: 1
  })
})

app.get('/sen-event-to-bus', async (req, res) => {
  await sendEventToBus('core.user-updated', { "name": "khan", "address": "123" });
  res.json({ success: true })
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`App listening at port: http://localhost:${PORT}`)
})