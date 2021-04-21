const router = require('express').Router();
const WebhookResponse = require('@jambonz/node-client').WebhookResponse;

router.post('/', (req, res) => {
  const {logger} = req.app.locals;
  logger.debug({payload: req.body}, 'POST /record');
  try {
    const app = new WebhookResponse();
    app.pause({length: 1});
    app.say({
      text: 'Hi there.  Please leave a message, and we will get back to you shortly.',
      synthesizer: {
        vendor: 'google',
        language: 'en-US'
      }
    });
    app.listen({
      url:  process.env.WS_RECORD_URL
    });
    res.status(200).json(app);
  } catch (err) {
    logger.error({err}, 'Error');
    res.sendStatus(503);
  }
});

module.exports = router;
