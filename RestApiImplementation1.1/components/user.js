class User{    
    constructor(id, name, email, hashedPassword) {
        if(id)
            this.id = id;

        this.name = name;
        this.email = email;
        
        if(hashedPassword)
            this.hash = hashedPassword;

        var selfLink = "/api/users/" + this.id;
        this.self =  selfLink;
    }
}

module.exports = User;
