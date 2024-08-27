import {NextResponse} from 'next/server';
import {cookies} from 'next/headers';
import {jwtVerify} from 'jose';
import {checkIfIdAllowed} from "@/app/api/utlis/userProperties";

export async function middleware(request) {

    try {
        const SECRET_KEY = new TextEncoder().encode(process.env.SECRET_KEY);
        const cookieStore = cookies();

        const token = cookieStore.get("token")?.value;

        if (!token) {
            throw new Error("No token provided")
        }

        const {payload} = await jwtVerify(token, SECRET_KEY);
        if (!payload) {
            throw new Error("error")
        }
        const currentPath = request.nextUrl.pathname;
        if (currentPath.startsWith("/api/main/properties")) {
            const pathSegments = currentPath.split('/');
            let id;
            for (const segment of pathSegments) {
                if (!isNaN(segment) && segment !== '') {
                    id = segment;
                    break; // Exit the loop once the first number is found
                }
            }
            if (id) {
                const isAllowed = await checkIfIdAllowed(+id)
                if (!isAllowed) throw new Error("No Allowed ")
            }
        }
        return NextResponse.next();
    } catch (error) {
        console.log(error.message, "error in middleware")
        return NextResponse.redirect(new URL('/api/unauthorized', request.url));

    }
}

export const config = {
    matcher: ['/api/main/:path*', '/api/clients/:path*'],
};
