const mongoose = require('mongoose');
const dns = require('dns');

// Force Node.js to use Google DNS.
// Root cause: VirtualBox set 127.0.0.1 as system DNS, but nothing
// listens on port 53 locally. Node.js (unlike nslookup) uses this
// broken entry directly, causing ECONNREFUSED on every DNS lookup.
// Fix your system DNS (Set-DnsClientServerAddress) and remove these lines.
dns.setServers(['8.8.8.8', '8.8.4.4']);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
