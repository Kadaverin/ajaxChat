(function () {
  const messagesEndpoint = "http://localhost:3000/api/messages/last/100"
  const usersEndpoint = "http://localhost:3000/api/users"
  const logoutEndpoint = "http://localhost:3000/logout"
  const userList = document.getElementById('users-list');
  const messageList = document.getElementById('msg-list')
  const sendMsgForm = document.getElementById('send-msg-form')
  const selectDirectTab = document.getElementById('input-nickname-tab')
  const usersListTab = document.getElementById('users-list-tab');
  const msgInput = document.getElementById('btn-input');

  const appState = {
    usersArr: [],
    selectedNickForDirectMsg: null
  }



  selectDirectTab.addEventListener('click', handleSelectNickForDirect);
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


   function handleMsgInput() {
    let usrWantsSendDirectMsgRegExp = /@(.*)/
    let matched = this.value.match(usrWantsSendDirectMsgRegExp)
    if (matched) {
      let partOfNick = substractNickFromString(matched[0])
      let nickRegExp = new RegExp(partOfNick, 'i')

      matchedUsers = appState.usersArr.filter(user => {
        return nickRegExp.test(user.nickname)
      })

      handleShowSelectDirectTab(matchedUsers, partOfNick)

    } else hideSelectDirectTab()
  }

  function substractNickFromString(str) {
    return str.includes(" ") ? str.slice(1, str.indexOf(' ')) : str.slice(1)
  }


  function handleShowSelectDirectTab(usersThatMatchedToInput, searchPattern){
    switch (usersThatMatchedToInput.length) {
        case 1:
          {
            if (usersThatMatchedToInput[0].nickname === searchPattern) {
              hideSelectDirectTab();
            } else {
              showUsersForDirectMsg(usersThatMatchedToInput);
            }
            break;
          }
        case 0:
          {
            hideSelectDirectTab();
            appState.selectedNickForDirectMsg = null;
            break;
          }
        default: showUsersForDirectMsg(usersThatMatchedToInput);
      }
  }

  function hideSelectDirectTab(){
    selectDirectTab.style.display = 'none';
  }

  function handleSelectNickForDirect() {
    if (event.target.classList.contains('content')) {
      appState.selectedNickForDirectMsg = event.target.children[1].innerText.slice(1);
    } else if (event.target.tagName = 'SPAN') {
      appState.selectedNickForDirectMsg = event.target.parentNode.children[1].innerText.slice(1);
    } else return;

    insertSelectedNickIntoMsgInput()
    hideSelectDirectTab();
    msgInput.focus();
  }

  function insertSelectedNickIntoMsgInput(){
    let text = msgInput.value;
    let startIndex = text.indexOf('@');
    let spaceIndex = text.indexOf(" ", startIndex);
    if (spaceIndex === -1) {
      text = text.replace(text.slice(startIndex), "@" + appState.selectedNickForDirectMsg);
    } else {
      text = text.replace(text.substr(startIndex, spaceIndex), "@" + appState.selectedNickForDirectMsg);
    }
    msgInput.value = text;
  }

  function showUsersForDirectMsg(matchedUsers) {
    appState.selectedNickForDirectMsg = null;
    usersListTab.innerHTML = ``
    matchedUsers.forEach(user => {
      li = createUserLiNode(user)
      usersListTab.appendChild(li)
    })
    selectDirectTab.style.display = 'block'
  }



  function handleSendMessage() {
    event.preventDefault();
    let text = msgInput.value.trim();
    let receiverNick = null;
    if (appState.selectedNickForDirectMsg) {
      text = text.replace(`@${appState.selectedNickForDirectMsg}`, '')
      receiverNick = appState.selectedNickForDirectMsg
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
            let prevScrollPos = messageList.scrollTop;
            let shouldScroll = (messageList.scrollTop + messageList.clientHeight === messageList.scrollHeight);
            messageList.innerHTML = '';

            for (let i = msgs.length - 1 ; i >= 0; i--) {
              let li = createMsgLiNode(msgs[i]);
              messageList.appendChild(li);
            }

            handleScrollMsgList(shouldScroll, prevScrollPos);
          })
      })
      .catch(err => {
        console.log(err)
      })
  }

  function handleScrollMsgList(shouldScroll,prevScrollPos) {
    messageList.scrollTop = shouldScroll ? messageList.scrollHeight : prevScrollPos;
  }

  function createMsgLiNode(msgObj, position) {
    let li = document.createElement('li')
    li.classList.add('clearfix')
    let msgBodyClass = '';
    if (msgObj.receiverNick == currentUser.nickname) {
      msgBodyClass = 'msg-for-current-user'
    }
    li.innerHTML = `  
                  <div class="chat-body clearfix ${msgBodyClass} ">
                      <div class="header">
                          <strong class="primary-font">${ msgObj.senderName } (@${ msgObj.senderNick })</strong> 
                          <small class="pull-right text-muted">
                              <span class="glyphicon glyphicon-time"></span>
                              ${ (new Date(msgObj.createdAt))}
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
            appState.usersArr = users;
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


























 

//     function createSelectUserListItem(userObj) {
//     // <i class="fa fa-circle" aria-hidden="true" style='color: green'></i>
//     let li = document.createElement('li');
//     li.classList.add('select-user-item');
//     li.innerHTML = ` 
//             <div class="content">
//                 <span class="name">${ userObj.name }</span>
//                 <span class = 'nick'>@${ userObj.nickname }</span>
//             </div>
//         `;
//     return li;
//   }


