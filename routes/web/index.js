const UserService = require("../../services/user");
const passport = require('passport');
const path = require('path');
const User = require('../../models/user')

module.exports = function(app){
    app.get('/', (req, res, next) => {
      if (req.isAuthenticated()) return res.redirect('chat')
      res.render("home" );
    }) 

    app.post('/login', (req, res, next) => {
      passport.authenticate('local', (err, user, info) => {
        if(info) { return res.send(info.message) }
        if (!user) { return res.redirect('/'); }
        req.login(user, (err) => {
          if (err) { return next(err); }
          return res.redirect('/chat');
        })
      })(req, res, next);
    })

    app.post('/register', function(req, res, next) {
     User.register(
       new User({ nickname : req.body.nickname, name: req.body.name }), 
       req.body.password,
       function(err, user) {
          if (err) {
            return res.redirect('/')
          }
          passport.authenticate('local')(req, res, function () {
            return res.redirect('/chat');
          });
      });
    });

    app.get('/chat', (req, res) => {
        if (!req.isAuthenticated()) res.redirect('/')
        return res.render('chat' , { currentUser : req.user }); 
    })
    app.get('/logout' , (req, res) => {
      req.logOut();
      return res.redirect('/')
    })
}