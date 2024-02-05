import { testConnection } from '../services/health-check-service.js';

export const getHealthStatus = async (request, response) => {
    // Set headers
    request.headers['content-type'] = 'application/json';
    response.header('Content-Type', 'application/json');
    
    console.log("Length of the content: ", request.headers['content-length']);
    try {
        //Check the length of the request body
        if(request.headers['content-length'] !== undefined || Object.keys(request.query).length) {
            // Bad Request response and do not cache the response
            response.status(400).header('Cache-Control', 'no-cache').json();
            return;
        }

        const data = await testConnection();
        // Success response and do not cache the response
        response.status(200).header('Cache-Control', 'no-cache').json();
    } catch (error) {
        // Service Unavailable response and do not cache the response
        response.status(503).header('Cache-Control', 'no-cache').json();
    }
}

// Method to check if the request method other than 'GET' is allowed
export const setMethodNotAllowed = async (request, response) => {
    console.log("Method not allowed")
    response.status(405).header('Cache-Control', 'no-cache').json();
    return;
}
