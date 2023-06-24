import { NextRequest, NextResponse } from "next/server";

const notProtectedRoutes = ["/login", "/signIn"];

export function middleware(request: NextRequest) {
    const jwt = request.cookies.get("jwt");

    if ((jwt && notProtectedRoutes.includes(request.nextUrl.pathname)) || request.nextUrl.pathname === "/") {
        return NextResponse.redirect(new URL("/coffee", request.url));
    } else if (!jwt && !notProtectedRoutes.includes(request.nextUrl.pathname)) {
        request.cookies.delete("jwt");
        const response = NextResponse.redirect(new URL("/login", request.url));
        response.cookies.delete("jwt");

        return response;
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/coffee/:path*", "/login", "/signIn", "/"],
};
