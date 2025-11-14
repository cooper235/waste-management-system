const ADMIN_CREDENTIALS = [
  {
    email: process.env.ADMIN_EMAIL_1 || "b24122@students.iitmandi.ac.in",
    password: process.env.ADMIN_PASSWORD_1 || "gadhaa1136@gmail.com",
  },
  {
    email: process.env.ADMIN_EMAIL_2 || "b24489@students.iitmandi.ac.in",
    password: process.env.ADMIN_PASSWORD_2 || "gadhii436@gmail.com",
  },
]

// Verify admin credentials (development mode)
const verifyAdminCredentials = (email, password) => {
  return ADMIN_CREDENTIALS.some((cred) => cred.email === email && cred.password === password)
}

module.exports = {
  verifyAdminCredentials,
  ADMIN_CREDENTIALS,
}
