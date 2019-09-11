import dotenv from 'dotenv';

dotenv.load({ path: '.env' });
console.log('process.env', process.env);
module.exports = {
  get: process.env,
  channel_url: process.env.RABBITMQ_SERVERURL,
  delay_starttime: process.env.DELAY_TIME_TOSTART || 1000
};
