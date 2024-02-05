// Middleware to handle syntax errors
export const checkSyntaxError = (error, request, response, next) => {
    if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
        console.log("This is a syntax error");
        response.status(400).header('Cache-Control', 'no-cache').json();
        return;
    }
    next();
}