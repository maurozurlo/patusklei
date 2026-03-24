import { defineEventHandler, setResponseHeader } from 'h3'
// server/middleware/frame-fix.ts
export default defineEventHandler((event) => {
    // Check if we are heading to your game file
    if (event.path.startsWith('/game.html')) {
        // Forcefully set the headers to allow the iframe
        setResponseHeader(event, 'X-Frame-Options', 'SAMEORIGIN')
        setResponseHeader(event, 'Content-Security-Policy', "frame-ancestors 'self'")
    }
})