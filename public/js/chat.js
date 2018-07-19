(function () {
  const messagesEndpoint = "http://localhost:3000/api/messages/last/100"
  const usersEndpoint = "http://localhost:3000/api/users"
  const logoutEndpoint = "http://localhost:3000/logout"
  const userList = document.getElementById('users-list');
  const messageList = document.getElementById('msg-list')
  const sendMsgForm = document.getElementById('send-msg-form')
  const inputNickTab = document.getElementById('input-nickname-tab')
  const usersListTab = document.getElementById('users-list-tab');
  const msgInput = document.getElementById('btn-input');
  let selectedNickForDirectMsg = null;
  let usersArr = []
  let prevScrollPos = null;

  inputNickTab.addEventListener('click', handleSelectNickForDirect);
  msgInput.addEventListener('input', handleMsgInput);
  sendMsgForm.addEventListener('submit', handleSendMessage);
  userList.addEventListener('click', handleSelectNickForDirect);
  document.getElementById('logout-btn').addEventListener('click' , logout)

  function logout(){
    console.log('fetch')
    fetch(logoutEndpoint ,  { credentials: 'same-origin' })
    .then(res => {
      window.location = res.url
    })
  }


  function handleSelectNickForDirect() {
    if (event.target.classList.contains('content')) {
      selectedNickForDirectMsg = event.target.children[1].innerText.slice(1);
    } else if (event.target.tagName = 'SPAN') {
      selectedNickForDirectMsg = event.target.parentNode.children[1].innerText.slice(1);
    } else return;

    let text = msgInput.value;
    let startIndex = text.indexOf('@');
    let spaceIndex = text.indexOf(" ", startIndex);
    if (spaceIndex === -1) {
      text = text.replace(text.slice(startIndex), "@" + selectedNickForDirectMsg);
    } else {
      text = text.replace(text.substr(startIndex, spaceIndex), "@" + selectedNickForDirectMsg);
    }
    msgInput.value = text;
    inputNickTab.style.display = 'none';
    msgInput.focus();
  }

  function createUserLiNode(userObj) {
    let li = document.createElement('li');
    li.classList.add('user-item');
    li.innerHTML = ` 
            <div class="content">
                <span class="name">${ userObj.name }</span>
                <span class = 'nick'>@${ userObj.nickname }</span>
            </div>
        `;
    return li;
  }


  function handleShowUsersForDirectMsg(matchedUsers) {
    selectedNickForDirectMsg = null;
    usersListTab.innerHTML = ``
    matchedUsers.forEach(user => {
      li = createUserLiNode(user)
      usersListTab.appendChild(li)
    })
    inputNickTab.style.display = 'block'
  }

  function substractNickFromString(str) {
    return str.includes(" ") ? str.slice(1, str.indexOf(' ')) : str.slice(1)
  }

  function handleMsgInput() {
    let usrWantsSendDirectMsgRegExp = /@(.*)/
    let matched = this.value.match(usrWantsSendDirectMsgRegExp)
    if (matched) {
      let partOfNick = substractNickFromString(matched[0])
      let nickRegExp = new RegExp(partOfNick, 'i')

      matchedUsers = usersArr.filter(user => {
        return nickRegExp.test(user.nickname)
      })
      switch (matchedUsers.length) {
        case 1:
          {
            if (matchedUsers[0].nickname == partOfNick) {
              inputNickTab.style.display = 'none'
            } else {
              handleShowUsersForDirectMsg(matchedUsers)
            }
            break
          }
        case 0:
          {
            inputNickTab.style.display = 'none'
            selectedNickForDirectMsg = null;
            break
          }
        default:
          {
            handleShowUsersForDirectMsg(matchedUsers)
          }
      }
    } else inputNickTab.style.display = 'none'
  }


  function handleSendMessage() {
    event.preventDefault();
    let text = msgInput.value.trim();
    let receiverNick = null;
    if (selectedNickForDirectMsg) {
      text = text.replace(`@${selectedNickForDirectMsg}`, '')
      receiverNick = selectedNickForDirectMsg
    }
    if (!text) return;

    fetch('http://localhost:3000/api/messages/', {
      method: 'POST',
      body: JSON.stringify({
        text: text,
        senderNick: currentUser.nickname,
        senderName: currentUser.name,
        receiverNick: receiverNick
      }),
      headers: {
        "Content-Type": "application/json",
      }
    })

    msgInput.value = '';
  }

  function fetchMessages() {
    fetch(messagesEndpoint)
      .then(data => {
        data.json()
          .then(msgs => {
            prevScrollPos = messageList.scrollTop;
            let shouldScroll = (messageList.scrollTop + messageList.clientHeight === messageList.scrollHeight);
            messageList.innerHTML = '';

            for (let i = 0; i < msgs.length; i++) {
              let pos = (i % 2 == 0) ? 'left' : 'right';
              let li = createMsgLiNode(msgs[i], pos);
              messageList.appendChild(li);
            }

            handleScrollMsgList(shouldScroll);
          })
      })
      .catch(err => {
        console.log(err)
      })
  }

  function handleScrollMsgList(shouldScroll) {
    messageList.scrollTop = shouldScroll ? messageList.scrollHeight : prevScrollPos;
  }

  function createMsgLiNode(msgObj, position) {
    let li = document.createElement('li')
    li.classList.add(position, 'clearfix')
    let msgBodyClass = '';
    if (msgObj.receiverNick == currentUser.nickname) {
      msgBodyClass = 'msg-for-current-user'
    }
    li.innerHTML = `  
                  <div class="chat-body clearfix ${msgBodyClass} ">
                      <div class="header">
                          <strong class="primary-font">${ msgObj.senderName }(${ msgObj.senderNick })</strong> 
                          <small class="pull-right text-muted">
                              <span class="glyphicon glyphicon-time"></span>
                              ${ (new Date(msgObj.createdAt)).toUTCString() }
                          </small>
                      </div>
                      <p>${ msgObj.text }</p>
                  </div>
              `;
    return li;
  }

  function fetchUsers() {
    fetch(usersEndpoint)
      .then(res => {
        res.json()
          .then(users => {
            usersArr = users;
            userList.innerHTML = ``;

            for (let i = 0; i < users.length; i++) {
              let li = createUserLiNode(users[i])
              userList.appendChild(li)
            }
          })
      })
      .catch(err => {
        console.log(err)
      })

  }

  function updateData() {
    fetchMessages();
    fetchUsers();
  }

  updateData();

  setInterval(() => {
    updateData();
  }, 500)

})()