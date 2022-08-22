import axios from "axios";
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { API_URL } from "../../../utils/constants";

interface LoginReq {
  email: string;
  password: string;
}

interface LoginResp {
  token: string;
  refreshToken: string;
  userId: string;
  sessionId: any | null;
  cinemaId: string;
  cinema: string;
  expiresAt: string;
}

interface RefreshTokenReq {
  currentJWT: string;
  refreshToken: string;
}

async function refreshAccessToken(tokenObject: LoginResp) {
  try {
    // Get a new set of tokens with a refreshToken
    const tokenResponse = await axios.post(
      `${API_URL}/Authentication/GenerateRefreshToken`,
      {
        currentJWT: tokenObject.token,
        refreshToken: tokenObject.refreshToken,
      }
    );

    return {
      ...tokenObject,
      ...tokenResponse.data,
    };
  } catch (error) {
    return {
      ...tokenObject,
      error: "RefreshAccessTokenError",
    };
  }
}

const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      type: "credentials",
      credentials: {},
      authorize: async (credentials, req) => {
        const { email: userName, password } = credentials as LoginReq;

        try {
          const userRes = await axios.post(
            `${API_URL}/Authentication/LoginWithPassword`,
            {
              userName,
              password,
            }
          );

          //you can add more cookie stuff eg user roles
          const user = userRes.data;

          if ((user as LoginResp).token) {
            return user;
          }

          return null;
        } catch (error: any) {
          throw error?.response?.data
            ? { message: error?.response?.data }
            : error;
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.user = user;
      }

      const tokenUser = token as { user: LoginResp };

      const expires = new Date(tokenUser?.user?.expiresAt).getTime();

      const diff = expires - new Date().getTime();

      const shouldRefresh = diff < 0;

      // If the token is still valid, just return it.
      if (!shouldRefresh) {
        return Promise.resolve(token);
      }

      token = await refreshAccessToken(tokenUser.user);

      return Promise.resolve(token);
    },
    session: async ({ session, token }) => {
      session.user = token;

      return Promise.resolve(session);
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
