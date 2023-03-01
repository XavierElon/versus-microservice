import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const configPath = path.join(__dirname, '../src/config/config.ts');
const configFile = fs.readFileSync(configPath, 'utf-8');
const newConfigFile = configFile.replace(/process\.env\.([A-Z_]+(_[A-Z_]+)*)/g, (match, p1) => {
  console.log('p1', p1);
  return `"${process.env[p1] || ''}"`;
});

console.log('new config file - > ', newConfigFile);
fs.writeFileSync(configPath, newConfigFile, 'utf-8');
console.log('new config file', newConfigFile);
