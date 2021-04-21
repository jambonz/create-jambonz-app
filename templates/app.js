const assert = require('assert');
assert.ok(process.env.JAMBONZ_ACCOUNT_SID, 'You must define the JAMBONZ_ACCOUNT_SID env variable');
assert.ok(process.env.JAMBONZ_API_KEY, 'You must define the JAMBONZ_API_KEY env variable');
assert.ok(process.env.JAMBONZ_REST_API_BASE_URL, 'You must define the JAMBONZ_REST_API_BASE_URL env variable');
{% if record %}
assert.ok(process.env.process.env.WS_RECORD_PATH, 'You must define the WS_RECORD_PATH env variable');
{% endif %}

const express = require('express');
const app = express();
{% if record %}
const Websocket = require('ws');
{% endif %}
{% if auth %}
const {calculateResponse} = require('./lib/utils.js')(logger);
{% endif %}
const {WebhookResponse} = require('@jambonz/node-client');
const basicAuth = require('express-basic-auth');
const opts = Object.assign({
  timestamp: () => `, "time": "${new Date().toISOString()}"`,
  level: process.env.LOGLEVEL || 'info'
});
const logger = require('pino')(opts);
const port = process.env.HTTP_PORT || 3000;
const routes = require('./lib/routes');
app.locals = {
  ...app.locals,
  logger,
{% if auth %}
  calculateResponse,
{% endif %}
  client: require('@jambonz/node-client')(process.env.JAMBONZ_ACCOUNT_SID, process.env.JAMBONZ_API_KEY, {
    baseUrl: process.env.JAMBONZ_REST_API_BASE_URL
  })
};

{% if record %}
/* set up a websocket server to receive audio from the 'listen' verb */
const {recordAudio} = require('./lib/utils.js')(logger);
logger.info(`setting up record path at ${process.env.WS_RECORD_PATH}`);
const wsServer = new Websocket.Server({ noServer: true });
wsServer.setMaxListeners(0);
wsServer.on('connection', recordAudio.bind(null, logger));
{% endif %}
if (process.env.HTTP_USERNAME && process.env.HTTP_PASSWORD) {
  const users = {};
  users[process.env.HTTP_USERNAME] = process.env.HTTP_PASSWORD;
  app.use(basicAuth({users}));
}
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
if (process.env.WEBHOOK_SECRET) {
  app.use(WebhookResponse.verifyJambonzSignature(process.env.WEBHOOK_SECRET));
}
app.use('/', routes);
app.use((err, req, res, next) => {
  logger.error(err, 'burped error');
  res.status(err.status || 500).json({msg: err.message});
});

const server = app.listen(port, () => {
  logger.info(`Example jambonz app listening at http://localhost:${port}`);
});
{% if record %}
server.on('upgrade', (request, socket, head) => {
  wsServer.handleUpgrade(request, socket, head, (socket) => {
    if (request.url !== process.env.WS_RECORD_PATH) return socket.destroy();
    wsServer.emit('connection', socket, request);
  });
});
{% endif %}
