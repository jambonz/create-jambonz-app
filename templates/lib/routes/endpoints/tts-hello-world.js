const router = require('express').Router();
const { WebhookResponse } = require('@jambonz/node-client');

{% if not enableEnv %}
const text = `<speak>
<prosody volume="loud">Hi there,</prosody> and welcome to jambones! 
jambones is the <sub alias="seapass">CPaaS</sub> designed with the needs
of communication service providers in mind.
This is an example of simple text-to-speech, but there is so much more you can do.
Try us out!
</speak>`;
{% endif %}

router.post('/', (req, res) => {
  const {logger} = req.app.locals;
  {% if enableEnv %}
  const {env_vars} = req.locals;
  {% endif %}

  logger.debug({payload: req.body}, 'POST /hello-world');
  try {
    const app = new WebhookResponse();
    app
      .pause({length: 1.5})
      {% if enableEnv %}
      .say({text: env_vars.text});
      {% else %}
      .say({text});
      {% endif %}
    res.status(200).json(app);
  } catch (err) {
    logger.error({err}, 'Error');
    res.sendStatus(503);
  }
});

{% if enableEnv %}
const path = require('path');
const { validateAppConfig, getAppConfig } = require('@jambonz/node-client');
const appJsonPath = path.join(__dirname, '../../../app.json');
const appJson = require(appJsonPath);

router.options('/', (req, res) => {
  const {logger} = req.app.locals;
  logger.info(`OPTIONS request received for path: ${req.baseUrl}`);

  // First validate the app.json using SDK's validation
  const validationResult = validateAppConfig(appJson);
  if (!validationResult.isValid) {
    logger.error({ errors: validationResult.errors }, 'app.json validation failed');
    return res.status(500).json({
      error: 'Invalid app.json configuration',
      details: validationResult.errors
    });
  }

  // Get the appropriate configuration using SDK's getAppConfig
  const result = getAppConfig({ urlPath: req.baseUrl, appJsonPath });
  if (!result.success) {
    logger.error(result.error);
    return res.status(500).json({ error: result.error });
  }

  logger.debug({ config: result.config }, 'Returning configuration');
  res.json(result.config);
});
{% endif %}

module.exports = router;
