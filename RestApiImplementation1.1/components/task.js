class Task{    
    constructor(id, description, important, privateTask, deadline, project, completed) {
        if(id)
            this.id = id;

        this.description = description;
        this.important = important;
        this.private = privateTask;

        if(deadline)
            this.deadline = deadline;
        if(project)
            this.project = project;
          
        
        this.completed = completed || false;
        var selfLink = "/api/tasks/" + this.id;
        this.self =  selfLink;
    }

    static createTask = function(row) {
        const important = (row.important === 1) ? true : false;
        const privateTask = (row.private === 1) ? true : false;
        const completed = (row.completed === 1) ? true : false;
        return new Task(row.tid, row.description, important, privateTask, row.deadline, row.project, completed);
      }
}

module.exports = Task;


