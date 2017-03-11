var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/users', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/register', function(req, res, next) {
  res.render('register', {
    'title': 'Register'
  });
});

router.get('/login', function(req, res, next) {
  res.render('login', {
    'title': 'Login'
  });
});

router.post('/register', function(req, res, next){
  var name = req.body.name;
  var email = req.body.email;
  var username = req.body.username;
  var password = req.body.password;
  var password2 = req.body.password2;


//Check for Image Field.

  if(req.files.profileimage){
    console.log('Uploading file...');
    //File infos.
    var profileImageOriginalName = req.files.profileimage.originalname;
    var profileImageName = req.files.profileimage.name;
    var profilImageMime = req.files.profileimage.mimetype;
    var profileImagePath = req.files.profileimage.path;
    var profileImageExt = req.files.profileimage.extension;
    var profileImageSize = req.files.profileiamge.size;
  } else {
    //Set default image
    var profileImageName = 'anon.jpg';
  }

  //Validating Form

  req.checkBody('name', 'Name field is required').notEmpty();
  req.checkBody('email', 'Email field is required').notEmpty();
  req.checkBody('email', 'Email not valid!').isEmail();
  req.checkBody('username', 'Username is required').notEmpty();
  req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('password2', 'Passwords not matching').equals(req.body.password);

  // Checking errors.
  var errors = req.validationErrors();
  if(errors){
    res.render('register',{
      errors: errors,
      name: name,
      email: email,
      username: username,
      password: password,
      password2: password2
    });
  } else {
    var newUser = new User({
      name: name,
      email: email,
      username: username,
      password: password,
      profileimage: profileImageName
    });

    //Create User
    User.createUser(newUser, function(err, user){
      if(err) throw err;
      console.log(user);
    });

    //Flash message
    req.flash('success', 'You are registered and may login now.');
    res.location('/');
    res.redirect('/');

  }
});

module.exports = router;
