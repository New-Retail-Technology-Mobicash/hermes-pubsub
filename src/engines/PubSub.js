/*eslint-disable*/

import { get_channels } from '../model/channels';
import { send_restful_to_subcriber } from '../services/restful-targets';
import _ from 'lodash';

const Subcriber = require('../queue/Subcriber');
const Publisher = require('../queue/Publisher');
const config = require('../config');

class PubSub {
  constructor() {
    this.all_pub = [];
    this.all_sub = [];
    this.all_channels = [];
  }
  async init() {
    this.all_channels = await get_channels();
    this.all_channels.forEach(ch => {
      console.log(ch);
      const { key, sub_endpoints } = ch;
      const url = config.channel_url;
      const channel_exchange = `${key}_exchange`;
      const channel_queue_name = `${key}_queue_name`;
      const channel_binding = `${key}_binding`;

      const pub = new Publisher(url, channel_exchange, channel_binding);
      this.all_pub.push({
        channel: key,
        pub
      });

      const sub = new Subcriber(
        url,
        channel_exchange,
        channel_queue_name,
        channel_binding,
        pub
      );
      sub.startChannel(this.send_to_dest(sub_endpoints));
      this.all_sub.push({
        channel: key,
        sub
      });
    });
  }

  channels() {
    return this.all_channels;
  }

  channel_by_key(key) {
    const sub_info = _.find(this.all_sub, i => i.a === key);
    return sub_info;
  }

  publish_message(channel_key, data) {
    const pub_info = _.find(this.all_pub, i => i.a === channel_key);
    const { pub } = pub_info;
    return pub.publishWithDelayTime(
      {
        from: data.from,
        repeat_times: 0,
        message_data: data.message_data
      },
      data.delay_time
    );
  }

  send_to_dest(orgin_dest) {
    return data => {
      const dest = data.failed_dest ? data.failed_dest : orgin_dest;
      console.log('72:dest:', dest);
      return new Promise((resolve, reject) => {
        console.log('75:coming:');
        return send_restful_to_subcriber(dest, data.message_data)
          .then(failed_dest => {
            console.log('ok_from_all::empty_failed:', failed_dest);
            if (failed_dest.length == 0) {
              resolve({
                success: true
              });
            } else {
              reject({
                err: 'cant_send_all',
                success: false,
                failed_dest
              });
            }
          })
          .catch(err => {
            console.log('err_from_all::', err);
            reject({
              err: 'cant_send',
              success: false,
              failed_dest: dest
            });
          });
      });
    };
  }
}
module.exports = PubSub;
