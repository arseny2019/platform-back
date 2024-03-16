module.exports = class UserDto {
    email;
    id;
    status;
    roles;

    constructor(model) {
        this.email = model.email;
        this.id = model._id;
        this.status = model.status;
        this.roles = model.roles;
    }
}
