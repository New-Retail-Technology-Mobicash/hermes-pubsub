import { _try } from '../lib/utils';

const db_channels = require('../model/channels');

module.exports = async (fastify) => {
  fastify.post('/pub', async (req, reply) => {
    console.log('CALLER_INSIDE:', req.body);
    // channel:
    // delay_time:
    // messages_data:
    const data = req.body;
    let channel;
    if (
      req.context.pub_sub_engine.channels() &&
      Array.isArray(req.context.pub_sub_engine.channels()) &&
      req.context.pub_sub_engine.channels().length > 0
    ) {
      channel = req.context.pub_sub_engine.channel_by_key();
    } else {
      channel = await db_channels.get_channel(data.channel);
      // TODO : check channel.publisher_ips & req.headers.x-ip
    }

    if (!channel) {
      return reply.code(200).send({
        meta: {
          ok: false,
          why: 'wrong channel'
        }
      });
    }

    const pub_data = {
      from: req.headers['x-ip'] || '127.0.0.1',
      repeat_times: 0,
      message_data: data.message_data,
      delay_time: data.delay_time || 0
    };

    const [err, result] = await _try(
      req.context.pub_sub_engine.publish_message(channel.key, pub_data)
    );
    console.log('444***:', result, err);
    if (result && result.success) {
      return reply.code(200).send({
        meta: {
          ok: true
        }
      });
    }

    return reply.code(200).send({
      meta: {
        ok: false,
        why: 'cant pub'
      }
    });
  });
};
