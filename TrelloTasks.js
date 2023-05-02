// This code uses the 'node-fetch' library:
// https://www.npmjs.com/package/node-fetch
// to install type 'npm install node-fetch' in TERMINAL
// You need to authorize this  
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const APIKey = '27cad8cea54c62466b830df4135f11dc';
//const APIToken = 'You need to authorize this app in trello by visiting this url: https://trello.com/1/authorize?expiration=never&boards=30pWOrL1&scope=read,account&response_type=token&key=27cad8cea54c62466b830df4135f11dc Then past APIToken from trello here';//const APIToken = 'You need to authorize this app in trello by visiting this url: https://trello.com/1/authorize?expiration=never&boards=30pWOrL1&scope=read,account&response_type=token&key=27cad8cea54c62466b830df4135f11dc Then past APIToken from trello here'; 
const boardId = '30pWOrL1';
const neededLabel = '';//'To the next call';
const neededList = ['Discussed ✔', 'Prepared for discuss'];
let lineNum =0;

var checklists = {};
var memberName = '';
var cards = {};
var lists = {};

fetch('https://api.trello.com/1/members/me/' + '?key=' + APIKey + '&token=' + APIToken, {
  method: 'GET'
})
  .then(response => response.text())
  .then(async text => { 
    memberName = '@' + JSON.parse(text).username; 
    await fetchLists();
    await fetchCards(); 
    await fetchChkLists(); 
  })
  .catch(err => console.error(err));

async function fetchLists() {
  try {
    const response = await fetch('https://api.trello.com/1/boards/' + boardId + '/lists/?key=' + APIKey + '&token=' + APIToken, {
      method: 'GET'
    });
    const text = await response.text();
    return parseLists(text);
  } catch (err) {
    return console.error(err);
  }

}

async function fetchCards() {
  try {
    const response = await fetch('https://api.trello.com/1/boards/' + boardId + '/cards/?key=' + APIKey + '&token=' + APIToken, {
      method: 'GET'
    });
    const text = await response.text();
    return parseCards(text);
  } catch (err) {
    return console.error(err);
  }
}
async function fetchChkLists() {
  try {
    const response = await fetch('https://api.trello.com/1/boards/' + boardId + '/checklists/?key=' + APIKey + '&token=' + APIToken, {
      method: 'GET'
    });
    const text = await response.text();
    return parseResponse(text);
  } catch (err) {
    return console.error(err);
  }
}
function parseCards(responseTXT) {
  const cardstmp = JSON.parse(responseTXT);
  cardstmp.forEach(card => {
    card.labels.forEach(label => card.labels[label.name] = label)
    cards[card.id] = card;
  })
};
function parseLists(responseTXT) {
  const liststmp = JSON.parse(responseTXT);
  liststmp.forEach(list => {
    lists[list.id] = list;
  })
};

function parseResponse(responseTXT) {
  const checklists = JSON.parse(responseTXT);
  checklists.forEach(list => {
    list.checkItems.forEach(item => {
      if (item.state == 'incomplete' && item.name.substr(0, memberName.length) == memberName) {
        if (neededList == '' || neededList.includes(lists[cards[list.idCard].idList].name)) {
          if (neededLabel == '' || cards[list.idCard].labels[neededLabel] != undefined) {
            console.log(++lineNum +': '+ cards[list.idCard].name + ' ' + cards[list.idCard].shortUrl + ' ' + cards[list.idCard].desc + '\n');
          }
        }
      }
    })
  });
}