class Image{    
    constructor(id, name) {
        if(id)
            this.id = id;

        this.name = name;
    }

    static createImage = function(img) {
        return new User(img.id, img.name);
      }
}
export default Image
