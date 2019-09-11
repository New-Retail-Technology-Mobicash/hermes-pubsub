const amqp = require('amqplib/callback_api');
// const Publisher = require('./Publisher');

const REPEAT_TIME_1 = 5000; // 5s
const REPEAT_TIME_2 = 1000 * 60; // 1m
const REPEAT_TIME_3 = 10000 * 60 * 5; // 5m
const REPEAT_TIME_4 = 10000 * 60 * 10; // 10m
const REPEAT_TIME_5 = 10000 * 60 * 30; // 30m

class Subcriber {
  constructor(
    channel_url,
    channel_exchange,
    channel_queue_name,
    channel_binding,
    publisher
  ) {
    this.channel_url = channel_url;
    this.channel_exchange = channel_exchange;
    this.channel_queue_name = channel_queue_name;
    this.channel_binding = channel_binding;
    this.publisher = publisher;
    const self = this;
    // create channel to RabbitMQ-server
    this.rabbitmq_channel = new Promise((resolve, reject) => {
      amqp.connect(this.channel_url, (err, conn) => {
        if (err) {
          return reject(err);
        }
        console.log(
          `connected sub to: ${self.channel_url} :: ${self.channel_exchange}`
        );
        return conn.createChannel((err_conn, ch) => {
          if (err_conn) return reject(err_conn);
          ch.assertExchange(self.channel_exchange, 'x-delayed-message', {
            autoDelete: false,
            durable: true,
            passive: true,
            arguments: { 'x-delayed-type': 'direct' }
          });
          ch.assertQueue(self.channel_queue_name, { durable: true });
          ch.bindQueue(
            self.channel_queue_name,
            self.channel_exchange,
            self.channel_binding
          );

          ch.prefetch(1);
          return resolve(ch);
        });
      });
    }).catch((reason) => {
      console.error({ err: reason }, 'Error catched at Subcriber.js');
    });
  }

  startChannel(action) {
    this.rabbitmq_channel
      .then((res) => {
        console.info(
          'Subcriber started. Waiting for messages in %s.',
          this.channel_queue_name
        );
        const channel_instance = this;
        res.consume(
          this.channel_queue_name,
          (msg) => {
            console.log(' [x] Received %s', msg.content.toString());
            const data = JSON.parse(msg.content.toString());
            const { repeat_times } = data;
            return action(data)
              .then((result) => {
                console.log('result_from_action:', result);
                res.ack(msg);
              })
              .catch((err) => {
                if (repeat_times == 0) {
                  console.log('[REPEAT]err_from_action_time_1:', err);
                  data.repeat_times = repeat_times + 1;
                  data.failed_dest = err.failed_dest;
                  channel_instance.re_push(data, REPEAT_TIME_1);
                } else if (repeat_times == 1) {
                  console.log('[REPEAT]err_from_action_time_2:', err);
                  data.repeat_times = repeat_times + 1;
                  data.failed_dest = err.failed_dest;
                  channel_instance.re_push(data, REPEAT_TIME_2);
                } else if (repeat_times == 2) {
                  console.log('[REPEAT]err_from_action_time_3:', err);
                  data.repeat_times = repeat_times + 1;
                  data.failed_dest = err.failed_dest;
                  channel_instance.re_push(data, REPEAT_TIME_3);
                } else if (repeat_times == 3) {
                  console.log('[REPEAT]err_from_action_time_4:', err);
                  data.repeat_times = repeat_times + 1;
                  data.failed_dest = err.failed_dest;
                  channel_instance.re_push(data, REPEAT_TIME_4);
                } else if (repeat_times == 4) {
                  console.log('[REPEAT]err_from_action_time_5:', err);
                  data.repeat_times = repeat_times + 1;
                  data.failed_dest = err.failed_dest;
                  channel_instance.re_push(data, REPEAT_TIME_5);
                } else {
                  console.log('[REPEAT]err_from_action_removed:', err);
                }
                res.ack(msg);
              });
          },
          { noAck: false }
        );
      })
      .catch(() => {
        const err = new Error(
          "Can't start Subcriber right now due to error with RabbitMQ-server"
        );
        console.error({ err }, 'Error catched at Subcriber.js');
      });
  }

  re_push(args, duration) {
    // console.log('888||this.publisher',this.publisher);
    this.publisher.publish_again(args, duration);
  }
}

module.exports = Subcriber;
