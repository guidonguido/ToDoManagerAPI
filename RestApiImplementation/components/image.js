class Image{    
    constructor(id, name, taskId) {
        if(id)
            this.id = id;

        this.name = name;

        this.taskId = taskId;

        var imageFileLink = "/api/tasks/" + this.taskId + "/images/" + this.id + "/imageFile";
        this.imageFile =  imageFileLink;

        var selfLink = "/api/tasks/" + this.taskId + "/images/" + this.id;
        this.self =  selfLink;
    }

    static createImage = function(img) {
        return new Image(img.id, img.name, img.task);
      }
}
module.exports = Image;
