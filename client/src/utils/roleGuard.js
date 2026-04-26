export function hasRole(user, allowedRoles = []) {
  if (!user) return false;
  return allowedRoles.length === 0 || allowedRoles.includes(user.role);
}
