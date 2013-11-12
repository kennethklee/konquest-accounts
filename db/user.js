var __ = require('underscore'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.Types.ObjectId,
    Mixed = Schema.Types.Mixed,
    bcrypt = require('bcrypt'),
    uuid = require('node-uuid'),
    SALT_WORK_FACTOR = 10;

var UserSchema = new Schema({
    _id: {type: String, default: uuid.v1},
    username: {type: String, required: true, index: {unique: true}},
    password: {type: String, required: true},
    name: {type: String, required: true},
    email: {type: String, required: true, index: {unique: true}},
    applications: {type: [String], ref: 'Application', default: []},
    created: {type: Date, default: Date.now},
    modified: {type: Date, default: Date.now}
});

UserSchema.pre('save', function(next) {
    var user = this;
    
    if (!user.isModified('password')) return next(); // only hash the password if it has been modified (or is new)

    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        bcrypt.hash(user.password, salt, function(err, hash) { // hash the password using our new salt
            if (err) return next(err);

            user.password = hash;
            return next();
        });
    });
});

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        return cb(null, isMatch);
    });
};

UserSchema.methods.normalize = function() {
    return __.pick(this.toJSON({getters: true}), 'id', 'name', 'username', 'created');
};

module.exports = mongoose.model('User', UserSchema);
