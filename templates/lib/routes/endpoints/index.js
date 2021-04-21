const router = require('express').Router();

router.use('/call-status', require('./call-status'));
{% if tts %}
router.use('/hello-world', require('./tts-hello-world'));
{% endif %}
{% if dial %}
router.use('/dial-time', require('./dial-time'));
{% endif %}
{% if auth %}
router.use('/auth', require('./auth'));
{% endif %}
{% if record %}
router.use('/record', require('./record'));
{% endif %}

module.exports = router;
