# create-jambonz-app 

Usage: npx create-jambonz-app [options] project-name
```
Options:
  -h, --help                        display help for command
  -s, --scenario <scenarios..>      list the scenarios you want to implement or 'all' (default: ["tts", "dial"])
  -v, --version                     display the current version
```

The following scenarios are available:
- auth: an example device registration webhook
- dial: an example dial verb
- record: an example websocket server that receives real-time audio from a 'listen' command 
- tts: an example tts verb

**Example**: 

```bash
  $ npx create-jambonz-app --scenarios 'dial, auth, tts' my-app

Creating a new jambonz app in /Users/perpich/test/my-app
Installing packages...
```
After that, edit the my-app/ecosystem.config.js file to set necessary environment variables for the webhooks and then start your app

```bash
cd my-app
edit ecosystem.config.js
node app.js
```sx

