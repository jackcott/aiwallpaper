import { NextResponse } from "next/server";
import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: [
    "/",
    "/pricing",
    "/api/get-wallpapers",
    "/api/get-user-info"
  ],

  afterAuth(auth, req, evt) {
    if (!auth.userId && !auth.isPublicRoute) {
      if (auth.isApiRoute) {
        return NextResponse.json(
          { code: -2, message: "no auth" },
          { status: 401 }
        );
      } else {
        return NextResponse.redirect(new URL("/sign-in", req.url));
      }
    }

    return NextResponse.next();
  },
});

export const config = {
  runtime: "nodejs", // ✅ 强制使用 Node.js Runtime
  matcher: [
    "/dashboard/:path*",        // ✅ 仅保护 dashboard 页面
    "/api/protected/:path*",    // ✅ 仅保护特定 API
  ],
};
