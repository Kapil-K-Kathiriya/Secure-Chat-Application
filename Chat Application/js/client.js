const socket = io('http://localhost:8000'); 

// socket.on('connect', () => {
//     console.log('Connected to server');
//   });


const form = document.getElementById('send-container')
const messageInput = document.getElementById('messageInp')
if(messageInput=='')
{
    prompt('Please enter some message...')
}
const messageContainer = document.querySelector('.container')
let audio = new Audio('tin.mp3');

//fucntion wich will append event to the container
const append=function(message,position){
    const messageElement  = document.createElement('div')
    messageElement.innerText=message;
    messageElement.classList.add('message')
    messageElement.classList.add(position)
    messageContainer.append(messageElement)
    if(position=='left')
    {
        audio.play();
    }
}

//ask new user for his/her name and let the server know
const  name1 = prompt("Enter your name to join !!!");
socket.emit('new-user-joined', name1);
 
//if a new user joins, recieve his name from the server
socket.on('user-joined',name=>{
    append(`${name} joined the chat`,'right')
})

//if server sends a message, revieve it
socket.on('receive', data=>{
    append(`${data.name} : ${data.message}`,'left')
})

//if a user leaves the chat, append the infot to the container
socket.on('left', name=>{
    append(`${name} left the chat !!!`,'left')
})

//if the from gets submitted, send server the message
form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`,'right')
    socket.emit('send',message)
    messageInput.value = '' 
})

