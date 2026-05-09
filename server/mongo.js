const mongoose = require('mongoose');
const dns = require('dns');

// Allow optional override of system DNS resolvers via env var `DNS_SERVERS`
if (process.env.DNS_SERVERS) {
  try {
    const servers = process.env.DNS_SERVERS.split(',').map((s) => s.trim()).filter(Boolean);
    if (servers.length) {
      dns.setServers(servers);
      // eslint-disable-next-line no-console
      console.log('Using custom DNS servers:', servers.join(','));
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('Failed to set custom DNS servers from DNS_SERVERS env:', e && e.message ? e.message : e);
  }
}

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/fixit';

let connected = false;

async function connect(options = {}) {
  if (connected) return mongoose;

  const retryInterval = parseInt(process.env.MONGO_CONNECT_RETRY_MS, 10) || options.retryInterval || 2000;
  const maxRetries = typeof options.maxRetries === 'number' ? options.maxRetries : (process.env.MONGO_CONNECT_MAX_RETRIES ? parseInt(process.env.MONGO_CONNECT_MAX_RETRIES, 10) : 0);
  // maxRetries === 0 => retry forever

  let attempt = 0;
  // keep trying until connected or maxRetries exceeded
  while (true) {
    try {
      attempt += 1;
      // connect returns a Promise which resolves when connected
      await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
      connected = true;
      // eslint-disable-next-line no-console
      console.log('Connected to MongoDB at', MONGO_URI);
      return mongoose;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('MongoDB connection error:', err && err.message ? err.message : err);
      if (maxRetries > 0 && attempt >= maxRetries) {
        // eslint-disable-next-line no-console
        console.error(`Exceeded MongoDB connect attempts (${attempt}), giving up.`);
        throw err;
      }
      // eslint-disable-next-line no-console
      console.log(`MongoDB not ready, retrying in ${retryInterval}ms (attempt ${attempt})`);
      // wait
      // eslint-disable-next-line no-await-in-loop
      await new Promise((resolve) => setTimeout(resolve, retryInterval));
    }
  }
}

module.exports = { connect, mongoose };
