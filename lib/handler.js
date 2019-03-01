//define all handler
let handlers = {};

//sample handler
handlers.hello = (data, callback)=>{
    callback(406, {name: 'hello world handlers'});
};

//not found handler
handlers.notFound = (data, callback)=>{
    callback(404);
};

module.exports = handlers;