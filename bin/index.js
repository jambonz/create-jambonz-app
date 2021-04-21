#!/usr/bin/env node

const nunjucks = require('nunjucks');
const { program } = require('commander');
const {spawn} = require('child_process');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const scenarios = [
  'tts',
  'dial',
  'record',
  'auth',
  'all'
];
const baseFiles = [
  'package.json',
  'app.js',
  'index.js',
  'call-status.js',
  '.eslintrc.json',
  '.eslintignore',
  '.gitignore',
  'README.md',
  'ecosystem.config.js'
];
const pluginFiles = {
  tts: ['tts-hello-world.js'],
  dial: ['dial-time.js'],
  record: ['record.js', 'utils.js'],
  auth: ['auth.js', 'utils.js', 'credentials.json']
};

const pkg = require(`${__dirname}/../package.json`);
program.version(pkg.version, '-v, --version', 'display the current version');
program
  .name('create-jambonz-app')
  .usage('[options] project-name')
  .addHelpText('after', `

Example:
  $ npx create-jambonz-app my-app`)
  .option('-s, --scenario <scenario>',
    'generates sample webhooks for specified scenarios, default is dial and tts', ['tts', 'dial']);

program.parse();
const opts = program.opts();
opts.scenario = (opts.scenario.split(',').map((s) => s.trim()) || []).map((r) => r.toLowerCase());
const extra = opts.scenario.filter((r) => !scenarios.includes(r));
const folder = extra.length ? extra[0] : (program.args.length ? program.args[0] : null);
const includeAll = opts.scenario.includes('all');
if (!folder) program.help();

const cwd = process.cwd();
const target = `${cwd}/${folder}`;

/* don't overwrite */
if (fs.existsSync(target)) {
  console.log(`folder ${folder} exists; please specify a new folder to create`);
  process.exit(0);
}

console.log();
console.log(`Creating a new jambonz app in ${chalk.green(target)}`);
console.log();

fs.mkdirSync(folder);
process.chdir(folder);

const appName = folder;

nunjucks.configure(`${__dirname}/../templates`, {
  lstripBlocks: true,
  trimBlocks: true
});

const shouldRender = (template) => {
  if (baseFiles.includes(template)) return true;
  const baseName = path.basename(template);
  for (const prop in pluginFiles) {
    if ((opts.scenario.includes(prop) || includeAll) &&
      pluginFiles[prop].includes(baseName)) return true;
  }
  return false;
};

const renderFolder = (folder, target) => {
  const entries = fs.readdirSync(folder, {withFileTypes: true});
  for (const entry of entries) {
    if (entry.isFile()) {
      if (shouldRender(entry.name)) {
        fs.writeFileSync(`${target}/${entry.name}`, nunjucks.render(`${folder}/${entry.name}`, {
          appName,
          tts: opts.scenario.includes('tts') || includeAll,
          dial: opts.scenario.includes('dial') || includeAll,
          auth: opts.scenario.includes('auth') || includeAll,
          record: opts.scenario.includes('record') || includeAll,
        }));
      }
    }
    else if (entry.isDirectory()) {
      fs.mkdirSync(`${target}/${entry.name}`);
      renderFolder(`${folder}/${entry.name}`, `${target}/${entry.name}`);
    }
  }
};

const spawnCommand = (cmd, args) => {
  return new Promise((resolve, reject) => {
    const child_process = spawn(cmd, args, {stdio: ['inherit', 'pipe', 'pipe']});

    child_process.on('exit', (code, signal) => {
      if (code === 0) {
        return resolve();
      }
      reject(code);
    });
    child_process.on('error', (error) => {
      console.log(`error spawning child process for docker: ${args}`);
    });

    child_process.stdout.on('data', (data) => {
      //console.log(data.toString());
    });
    child_process.stderr.on('data', (data) => {
      //console.log(data.toString());
    });
  });

};

(async() => {

  renderFolder(`${__dirname}/../templates`, process.cwd());

  const packages = ['@jambonz/node-client', 'pino', 'debug', 'express', 'express-basic-auth'];
  const devPackages = ['eslint-plugin-promise', 'eslint'];
  if (opts.scenario.includes('record') || includeAll) {
    Array.prototype.push.apply(packages, [
      'aws-sdk',
      's3-upload-stream']);
  }

  console.log('Installing packages...');
  await spawnCommand('npm',
    ['install', '--loglevel=error', '--save']
      .concat(packages));
  await spawnCommand('npm',
    ['install', '--loglevel=error', '--save-dev']
      .concat(devPackages));
})();
