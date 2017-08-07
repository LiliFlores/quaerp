app.service("UserService", function() {
    var user = {};

    this.set = function(data) {
        user = data;
    }

    this.get = function() {
        return user;
    }
});
