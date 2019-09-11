const request = require('request-promise');
// import { _try } from '../lib/utils';

const KEY_TRANSFORM = '9ds7yfh23k4jfn@(#*RHFWJAAAA';

function do_request(options) {
  return new Promise(resolve =>
    request(options)
      .then((res_ok) => {
        console.log('10::OK', res_ok);
        if (res_ok && res_ok.meta && res_ok.meta.ok) {
          resolve(true);
        } else {
          resolve(false);
        }
      })
      .catch((err) => {
        console.log('10::FAILED', err);
        resolve(false);
      })
  );
}

function send_restful_to_subcriber(urls, content) {
  return new Promise(async (resolve) => {
    const failed_dest = [];
    console.log('999::**::urls:', urls);
    for (let i = 0; i < urls.length; ++i) {
      const options = {
        method: 'POST',
        uri: urls[i],
        headers: {
          authorization: KEY_TRANSFORM
        },
        body: content,
        json: true,
        timeout: 30000
      };
      console.log('999[BEFORE_SEND]', options);
      // all_request_action.push(request(options));
      const is_sent = await do_request(options);
      console.log(`${options.uri} => ${is_sent}`);
      if (!is_sent) {
        failed_dest.push(urls[i]);
      }
    }
    resolve(failed_dest);
  });
}

module.exports = {
  send_restful_to_subcriber
};
