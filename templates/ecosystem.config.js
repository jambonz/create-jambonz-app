module.exports = {
  apps : [{
    name: '{{ appName }}',
    script: 'app.js',
    instance_var: 'INSTANCE_ID',
    exec_mode: 'fork',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      LOGLEVEL: 'info',
      HTTP_PORT: 3000,
      JAMBONZ_ACCOUNT_SID: '',
      JAMBONZ_API_KEY: '',
      JAMBONZ_REST_API_BASE_URL: '',
      WEBHOOK_SECRET: '',
      HTTP_PASSWORD: '',
      HTTP_USERNAME: '',
{% if record %}
      WS_RECORD_PATH: '',
{% endif %}
    }
  }]
};
