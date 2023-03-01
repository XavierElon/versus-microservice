/*
When you run npm start, 
the import-env.js script will automatically import the environment 
variables into your configuration file before running your application code.

The replace method will find variables formatted with either one word like "PORT" or 
seperated by one underscore like "ENV_VARIABLE"
*/

import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const configPath = path.join(__dirname, '../src/config/config.ts');
const configFile = fs.readFileSync(configPath, 'utf-8');
const newConfigFile = configFile.replace(/process\.env\.[a-z]+(_[a-z]+)?/g, (match) => {
  const envVariable = match.split('.')[2];
  return JSON.stringify(process.env[envVariable]);
});

fs.writeFileSync(configPath, newConfigFile, 'utf-8');
