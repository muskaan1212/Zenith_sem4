const passport = require('passport')
const { Strategy: LocalStrategy } = require('passport-local')
const bcrypt = require('bcrypt')
const User = require('../models/User')

let configured = false

module.exports = function configurePassport() {
  if (configured) return passport

  passport.use(
    new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
      try {
        const user = await User.findOne({ email })
        if (!user) {
          return done(null, false, { message: 'User not found' })
        }

        const isValid = await bcrypt.compare(password, user.passwordHash)
        if (!isValid) {
          return done(null, false, { message: 'Invalid password' })
        }

        return done(null, user)
      } catch (error) {
        return done(error)
      }
    }),
  )

  configured = true
  return passport
}
