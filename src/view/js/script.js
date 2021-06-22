let myData = {}

      async function getIP(){
        const response = await fetch('https://ipgeolocation.abstractapi.com/v1/?api_key=c3729ec5fd8e411e80702895e1dd60d6')
        let data = await response.json()
        console.log(data)
        if(response){
          myData = {
                      'ip': data.ip_address,
                      'city': data.city,
                      'country': data.country,
                      'flag': data.flag.emoji
                    }
        }

        document.getElementById('myIp').innerHTML = `<small>My IP : ${myData.ip}</small>`
      }

      getIP()

      let chats
      let socket = io()

      let messages = document.getElementById('messages');
      let form = document.getElementById('form');
      let input = document.getElementById('input');

      form.addEventListener('submit', function(e) {
          e.preventDefault();
          if (input.value) {
              let data = {
                  content: input.value,
                  ip: myData.ip
              }
              socket.emit('get chat', data);
              input.value = '';
          }
      });

      function render(){
          let todoChat = ''

          for(i = 0; i < chats.length; i++){
            let content = chats[i].content
            let ip = chats[i].ip
            let name = chats[i].name
            let newChat = `<div class="chat">
                                <span class="ip-content">${ip}</span><br>
                                <span class="content">${content}</span>
                            </div>`;
            todoChat = todoChat + newChat
          }

          messages.innerHTML = todoChat
          window.scrollTo(0, document.body.scrollHeight);
      }

      socket.on('all chat', function(msg) {
        chats = msg
        render()
        console.log(msg)
      });

      socket.on('count user', function(count) {
          document.getElementById('countUser').innerText = `Visitor: ${count}`
      });