import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  secret:
    process.env.AUTH_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    'b6427d14db0b8f0412bfa511397858c7e48b8b939fa4beec8fa510255ecfa14b',
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const username = process.env.ADMIN_USERNAME || 'admin'
        const password = process.env.ADMIN_PASSWORD || 'authronic2026'
        if (
          credentials?.username === username &&
          credentials?.password === password
        ) {
          return {
            id: '1',
            name: 'Authronic Admin',
            email: process.env.ADMIN_EMAIL ?? 'admin@authronic.com',
          }
        }
        return null
      },
    }),
  ],
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: { strategy: 'jwt' },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isPublicPath = nextUrl.pathname.startsWith('/login')
      if (isPublicPath) return true
      if (isLoggedIn) return true
      return false
    },
  },
})
