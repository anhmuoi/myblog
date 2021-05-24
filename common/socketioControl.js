module.exports = function(io){
    var usernames = [];
    io.sockets.on('connection',function(socket){
        console.log("have a user connect");
        //listen event adduser
        socket.on('adduser',function(username){
            //save
            socket.username = username;
            usernames.push(username);

            //notify
            var data = {
                sender: "SERVER",
                message:"you have join chat room"
            };

            socket.emit('update_message',data);

            //notify to other user
            var data = {
                sender:"SERVER",
                message:username + "have join to chatroom" 
            };
            socket.broadcast.emit('update_message',data);
        })
        
        //listen send_message 
        socket.on("send_message",function(message){
            //notify to myselt
            var data = {
                sender:"you",
                message:message
            }
            socket.emit("update_message",data);

            var data = {
                sender:socket.username,
                message:message
            }
            socket.broadcast.emit("update_message",data);
        })

        //listen disconnect
        socket.on('disconnect',function(){
            //delete username
            for(var i=0;i < usernames.length; i++)
            {
                if(usernames[i] == socket.username)
                {
                    usernames.splice(i,1);
                }
            }
             let data = {
                 sender:"SERVER",
                 message: socket.username + " left chat room"
             }
            socket.broadcast.emit("update_message",data);
        })
    });


    
    
}