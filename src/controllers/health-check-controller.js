import { testConnection } from '../services/health-check-service.js';
import logger from '../../logger.js';

export const getHealthStatus = async (request, response) => {
    // Set headers
    request.headers['content-type'] = 'application/json';
    response.header('Content-Type', 'application/json');
    
    try {
        //Check the length of the request body
        if(request.headers['content-length'] !== undefined || Object.keys(request.query).length) {
            logger.warn("Request body is not allowed for this endpoint!");
            // Bad Request response and do not cache the response
            response.status(400).header('Cache-Control', 'no-cache').json();
            return;
        }

        const data = await testConnection();
        // Success response and do not cache the response
        logger.info("Health check successful!");
        response.status(200).header('Cache-Control', 'no-cache').json();
    } catch (error) {
        // Service Unavailable response and do not cache the response
        response.status(503).header('Cache-Control', 'no-cache').json();
    }
}

// Method to check if the request method other than 'GET' is allowed
export const setMethodNotAllowed = async (request, response) => {
    logger.warn("The used method is not allowed for this endpoint!");
    response.status(405).header('Cache-Control', 'no-cache').json();
    return;
}

// Method to check for 404 error
export const notFound = async (request, response) => {
    logger.warn("The requested endpoint does not exist!");
    response.status(404).header('Cache-Control', 'no-cache').json();
    return;
}