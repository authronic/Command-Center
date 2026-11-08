import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const username = process.env.ADMIN_USERNAME
        const password = process.env.ADMIN_PASSWORD
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
