import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const configPath = path.join(__dirname, '../../config');
const configFile = fs.readFileSync(configPath, 'utf-8');
const newConfigFile = configFile.replace(/process\.env\.[a-z]+(_[a-z]+)?/g, (match) => {
  const envVariable = match.split('.')[2];
  return JSON.stringify(process.env[envVariable]);
});

fs.writeFileSync(configPath, newConfigFile, 'utf-8');
