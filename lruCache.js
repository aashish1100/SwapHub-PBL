// lruCache.js
const { LRUCache } = require("lru-cache");

const options = {
  max: 100,
  ttl: 1000 * 60 * 5, // 5 minutes
};

const lruCache = new LRUCache(options);

module.exports = lruCache;
