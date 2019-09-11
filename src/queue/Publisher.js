/** @format */

const amqp = require('amqplib/callback_api');

class Publisher {
  constructor(url, exchange, binding) {
    const self = this;
    this.url = url;
    this.exchange = exchange;
    this.binding = binding;

    // create channel to RabbitMQ-server
    this.rabbitMqChannel = new Promise((resolve, reject) => {
      amqp.connect(self.url, (err, conn) => {
        if (err) return reject(err);
        console.log(`connected pub to: ${self.url} :: ${self.exchange}`);
        return conn.createChannel((err_conn, ch) => {
          if (err_conn) return reject(err_conn);

          return resolve(ch);
        });
      });
    }).catch((reason) => {
      console.error(reason);
    });
  }

  publishWithDelayTime(args, duration) {
    return new Promise((resolve, reject) => {
      const headers = { 'x-delay': duration };
      this.rabbitMqChannel
        .then((ch) => {
          console.log(args);
          ch.publish(
            this.exchange,
            this.binding,
            Buffer.from(JSON.stringify(args)),
            { headers }
          );
          resolve({
            success: true
          });
        })
        .catch((err) => {
          console.log(err);
          const error = new Error(
            "SmsClient can't publish message right now due to error with rabbitMqChannel"
          );
          reject(error);
        });
    });
  }

  publish_again(args, duration) {
    // console.log(this);
    this.publishWithDelayTime(args, duration);
  }
  //   return this.publishWithDelayTime({message_data: data}, duration);
}

module.exports = Publisher;
