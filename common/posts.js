var q = require('q');
var db = require('./database');
var conn = db.getConnection();

function getAllPosts(){
    var defer = q.defer();
    conn.query('SELECT * FROM posts',function(err,data){
        if(err) defer.reject(err);
        else defer.resolve(data);

        
    })
    return defer.promise;
}

function addPost(params){
    if(params)
    {
    var defer = q.defer();
    conn.query('INSERT INTO posts SET ?',params,function(err,data){
        if(err) defer.reject(err);
        else defer.resolve(data);

        
    })
    return defer.promise;
    }
    return false;
}

function getID(id){
    if(id)
    {
    var defer = q.defer();
    conn.query('SELECT * FROM posts WHERE id=?',[id],function(err,data){
        if(err) defer.reject(err);
        else defer.resolve(data);

        
    })
    return defer.promise;
    }
    return false;
}

function editPost(data){
    if(data)
    {
    var defer = q.defer();
    conn.query('UPDATE posts  SET ? WHERE ?',data,data.id,function(err,result){
        if(err) defer.reject(err);
        else defer.resolve(result);

        
    })
    return defer.promise;
    }
    return false;
}

function deletePost(idDelete){
    if(idDelete)
    {
    var defer = q.defer();
    conn.query('DELETE FROM posts WHERE id=?',[idDelete],function(err,result){
        if(err) defer.reject(err);
        else defer.resolve(result);

        
    })
    return defer.promise;
    }
    return false;
}
module.exports = {
    getAllPosts: getAllPosts,
    addPost:addPost,
    getID: getID,
    editPost: editPost,
    deletePost: deletePost
}
