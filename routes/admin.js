var express = require('express');
var router = express.Router();
var user_md = require('../common/user');
var posts_md = require('../common/posts');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);


router.get('/', function(req, res, next) {
    if(req.session.user)
    {
         var dataPost = posts_md.getAllPosts();
    dataPost.then(function(posts){
        var data = {
          posts: posts,
          error: false
        }
        res.render('dashboard',{data:data});
    }).catch(function(err){
         res.render('dashboard',{data:{error:"get posts data error"}}); 
    })
    
    }
    else
    {
      res.redirect('/admin/signin');
    }
 
  });



  router.get('/signup', function(req, res, next) {
    res.render("signup",{data:{}});
  });
  router.post('/signup', function(req, res, next) {
    var user = req.body;
    if(user.email.trim().length == 0)
    {
      res.render("signup",{data:{error:"email errordgfgj"}});
    }

    if(user.password != user.retype || user.password.trim().length == 0)
    {
      res.render("signup",{data:{error:"password is not match"}});
    }

    const hash = bcrypt.hashSync(user.password, salt);
    user = {
      email: user.email,
      password: hash,
      first_name: user.firstname,
      last_name: user.lastname
    }

  

    var result = user_md.addUser(user);

    result.then(function(data){
      res.redirect('/admin/signin');
    }).catch(function(err){
      res.render('signup',{data:{error:"error insert"}})
      
    })
  });


  router.get('/signin', function(req, res, next) {
    res.render("signin",{data:{}});
  });
  router.post('/signin', function(req, res, next) {
    params = req.body; 
    if(params.email.trim().length == 0)
    {
      res.render("signin",{data:{error:"Please an email"}});
    }
    else
    {
      var dataUser = user_md.getUserByEmail(params.email);
      if(dataUser)
      {
        dataUser.then(function(users){
          var user = users[0];
          

         
          
          var status =  bcrypt.compare (params.password, user.password);
          if(status == false)
          {
            res.render("signin",{data:{error:"password wrong"}});
          }
          else
          {
            req.session.user = user;
            
            res.redirect('/admin');
          }
        })
      }
      else
      {
        res.render("signin",{data:{error:"Email is not exist"}});
      }
    }

    
  });


  router.get('/post/new', function(req, res, next) {
    if(req.session.user)
    {
      res.render("new",{data:{}});
    }
    else
    {
      res.redirect('/admin/signin');
    }
  });
  
  router.post('/post/new', function(req, res, next) {
    
    var params = req.body;
    if(params.title.trim().length == 0)
    {
     
      res.render("new",{data:{error:"Please enter title"}});
    }
    else
    {
      var now = new Date();
    params.created_at = now;
    params.updated_at = now;
    var data = posts_md.addPost(params);

    data.then(function(result){
      res.redirect('/admin');
    }).catch(function(err){
      res.render("new",{data:{error:"Could not add post"}});
    })

  
    }
   }); 

   router.get('/post/edit/:id', function(req, res, next) {
    
    if(req.session.user)
    {
      var data = posts_md.getID(req.params.id);
    if(data)
    {
      data.then(function(result){
        var post = result[0];
        var data = {
          post: post,
          error: false
        }
        
        res.render("edit",{data:data});
      }).catch(function(err){
        res.render("edit",{data:{error:"Could not get Post by ID"}});
      })
    }
    else
    {
      res.render("edit",{data:{error:"Could not get Post by ID"}});
    }

    }
    else
    {
      res.redirect('/admin/signin');
    }
    
    
  });
  router.post('/post/edit/:id', function(req, res, next) {
    
    let getData = req.body;
    let now = new Date();
    let idEdit = req.params.id;
    let data = [
      { 
      title: getData.title,
      content: getData.content,
      author: getData.author,
      updated_at : now
    },
    {
      id: idEdit
    }
  ]
    let dataEditPost = posts_md.editPost(data);
 
    if(dataEditPost)
    {
      res.redirect('/admin');
    dataEditPost.then(function(result){
      
      
    }).catch(function(err){
      console.log(err);
      res.render("edit",{data:{error:"Could not edit Post by ID"}});
    })
    }
    else
    {
      res.render("edit",{data:{error:"Could not edit Post by ID"}});
    }
  });
//xoa
  
  router.get('/post/xoa/:id', function(req, res, next) {
    
    
    
    let idDelete = req.params.id;
    
    let dataEditPost = posts_md.deletePost(idDelete);
    console.log(dataEditPost);
    if(dataEditPost)
    {
      res.redirect('/admin');
    dataEditPost.then(function(result){
      
      
    }).catch(function(err){
      console.log(err);
      res.render("edit",{data:{error:"Could not delete Post by ID"}});
    })
    }
    else
    {
      res.render("edit",{data:{error:"Could not delete Post by ID"}});
    }
  });


  
router.get('/user', function(req, res, next) {

  if(req.session.user)
  {
     var getDataUser = user_md.getDataUser();
  if(getDataUser)
  {
  getDataUser.then(function(result){
    let data = {
      user:result,
      error: false
    }
    res.render("user",{data:data})
  }).catch(function(err){
    res.render("user",{data:{error:"get user fail"}})
  })
  }
  else
  {
    res.render("user",{data:{error:"get user fail"}})
  }
  }
  else
  {
    res.redirect('/admin/signin')
  }
 
  
  
  
});
  module.exports = router;