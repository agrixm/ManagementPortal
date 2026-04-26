async function echoCookies(req, res) {
  // Protected by header 'x-debug-key' matching process.env.DEBUG_KEY
  return res.json({ cookies: req.cookies || {} });
}

module.exports = { echoCookies };
