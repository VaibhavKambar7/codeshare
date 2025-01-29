// import NextAuth, { type NextAuthOptions } from "next-auth";
// import { authOptions } from "~/lib/authOptions";

// const handler = NextAuth(authOptions) as NextAuthOptions;
// export { handler as GET, handler as POST };

import NextAuth from "next-auth";
import { authOptions } from "~/lib/auth";

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const handler = NextAuth(authOptions);

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
export const GET = handler;

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
export const POST = handler;
