import { type RequestHandler } from "@builder.io/qwik-city";
import { getUser } from "../utils/auth-helper";

/**
 * Global Auth Middleware (Phantom Lattice Proxy)
 * 
 * Responsibilities:
 * 1. Ensure the Supabase session is refreshed on every request.
 * 2. Handle global redirection logic (standard approach).
 */
export const onRequest: RequestHandler = async (event) => {
    // 1. Skip middleware for static assets, API routes, or internal Qwik paths
    if (
        event.url.pathname.startsWith('/api/') ||
        event.url.pathname.includes('.') ||
        event.url.pathname.startsWith('/build/')
    ) {
        return;
    }

    // 2. Refresh session/Get User
    const user = await getUser(event);

    // Normalize path (strip trailing slash for consistent matching)
    const rawPath = event.url.pathname;
    const path = rawPath.endsWith('/') && rawPath !== '/' ? rawPath.slice(0, -1) : rawPath;

    const isLoginPage = path === '/login';
    const isDashboard = path === '/';

    // Protected paths (Dashboard, Services, Access Control)
    const isProtectedPage =
        isDashboard ||
        path.startsWith('/services') ||
        path.startsWith('/access-control') ||
        path.startsWith('/ui-gallery');

    // 3. Global Redirection Logic

    // If authenticated and on login page, redirect to root dashboard
    if (user && isLoginPage) {
        throw event.redirect(303, "/");
    }

    // If unauthenticated and on a protected page, redirect to authorization portal
    if (!user && isProtectedPage) {
        throw event.redirect(303, "/login/");
    }

    // Pass user data to shared state
    if (user) {
        event.sharedMap.set('user', user);
    }
};
