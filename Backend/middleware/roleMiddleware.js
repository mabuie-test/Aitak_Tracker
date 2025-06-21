// middleware/roleMiddleware.js
module.exports = (required) => (req, res, next) => {
  const userRole = req.user.role;
  // Permite passar uma string ou array de strings
  const allowed = Array.isArray(required) ? required : [required];

  if (!req.user || !allowed.includes(userRole)) {
    return res.status(403).json({ error: 'Permissão negada' });
  }
  next();
};
