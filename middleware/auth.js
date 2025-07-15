const authenticate = (req, res, next) => {
  if (!req.session.user) return res.redirect('/auth/login');
  next();
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.session.user.role)) {
      return res.status(403).send('Access denied');
    }
    next();
  };
};

module.exports = {authenticate, authorizeRoles}