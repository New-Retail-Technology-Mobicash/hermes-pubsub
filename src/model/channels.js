// import { _try } from '../utils';

const db = require('./postgres');

async function get_channels() {
  try {
    const rs_admin = await db('channels').where({});
    return rs_admin;
  } catch (error) {
    console.log(error);
    return null;
  }
}

async function create_channel(name, pub_ids, sub_ids) {
  try {
    const rs_admin = await db.raw(`select public.create_channel('${name}', '${pub_ids.toString()}', '${sub_ids.toString()}')`);

    return rs_admin;
  } catch (error) {
    console.log(error);
    return null;
  }
}

module.exports = {
  get_channels,
  create_channel
};
