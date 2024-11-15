import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import { JWT } from "next-auth/jwt"
import { Session } from "next-auth"

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
    }),

  ],
  secret: process.env.AUTH_SECRET!,
  callbacks: {
    async session({ session, token }: { session: Session, token: JWT }) {
      session.token = token
      return session
    }
  }
}

export default NextAuth(authOptions)