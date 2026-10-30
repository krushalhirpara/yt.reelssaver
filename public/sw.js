self.options = {
    "domain": "5gvci.com",
    "zoneId": 12151209
};
self.lary = "";

// Monetag Ads Service Worker
try {
    importScripts('https://5gvci.com/act/files/service-worker.min.js?r=sw');
} catch (e) {
    console.warn('[Monetag SW] Import error:', e);
}

// MyBid Ads Web-Push Service Worker
try {
    importScripts('https://js.mbidpsh.com/ps/sw.js');
} catch (e) {
    console.warn('[MyBid SW] Import error:', e);
}
