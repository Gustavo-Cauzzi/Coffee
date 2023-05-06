import { NextRequest, NextResponse } from "next/server";

const notProtectedRoutes = ["/login", "/signIn"];

export function middleware(request: NextRequest) {
    const jwt = request.cookies.get("jwt");

    console.log("jwt: ", jwt);

    if ((jwt && notProtectedRoutes.includes(request.nextUrl.pathname)) || request.nextUrl.pathname === "/") {
        console.log("dbnsoiabduisa");
        return NextResponse.redirect(new URL("/coffee", request.url));
    } else if (!jwt && !notProtectedRoutes.includes(request.nextUrl.pathname)) {
        request.cookies.delete("jwt");
        const response = NextResponse.redirect(new URL("/login", request.url));
        response.cookies.delete("jwt");

        console.log("login");
        return response;
    }

    console.log("next");
    return NextResponse.next();
}

export const config = {
    matcher: ["/coffee/:path*", "/login", "/signIn", "/"],
};
