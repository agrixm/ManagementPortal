function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthenticated' });
    }

    // Normalize roles to lower-case to avoid accidental casing mismatches
    const normalizedAllowed = allowedRoles.map((r) => String(r).toLowerCase());
    const userRole = String(req.user.role || '').toLowerCase();

    if (!normalizedAllowed.includes(userRole)) {
      console.warn('requireRole: access denied', {
        userId: req.user._id,
        userRole: req.user.role,
        allowedRoles: allowedRoles
      });
      return res.status(403).json({ message: 'Forbidden' });
    }

    return next();
  };
}

module.exports = { requireRole };
