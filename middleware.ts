export {default} from 'next-auth/middleware';
export const config = {
  matcher: ["/goals/:path*", "/settings/:path*"]
};