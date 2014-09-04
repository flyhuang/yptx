/**
 * Configuration class for YPTX server.
 *
 * @author wade.huang
 */

"use strict";

// YPTX main configruation.
// --------------

exports.config = {
    // MongoDB configuration
    mongo: 'mongodb://127.0.0.1/yptx_dev',

    // Session and Auth cookie configuration
    session_secret: 'yptx_srv',
    auth_cookie_name: 'yptx_srv',

    // YPTX server configuration
    DEV_YPTX_HOST: '127.0.0.1',
    DEV_YPTX_PORT: 5000,
    PROD_YPTX_HOST: 'yptx-srv.herokuapp.com',
    PROD_YPTX_PORT: 80,
    YPTX_ENV: 'dev',
    YPTX_PUBLIC_FOLDER: 'docs',

    // Http methods and heards
    CONTENT_TYPE: 'application/json; charset=UTF-8',
    ROUTER_METHOD_POST: 'POST',
    ROUTER_METHOD_GET: 'GET',
    ROUTER_METHOD_DELETE: 'DELETE',
    ROUTER_METHOD_PUT: 'PUT',

};
