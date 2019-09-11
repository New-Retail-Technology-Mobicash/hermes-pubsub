/* eslint-disable */
const Publisher = require('../queue/Publisher');

const pub = new Publisher('amqp://mobicash:mob_test@13.228.160.248', 'noti-new-promotion_exchange', 'noti-new-promotion_binding');
pub.publishWithDelayTime(
  {
    from: '123.1.1.1',
    repeat_times: 0,
    message_data: { test: 'ok4' }
  },
  3000
);