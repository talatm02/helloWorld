const http = require('http');
const url = require('url');
const config = require('./config');
const StringDecoder = require('string_decoder').StringDecoder;
const handlers = require('./lib/handler');

//Instatiate HTTP Server 
var server = http.createServer((req,res)=>{
    unifiedServer(req, res);
});

// Listen Server
server.listen(config.port,()=>{
    console.log('Server is running on port: ', config.port);
});

const unifiedServer = (req,res)=>{
    // parse the URL
    const parsedUrl = url.parse(req.url,true);

    // Get the path
    const path = parsedUrl.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g,'');

    //GET method name
    const method = req.method.toUpperCase();

    //get Queries params
    const queryObject = parsedUrl.query;

    //get header
    const headers = req.headers;

    //get payload, if any
    const decoder = new StringDecoder('utf-8');
    let buffer = '';
    req.on('data', (data)=>{
        buffer += decoder.write(data);
    });

    req.on('end', ()=>{
        buffer += decoder.end();

        // Check the router for a matching path for a handler. If one is not found, use the notFound handler instead.
        const chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

        const data = {
            method,
            trimmedPath,
            queryObject,
            payload: buffer,
            headers
        }
        chosenHandler(data, (statusCode, payload)=>{

            //use the status code return from the handler, or use default 200
            statusCode = typeof(statusCode) == 'number' ? statusCode : 200;

            //use the payload return from the handler, or use defaul object
            payload = typeof(payload) == 'object' ? payload : {};

            res.setHeader('Content-Type', 'application/json');
            res.writeHead(statusCode);

            //conver the payload to string
            const payloadString = JSON.stringify(payload);

            //Send the reponse
            res.end(payloadString);
        });

    });
};
//define router
let router = {
    hello: handlers.hello
}