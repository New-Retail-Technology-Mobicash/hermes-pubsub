/* eslint-disable */
import { delay_starttime } from './config';
const PubSubEngine = require('./engines/PubSub');

const log = require('pino')({
  level: 'info',
  prettyPrint: {
    levelFirst: true,
  },
});

const fastify = require('fastify')({
  logger: log,
});

const pub_sub_engine =  new PubSubEngine();
pub_sub_engine.init();

const caller = require('./routes/caller');
const hub = require('./routes/hub');

const corsOptions = {
  origin: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
};

/**
 * Plugins
 */
fastify.register(require('fastify-multipart'));

fastify
  .use(require('cors')(corsOptions))
  .use(require('dns-prefetch-control')())
  .use(require('frameguard')())
  .use(require('hide-powered-by')())
  .use(require('hsts')())
  .use(require('ienoopen')())
  .use(require('x-xss-protection')());

fastify.get('/', async () => ({ hello: 'PUBSUB' }));

/**
 * Routes
 */


fastify
  .addHook('preHandler', async (request) => {
    console.log(request.context);
    request.context = {
      pub_sub_engine
    };
  })
  .register(caller)
  .register(hub);

/**
 * Start server
 */

const port = process.env.API_CALLER || 1129;

setTimeout( () => {
  fastify.listen(port, '0.0.0.0', (err) => {
    if (err) throw err;
    console.log(`server listening on ${fastify.server.address().port}`);
  });
}, delay_starttime);
