import { NextResponse } from "next/server";
import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: [
    "/", 
    "/pricing", 
    "/api/get-wallpapers", 
    "/api/get-user-info"
  ],

  async afterAuth(auth, req) {
    try {
      // 确保 auth 对象存在，避免访问 undefined
      if (!auth?.userId && !auth?.isPublicRoute) {
        if (auth?.isApiRoute) {
          return NextResponse.json(
            { code: -2, message: "no auth" },
            { status: 401 }
          );
        }

        const signInUrl = new URL("/sign-in", req.url);
        return NextResponse.redirect(signInUrl);
      }

      // 继续请求
      return NextResponse.next();
      
    } catch (error) {
      console.error("Middleware Error:", error);

      // 遇到异常也返回正常请求
      return NextResponse.next();
    }
  },
});

export const config = {
  matcher: [
    "/((?!.+\\.[\\w]+$|_next).*)", 
    "/", 
    "/(api)(.*)"
  ],
};
