/** @type {import('next').NextConfig} */
const fs = require('fs');

// Patch Node.js fs.readlink for Windows exFAT drives
// On exFAT, Windows returns EISDIR instead of EINVAL when checking regular files for symlinks.
function patchReadlink() {
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
}

patchReadlink();

const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_PAYPAL_CLIENT_ID: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "sb",
  },
  webpack: (config) => {
    config.resolve.symlinks = false;
    return config;
  },
};

module.exports = nextConfig;
