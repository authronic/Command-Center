import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import Google from 'next-auth/providers/google'

const providers: any[] = []

if (process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET) {
  providers.push(
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
          scope:
            'openid email profile https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive.file',
        },
      },
    })
  )
}

providers.push(
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
  })
)

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  secret:
    process.env.AUTH_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    'b6427d14db0b8f0412bfa511397858c7e48b8b939fa4beec8fa510255ecfa14b',
  providers,
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token
        token.refreshToken = account.refresh_token
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub as string
        ;(session as any).accessToken = token.accessToken
      }
      return session
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isPublicPath = nextUrl.pathname.startsWith('/login')
      if (isPublicPath) return true
      if (isLoggedIn) return true
      return false
    },
  },
})
