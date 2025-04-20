{% if record %}
var AWS      = require('aws-sdk') ;
var S3Stream = require('s3-upload-stream');
const Websocket = require('ws');
{% endif %}
{% if auth %}
const crypto = require('crypto');
{% endif %}

module.exports = (logger) => {
{% if auth %}
  const calculateResponse = ({username, realm, method, nonce, uri, nc, cnonce, qop}, password) => {
    const ha1 = crypto.createHash('md5');
    ha1.update([username, realm, password].join(':'));
    const ha2 = crypto.createHash('md5');
    ha2.update([method, uri].join(':'));

    // Generate response hash
    const response = crypto.createHash('md5');
    const responseParams = [
      ha1.digest('hex'),
      nonce
    ];

    if (cnonce) {
      responseParams.push(nc);
      responseParams.push(cnonce);
    }

    if (qop) {
      responseParams.push(qop);
    }
    responseParams.push(ha2.digest('hex'));
    response.update(responseParams.join(':'));

    return response.digest('hex');
  };
{% endif %}
{% if record %}
  const recordAudio = async(logger, socket) => {
    socket.on('message', function(data) {
      /* first message is a JSON object containing metadata about the call */
      try {
        socket.removeAllListeners('message');
        const metadata = JSON.parse(data);
        logger.info({metadata}, 'received metadata');
        const {callSid, accountSid, applicationSid, from, to, callId} = metadata;
        let md = {
          callSid,
          accountSid,
          applicationSid,
          from,
          to,
          callId
        };
        if (metadata.parent_call_sid) md = {...md, parent_call_sid: metadata.parent_call_sid};
        const s3Stream = new S3Stream(new AWS.S3());
        const upload = s3Stream.upload({
          Bucket: process.env.RECORD_BUCKET,
          Key: `${metadata.callSid}.L16`,
          ACL: 'public-read',
          ContentType: `audio/L16;rate=${metadata.sampleRate};channels=${metadata.mixType === 'stereo' ? 2 : 1}`,
          Metadata: md
        });
        upload.on('error', function(err) {
          logger.error({err}, `Error uploading audio to ${process.env.RECORD_BUCKET}`);
        });
        const duplex = Websocket.createWebSocketStream(socket);
        duplex.pipe(upload);
      } catch (err) {
        logger.error({err}, `Error starting upload to bucket ${process.env.RECORD_BUCKET}`);
      }
    });
    socket.on('error', function(err) {
      logger.error({err}, 'recordAudio: error');
    });
  };
{% endif %}
{% if enableEnv %}
  /**
   * Middleware function to process environment properties from request body
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  const processEnvProperty = (req, res, next) => {
    req.locals = req.locals || {};
    if (req.method === 'POST' && req.body && req.body.env) {
      req.locals.env = req.body.env;
      delete req.body.env;
    }
    else req.locals.env = {};
    next();
  };
{% endif %}
  return {
{% if record %}
    recordAudio,
{% endif %}
{% if auth %}
    calculateResponse,
{% endif %}
{% if enableEnv %}
    processEnvProperty
{% endif %}
  };
};
