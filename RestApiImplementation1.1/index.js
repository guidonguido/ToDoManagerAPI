'use strict';

var path = require('path');
var http = require('http');
var fs = require("fs");
var passport = require('passport');
var { Validator, ValidationError } = require('express-json-validator-middleware');

var oas3Tools = require('oas3-tools');
var serverPort = 3000;

var tasksController = require(path.join(__dirname, 'controllers/Tasks'));
var taskController = require(path.join(__dirname, 'controllers/Task'));
var authenticationController = require(path.join(__dirname, 'controllers/Authentication'));
var assigneesController = require(path.join(__dirname,"controllers/Assignees"));
var usersController = require(path.join(__dirname, 'controllers/Users'));
var userController = require(path.join(__dirname, 'controllers/User'));

// swaggerRouter configuration
var options = {
    // controllers: path.join(__dirname, './controllers')
};
var expressAppConfig = oas3Tools.expressAppConfig(path.join(__dirname, 'api/openapi.yaml'), options);
expressAppConfig.addValidator();
var app = expressAppConfig.getApp();

// Set validator middleware
var taskSchema = JSON.parse(fs.readFileSync(path.join('.', 'json_schemas', 'taskschema_rest.json')).toString());
var userSchema = JSON.parse(fs.readFileSync(path.join('.', 'json_schemas', 'userschema_rest.json')).toString());
var validator = new Validator({ allErrors: true });
validator.ajv.addSchema([userSchema, taskSchema]);
var validate = validator.validate;

//Set authentication middleware
app.use(passport.initialize());

var cookieExtractor = function(req) {
    var token = null;
    if (req && req.cookies)
    {
        token = req.cookies['JWT.token'];
    }
    return token;
  };
  
var JwtStrategy = require('passport-jwt').Strategy;
var opts = {}
opts.jwtFromRequest = cookieExtractor;
opts.secretOrKey = 'uA2EoqHgylP9LAFNK1uXCb-YS7cmBtBxW8oxJzc1Y32QsYtR7ecgxdTRW6nR9zME';
passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    return done(null, jwt_payload.user);
   })
);

const authMiddleware = function (req, res, next) {
    passport.authenticate('jwt', { session: false }, function(err, user, info) {
      // If authentication failed, `user` will be set to false. If an exception occurred, `err` will be set.
      if (err || !user ) {
        const err = { name: "UnauthorizedError" }
        return next(err);
      }
      req.user = user;
      return next();
    })(req, res, next);
}

// Route Methods
app.get('/api/tasks/public', tasksController.getAllPublicTasks); // Implemented 
app.post('/api/signin', authenticationController.authenticateUser); // Implemented 
app.post('/api/logout', authMiddleware, validate({body: userSchema}), authenticationController.logoutUser); // Implemented  
app.get('/api/tasks', authMiddleware, tasksController.getAllTasks); // Implemented
app.post('/api/tasks', authMiddleware, validate({body: taskSchema}), tasksController.createTask); 
app.get('/api/tasks/:taskId', authMiddleware, taskController.getTaskById);
app.put('/api/tasks/:taskId', authMiddleware, validate({body: taskSchema}), taskController.updateTask);
app.patch('/api/tasks/:taskId', authMiddleware, taskController.updateCompletedTask);
app.delete('/api/tasks/:taskId', authMiddleware, taskController.deleteTask);
app.get('/api/tasks/:taskId/assignees', authMiddleware, assigneesController.getTaskAssignees);
app.post('/api/tasks/:taskId/assignees', authMiddleware, validate({body: userSchema}), assigneesController.addTaskAssignee);
app.delete('/api/tasks/:taskId/assignees/:userId', authMiddleware, assigneesController.removeTaskAssignee);
app.get('/api/users', authMiddleware, usersController.getAllUsers);
app.get('api/users/:userId', authMiddleware, userController.getUserById);


// Error handlers for validation and authentication errors

app.use(function(err, req, res, next) {
    if (err instanceof ValidationError) {
        res.status(400).send(err);
    } else next(err);
});

app.use(function(err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        var authErrorObj = { errors: [{ 'param': 'Server', 'msg': 'Authorization error' }] };
        res.status(401).json(authErrorObj);
    } else next(err);
});


// Initialize the Swagger middleware
http.createServer(app).listen(serverPort, function() {
    console.log('Your server is listening on port %d (http://localhost:%d)', serverPort, serverPort);
    console.log('Swagger-ui is available on http://localhost:%d/docs', serverPort);
});
