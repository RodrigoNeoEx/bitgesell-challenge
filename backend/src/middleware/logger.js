// Extra logger middleware stub for candidate to enhance
module.exports = (req, res, next) => {
  const start = process.hrtime();

  res.on('finish', () => {
    const diff = process.hrtime(start);
    const timeMs = (diff[0] * 1e3 + diff[1] / 1e6).toFixed(2);
    console.log(
      `${req.method} ${req.originalUrl} ${res.statusCode} - ${timeMs}ms`
    );
  });

  next();
};
