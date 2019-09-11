module.exports = {
  _try: async promise => promise.then(res => [null, res]).catch(err => [err, {}]),
  _validateParams: (params, requiredParams) => {
    const missingParams = [];
    requiredParams.forEach((p) => {
      if (params[p] === null || params[p] === undefined) {
        missingParams.push(p);
      }
    });

    return missingParams;
  }
};
