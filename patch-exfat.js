const fs = require('fs');

const origReadlinkSync = fs.readlinkSync;
fs.readlinkSync = function (path, options) {
  try {
    return origReadlinkSync.call(fs, path, options);
  } catch (err) {
    if (err && (err.code === 'EISDIR' || err.code === 'UNKNOWN')) {
      const error = new Error(`EINVAL: invalid argument, readlink '${path}'`);
      error.code = 'EINVAL';
      throw error;
    }
    throw err;
  }
};

const origReadlink = fs.readlink;
fs.readlink = function (path, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }
  return origReadlink.call(fs, path, options, (err, linkString) => {
    if (err && (err.code === 'EISDIR' || err.code === 'UNKNOWN')) {
      const error = new Error(`EINVAL: invalid argument, readlink '${path}'`);
      error.code = 'EINVAL';
      return callback(error);
    }
    return callback(err, linkString);
  });
};

if (fs.promises && fs.promises.readlink) {
  const origPromisesReadlink = fs.promises.readlink;
  fs.promises.readlink = async function (path, options) {
    try {
      return await origPromisesReadlink.call(fs.promises, path, options);
    } catch (err) {
      if (err && (err.code === 'EISDIR' || err.code === 'UNKNOWN')) {
        const error = new Error(`EINVAL: invalid argument, readlink '${path}'`);
        error.code = 'EINVAL';
        throw error;
      }
      throw err;
    }
  };
}

if (fs.realpathSync && fs.realpathSync.native) {
  const origRealpathNative = fs.realpathSync.native;
  fs.realpathSync.native = function (path, options) {
    try {
      return origRealpathNative.call(fs, path, options);
    } catch (err) {
      if (err && (err.code === 'EISDIR' || err.code === 'UNKNOWN')) {
        return fs.realpathSync(path, options);
      }
      throw err;
    }
  };
}
