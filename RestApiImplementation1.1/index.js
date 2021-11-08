'use strict';

var path = require('path');
var http = require('http');

var oas3Tools = require('oas3-tools');
var serverPort = 8080;

// swaggerRouter configuration
var options = {
    routing: {
        controllers: path.join(__dirname, './controllers')
    },
};

var expressAppConfig = oas3Tools.expressAppConfig(path.join(__dirname, 'api/openapi.yaml'), options);
var app = expressAppConfig.getApp();

/**
var tasksController = require('./controllers/Tasks');
var taskController = require('./controllers/Task');
var assigneesController = require(path.join(__dirname,"controllers/Assignees"));
var authenticationController = require(path.join(__dirname,"controllers/Authentication"));

app.get('/tasks/public', tasksController.getAllPublicTasks);
app.get('/tasks', tasksController.getAllTasks);
app.post('/tasks', tasksController.createTask); // TODO Validate body

app.get('/tasks/:taskId', taskController.getTaskById);
app.put('/tasks/:taskId', taskController.updateTask); // TODO Validate body
app.patch('/tasks/:taskId', taskController.updateCompletedTask); // TODO Validate body
app.delete('/tasks/:taskId', taskController.deleteTask);

app.get('/tasks/:taskId/assignees', assigneesController.getTaskAssignees);
app.post('/tasks/:taskId/assignees', assigneesController.addTaskAssignee); // TODO Validate body
app.delete('/tasks/:taskId/assignees/:userId', assigneesController.removeTaskAssignee);

app.post('/login', authenticationController.authenticateUser); // TODO Validate body
app.post('/logout', authenticationController.logoutUser); // TODO Validate body
*/

// Initialize the Swagger middleware
http.createServer(app).listen(serverPort, function () {
    console.log('Your server is listening on port %d (http://localhost:%d)', serverPort, serverPort);
    console.log('Swagger-ui is available on http://localhost:%d/docs', serverPort);
});

