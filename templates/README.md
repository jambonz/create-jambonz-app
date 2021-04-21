# {{ appName }}

This application was created with the [create jambonz command](https://www.npmjs.com/package/create-jambonz-app).  This documentation was generated at the time when the project was generated and describes the functionality that was initially scaffolded.  Of course, you should feel free to modify or replace this documentation as you build out your own logic.

## Endpoints

Based on the options that you have chosen, this application exposes the following HTTP endpoints:

{% if auth %}
### /auth
A simple example of authenticating sip devices.
{% endif %}

{% if dial %}
### /dial-time
Dials out through your carrier to a US-based [speaking time clock service](https://www.nist.gov/time-distribution/radio-station-wwv/telephone-time-day-service).
{% endif %}

{% if tts %}
### /hello-world
Answers incoming call and plays a greeting using text-speech
{% endif %}

{% if record %}
### /record
A websocket server that receives audio from a 'listen' verb and uploads into an AWS S3 bucket.
{% endif %}


