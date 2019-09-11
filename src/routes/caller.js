const channels = require('../model/channels');

module.exports = async (fastify) => {
  fastify.post('/inside/caller', async (req, reply) => {
    console.log('CALLER_INSIDE:', req.body);
    const result = await channels.get_channels();
    console.log(result);
    return reply.code(200).send({
      meta: {
        ok: true
      }
    });
  });

  fastify.get('/all', async (req, reply) => {
    console.log(req.context);
    // get_channels
    const result = await channels.get_channels();
    console.log(result);
    return reply.code(200).send({
      meta: {
        ok: true
      }
    });
  });

  fastify.get('/add', async (req, reply) => {
    console.log(req.context);
    // get_channels
    const result = await channels.get_channels();
    console.log(result);
    return reply.code(200).send({
      meta: {
        ok: true
      }
    });
  });

  fastify.get('/edit', async (req, reply) => {
    console.log(req.context);
    // get_channels
    const result = await channels.get_channels();
    console.log(result);
    return reply.code(200).send({
      meta: {
        ok: true
      }
    });
  });
};
