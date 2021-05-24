var mysql = require('mysql');
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : "",
    database : 'blog'

})

connection.connect(function(err) {
    if (err) {
      console.error('error connecting: ' + err.stack);
      return;
    }
   
    console.log('connected as id ' + connection.threadId);
  });

function getConnection(){
    if(!connection)
    {
        connection.connect();
      
    }
    return connection;
}
module.exports = {
    getConnection: getConnection
}