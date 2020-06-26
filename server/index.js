const app = require('express')()
const http = require('http').createServer(app)
const io = require('socket.io')(http)

const listUsers = []
const listRooms = ["General"]
let lastUserLeave = ""
let lastRoomUser = ""
const listRoomsCreate = []
const listDateRooms = [{channel:"General", lastchange:undefined}]
const RoomUsers = [{channel:"General", users : "Robot"}]

function fn10sec() {
  listDateRooms.forEach(function (element) {
    let actualTime = new Date()
    console.log(element.lastchange)
    if(element.lastchange!=undefined && element.channel!="General"){
      let elementTime = element.lastchange
      let verifTime = new Date(elementTime.getTime()+(1*60*1000))//1min
      console.log("element" + element.channel + ":")
      console.log(actualTime)
      console.log(elementTime)
      console.log(verifTime)  
      if(actualTime>verifTime){
        // delete in room
        let index = listRooms.indexOf(element.channel)
        console.log(index)
        listRooms.splice(index, 1)
        io.emit('/list', listRooms)
        console.log(listRoomsCreate)
        console.log(listRooms)
        let name = "Robot"
        let type = "robot"
        let date = actualTime
        let message = element.channel + " just delete because not followed enough"
        io.emit('message', { name, message, type, date })
        delete element.lastchange
        delete element.channel
      }
    } //else {
      //console.log("check ok")
    //}
  })
}
fn10sec();
setInterval(fn10sec, 10*1000);

