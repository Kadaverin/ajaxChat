const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');
const passport = require('passport')

const UserSchema = new Schema({
    nickname: {
        type: String,
        unique: true,
        required: true,
    },
   name: {
       type: String,
       required: true
   }
} , { collection: 'users' } )

UserSchema.plugin(passportLocalMongoose , { usernameField: 'nickname' });

const User = mongoose.model("User", UserSchema);

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

module.exports = User;