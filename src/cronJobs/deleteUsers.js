#!/usr/bin/env node

const cron = require('node-cron');
const { deleteUnconfirmedUsers } = require('./services/user.service');

// Schedule the task to run every 6 hours
cron.schedule('0 */6 * * *', async () => {
  try {
    console.log('Running cron job...');
    await deleteUnconfirmedUsers();
    console.log('Cron job finished successfully!');
  } catch (error) {
    console.error('Cron job failed:', error);
  }
});
