import passport from 'passport';
import { Strategy as localStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import bcrypt from 'bcrypt';

export function initializePassport(prisma: any) {

  passport.use(
    // using email as the username field for authentication
    new localStrategy({ usernameField: 'email' }, async (email, password, done) => {
      try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
          return done(null, false, { message: 'Incorrect email' });
        }
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
          return done(null, false, { message: 'Incorrect password' });
        }
        return done(null, user);
      }
      catch (err) {
        return done(err);
      }
    })
  );

  passport.use(
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET!,
      },
      async (payload, done) => {
        try {
          const user = await prisma.user.findUnique({
            where: { id: payload.userId },
          });

          if (!user) {
            return done(null, false);
          }

          return done(null, user);
        } catch (err) {
          return done(err, false);
        }
      }
    )
  );
}