io.on('connection', socket => {

  const listRoomsUser = []
  let error=null

  socket.on('/nick', login => {
    console.log("New user connected")
    let check = listUsers.includes(login)
    if(check==false){
      socket.user=login
      userName=login
      room = "General"
      socket.room = room
      socket.join(room)
      listRoomsUser.push(room)
      socket.emit('listRoomsUser', listRoomsUser)
      io.to(room).emit('actualRoom', room)
      io.emit('/list', listRooms)
      listUsers.push(login)
      io.to(room).emit('/users', listUsers)
      let name = "Robot"
      let type = "robot"
      let date = new Date().toLocaleString()
      let message = socket.user + " has just connected !"
      socket.broadcast.emit('message', { name, message, type, date})
      message = "Welcome home " + socket.user + ' !'
      socket.emit('message', { name, message, type, date })
      ///TEST///
      RoomUsers.forEach(element => {
        if(element.channel==room){
          let usersBefore = element.users
          element.users=usersBefore + ',' + socket.user
          io.emit('/roomUsers', RoomUsers)
        }
      });
      //////////      
    } else {
      let error = "pseudoExist"
      socket.emit('error_pseudo', error)
      let message = "Error : pseudo already use, restart appli"
      socket.emit('message', { message })
      }
  })

  // message
  socket.on('message', ({ name, message, type, actualRoom, date, roomMsg }) => {
    if(name!= '' && message!= ''){
      listDateRooms.forEach(function (element) {
        if(element.channel==actualRoom){
          element.lastchange = new Date()
          }
      })
      let roomMsg = "from '"+ socket.room + "'"
      io.to(actualRoom).emit('message', { name, message, type, date, roomMsg })
    }
  })


  // edit nick
  socket.on('/edit', ({ newName }) => {
    let check = listUsers.includes(newName)
    if(check==false){
      socket.user = newName
      socket.room = lastRoomUser
      socket.join(socket.room)
      listRoomsUser.push(room)
      socket.emit('listRoomsUser', listRoomsUser)
      io.to(socket.room).emit('actualRoom', socket.room)
      let name = "Robot"
      let type = "robot"
      let date = new Date().toLocaleString()
      let message = lastUserLeave + " has just changed his nickname to "+ newName + " !"
      socket.broadcast.emit('message', { name, message, type, date })
      message = "Welcome back " + newName + ' !'
      socket.emit('message', { name, message, type, date })
      listUsers.push(newName)
      io.to(socket.room).emit('/users', listUsers)
      io.emit('/list', listRooms)
      ///TEST///
      RoomUsers.forEach(element => {
        if(element.channel==room){
          let usersBefore = element.users
          element.users=usersBefore + ',' + socket.user
          io.emit('/roomUsers', RoomUsers)
        }
      });
      //////////          
    }
  })

  // create room
  socket.on('/create', (newRoom) => {
    if(error==null){
      let check = listRooms.includes(newRoom)
      if(check==false){
        var element ={}
        element.lastchange = new Date()
        element.channel = newRoom
        listDateRooms.push (element)
        listRooms.push(newRoom)
        var element ={}
        element.name = socket.user
        element.channel = newRoom
        listRoomsCreate.push (element)
        io.emit('/list', listRooms)
        socket.join(newRoom)
        listRoomsUser.push(newRoom)
        socket.emit('listRoomsUser', listRoomsUser)
        socket.room = newRoom
        io.to(socket.room).emit('actualRoom', socket.room)
        let name = "Robot"
        let type = "robot"
        let date = new Date().toLocaleString()
        let message = socket.user + " has just create "+ socket.room + " !"
        socket.broadcast.emit('message', { name, message, type, date })
        message = "You have moved to " + socket.room + ' !'
        socket.emit('message', { name, message, type, date })
        ///TEST///
        var element ={}
        element.channel = newRoom
        element.users = socket.user
        RoomUsers.push (element)
        io.emit('/roomUsers', RoomUsers)
        //////////      
      } else {
        let name = "Robot"
        let type = "robot"
        let date = new Date().toLocaleString()
        let message = "Channel " + newRoom + " already exists ! "
        socket.emit('message', { name, message, type, date })
      }
    }
  })

  
  // join room
  socket.on('/join', (room) => {
    let check = listRoomsUser.includes(room)
    if(check != true){
      listDateRooms.forEach(function (element) {
        if(element.channel==room){
          element.lastchange = new Date()
          }
      })
      socket.join(room)
      listRoomsUser.push(room)
      socket.emit('listRoomsUser', listRoomsUser)
      socket.room = room
      io.to(socket.room).emit('actualRoom', socket.room)
      let name = "Robot"
      let type = "robot"
      let date = new Date().toLocaleString()
      let message = socket.user + " is arrived on "+ socket.room + " channel !"
      io.to(socket.room).emit('message', { name, message, type, date })
      ///TEST///
      RoomUsers.forEach(element => {
        if(element.channel==room){
          let usersBefore = element.users
          element.users=usersBefore + ',' + socket.user
          io.emit('/roomUsers', RoomUsers)
        }
      });
      //////////          
    }
    else{
      let name = "Robot"
      let type = "robot"
      let date = new Date().toLocaleString()
      let message = "You are already join this channel"
      socket.emit('message', { name, message, type, date })
    }
  })

  
  // leave room
  socket.on('/part', (room) => {
    let check = listRoomsUser.includes(room)
    if(check==false){
      let name = "Robot"
      let type = "robot"
      let date = new Date().toLocaleString()
      let message = "You are not in the channel " + room + " ! "
      socket.emit('message', { name, message, type, date })
    } else {
      ///TEST///
      RoomUsers.forEach(element => {
        if(element.channel==room){
          let split = element.users.split(',')
          split.forEach(data => {
            if(data==socket.user){
              let index = split.indexOf(socket.user)
              split.splice(index, 1)    
            }
          let finalUsers = split.join()
          element.users=finalUsers
          });
        }
      });
      //////////                
      listDateRooms.forEach(function (elementTime) {
        if(elementTime.channel==room){
          elementTime.lastchange = new Date()
          }
      })
      listRoomsUser.forEach(element => { 
        if( element == room){
          let index = listRoomsUser.indexOf(element)
          listRoomsUser.splice(index, 1);    
          socket.leave(room)
          socket.room = "General"
          socket.emit('actualRoom', socket.room)
          io.emit('/roomUsers', RoomUsers)
          let name = "Robot"
          let type = "robot"
          let date = new Date().toLocaleString()
          let message = socket.user + " leave the channel " + room
          io.to(room).emit('message', { name, message, type, date })
          message = "You just left the channel " + room
          socket.emit('message', { name, message, type, date })
        }
      })
    }
    if(listRoomsUser.length <= 0){
      socket.room = "General"
      socket.join(socket.room)
      listRoomsUser.push(socket.room)
      socket.emit('listRoomsUser', listRoomsUser)
      io.to(socket.room).emit('actualRoom', socket.room)
      io.emit('/roomUsers', RoomUsers)
      let name = "Robot"
      let type = "robot"
      let date = new Date().toLocaleString()
      let message = socket.user + " is arrived on "+ socket.room + " !"
      socket.broadcast.emit('message', { name, message, type, date })
      message = "You have moved to " + socket.room + ' ! You must join one channel minimum'
      socket.emit('message', { name, message, type, date })
      }
  })

  // use room
  socket.on('/change', (room) => {
    let check = listRoomsUser.includes(room)
    if(check != false){
      socket.room = room
      io.to(room).emit('actualRoom', room)
      //TEST//
      io.emit('/roomUsers', RoomUsers)
      ////////
    } else {
      let name = "Robot"
      let type = "robot"
      let date = new Date().toLocaleString()
      let message = "You never joigned this channel..."
      socket.emit('message', { name, message, type, date })
    }
  })

  // delete room
  socket.on('/delete', (room) =>{
    listRoomsCreate.forEach(function (element) {
      if (element.name==socket.user && element.channel==room) {
        let index = listRooms.indexOf(element.channel)
        listRooms.splice(index, 1)
        io.emit('/list', listRooms)
        delete element.name
        delete element.channel
        let name = "Robot"
        let type = "robot"
        let date = new Date().toLocaleString()
        let message = socket.user + " delete the channel '" + room + "'"
        io.to('General').emit('message', { name, message, type, date })
        socket.room = "General"  
        io.to(socket.room).emit('actualRoom', socket.room)
        io.to(socket.room).emit('/roomUsers', RoomUsers)
      }
      /*else {
        let name = "Robot"
        let type = "robot"
        let date = time
        let message = "Sorry, you can only delete yours channels..."
        socket.emit('message', { name, message, type, date })
      }*/
    })
  })

  // edit room
  socket.on('/editRoom', ({room, newNameRoom}) => {
    listRoomsCreate.forEach(function (element) {
      if (element.name==socket.user && element.channel==room) {
        // list room à jour
        socket.leave(room)
        let index = listRooms.indexOf(element.channel)
        listRooms.splice(index, 1)
        listRooms.push(newNameRoom)
        io.emit('/list', listRooms)
        // list room create à jour
        delete element.name
        delete element.channel
        var element ={}
        element.name = socket.user
        element.channel = newNameRoom
        listRoomsCreate.push(element)
        var elementTime ={}
        elementTime.lastchange = new Date()
        elementTime.channel = newNameRoom
        listDateRooms.push (elementTime)
        // list room user à jour
        let index2 = listRoomsUser.indexOf(room)
        listRoomsUser.splice(index2, 1)
        listRoomsUser.push(newNameRoom)
        socket.emit('listRoomsUser', listRoomsUser)
        // list dat room
        console.log('ici : '+listDateRooms)
        socket.room = newNameRoom
        socket.join(newNameRoom)
        io.to(socket.room).emit('actualRoom', socket.room)
        let name = "Robot"
        let type = "robot"
        let date = new Date().toLocaleString()
        let message = socket.user + " restart the channel '" + room + "' for  '"+ newNameRoom+"'"
        io.emit('message', { name, message, type, date })
      }
      /*else {
        let name = "Robot"
        let type = "robot"
        let date = time
        let message = "Sorry, you can only edit yours channels..."
        socket.emit('message', { name, message, type, date })
      }*/
    })
  })




  socket.on('disconnect', () => {
    console.log("User disconnected")
    lastUserLeave = socket.user
    lastRoomUser = socket.room
    socket.emit('lastname', socket.user)
    let index = listUsers.indexOf(socket.user)
    listUsers.splice(index, 1);
    io.emit('/users', listUsers)
    let name = "Robot"
    let type = "robot"
    let date = new Date().toLocaleString()
    let message = socket.user + " has just disconnected !"
    socket.broadcast.emit('mzzessage', { name, message, type, date }) 
    ///TEST///
    RoomUsers.forEach(element => {
      if(element.channel=="General"){
        let split = element.users.split(',')
        split.forEach(data => {
          if(data==socket.user){
            let index = split.indexOf(socket.user)
            split.splice(index, 1)    
          }
        let finalUsers = split.join()
        element.users=finalUsers
        });
      }
      io.emit('/roomUsers', RoomUsers)
    });
    //////////                
  })
  
})

http.listen(4000, function() {
  console.log('listening on port 4000')
})