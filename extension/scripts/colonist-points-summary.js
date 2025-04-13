var observer = new MutationObserver(function( mutations ) {
  if(mutations && mutations.length > 0)
  {
    for(var i = 0;i< mutations.length;i++)
    {
       var mut = mutations[i];
       var nodes = mut.addedNodes;
       var textContent = processMutation(nodes);
       console.log(textContent);
       updateData(textContent);
       printJson();
       printInView();
    }
  }
});

var gameLogDivision= document.getElementById("game-log-text");
observer.observe(gameLogDivision, {childList: true, subtree: false, attributes: false, characterData: false});

function processMutation(nodes)
{
  var para = document.createElement("p");
  for(var j=0;j<nodes.length;j++)
  {
    var node = nodes[j];
    var cloneNode = node.cloneNode(true);
    var imageReplaced = recursiveReplaceImage(cloneNode);
    para.appendChild(imageReplaced);
  }
  return para.textContent;
}

function recursiveReplaceImage(node)
{
  if(node instanceof HTMLImageElement)
  {
    return replaceImage(node);
  }
  else if(node instanceof HTMLParagraphElement)
  {
    if(node.children && node.children.length > 0)
    {
      for(var i=0;i<node.children.length;i++)
      {
        var child = node.children[i];
        var cloneChild = child.cloneNode();
        var replacedChild = replaceImage(cloneChild);
        node.replaceChild(replacedChild, child);
      }
    }
  }
  return node;
}

function replaceImage(node)
{
  if(node instanceof HTMLImageElement && node.src)
  {
    var src = node.src;
    var spanTag = document.createElement("span");
    if(src.indexOf("images/icon") > -1)
    {
      spanTag.innerText ="icon_player ";
      return spanTag;
    }
    else if(src.indexOf("images/card") > -1)
    {
      var splitText = src.split("images/")[1];
      var splitText2 = splitText.split(".svg")[0];
      spanTag.innerText = splitText2;
      return spanTag;
    }
    else if(src.indexOf("images/road") > -1)
    {
      var splitText = src.split("images/")[1];
      var splitText2 = splitText.split(".svg")[0];
      spanTag.innerText = splitText2;
      return spanTag;
    }
    else if(src.indexOf("images/settlement") > -1)
    {
      var splitText = src.split("images/")[1];
      var splitText2 = splitText.split(".svg")[0];
      spanTag.innerText = splitText2;
      return spanTag;
    }
    else if(src.indexOf("images/city") > -1)
    {
      var splitText = src.split("images/")[1];
      var splitText2 = splitText.split(".svg")[0];
      spanTag.innerText = splitText2;
      return spanTag;
    }
  }
  return node;
}

// "icon_player Jane#2248 got: card_grain"
function updateData(textContent)
{

 if(textContent.indexOf("icon_player ") > -1)
 {
   if(textContent.indexOf(" rolled:") > -1)
   {
     diceRolled();
   }
   if(textContent.indexOf(" got:") > -1)
   {
     var splitText = textContent.split("icon_player ")[1];
     var username = splitText.split(" got:")[0];
     var cardstext = textContent.split(" got:")[1];
     gotCards(username, cardstext);
   }
   if(textContent.indexOf(" discarded:") > -1)
   {
      var splitText = textContent.split("icon_player ")[1];
      var username = splitText.split(" discarded:")[0];
      var cardstext = textContent.split(" discarded:")[1];
      discardCards(username, cardstext);
   }
   else if(textContent.indexOf(" bought ") > -1)
   {
     var splitText = textContent.split("icon_player ")[1];
     var username = splitText.split(" bought ")[0];
     var cardstext = textContent.split(" bought ")[1];
     if(cardstext.indexOf("card_devcard") > -1)
     {
        boughtDevCard(username);
     }
   }
   else if(textContent.indexOf(" built a ") > -1)
   {
     var splitText = textContent.split("icon_player ")[1];
     var username = splitText.split(" built a ")[0];
     var cardstext = textContent.split(" built a ")[1];
     if(cardstext.indexOf("road") > -1)
     {
        buildRoad(username);
     }
     else if(cardstext.indexOf("settlement") > -1)
     {
        buildSettlement(username);
     }
     else if(cardstext.indexOf("city") > -1)
     {
        buildCity(username);
     }
   }
   else if(textContent.indexOf(" gave bank:") > -1)
   {
     var splitText = textContent.split("icon_player ")[1];
     var username = splitText.split(" gave bank:")[0];
     var cardstext = textContent.split(" gave bank:")[1];
     var gavebankcards = cardstext.split(" and took")[0];
     var tookcards = textContent.split(" and took")[1];

     tradeWithBank(username, gavebankcards, tookcards);
   }
   else if(textContent.indexOf(" wants to give:") > -1)
   {
     var splitText = textContent.split("icon_player ")[1];
     var username = splitText.split(" wants to give:")[0];
     var cardstext = textContent.split(" wants to give:")[1];
     var wantsToGive = cardstext.split("for: ")[0];
     var toGetCard = textContent.split("for: ")[1];

     saveWantsToGiveCard(username, wantsToGive, toGetCard);
   }
   else if(textContent.indexOf(" traded with:") > -1)
   {
     var splitText = textContent.split("icon_player ")[1];
     var username = splitText.split(" traded with:")[0];
     var tradedUser = textContent.split(" traded with:")[1];

     tradedWithOffer(username, tradedUser);
   }
   else if(textContent.indexOf(" stole card_rescardback from:") > -1)
   {
     var splitText = textContent.split("icon_player ")[1];
     var username = splitText.split(" stole card_rescardback from:")[0];
     var stolenUser = textContent.split(" stole card_rescardback from:")[1];

     steelACard(username, stolenUser);
   }
 }
}

var wantsToGiveArray = [];

function diceRolled()
{
  wantsToGiveArray = [];
  resetSuspectList();
}

function saveWantsToGiveCard(username, wantsToGive, toGetCard)
{
  var dt = {username: username, wantsToGive:wantsToGive, toGetCard:toGetCard};
  wantsToGiveArray.push(dt);
}

function tradedWithOffer(username, tradedUser)
{
  var tradedOffer = wantsToGiveArray.pop();
  discardCards(username, tradedOffer.wantsToGive);
  gotCards(username, tradedOffer.toGetCard);
  discardCards(tradedUser, tradedOffer.toGetCard);
  gotCards(tradedUser, tradedOffer.wantsToGive);
}

function steelACard(username, stolenUser)
{
   var userdata = getUser(username);
   incrementOneCard(userdata, "unknown_card");
   decrementTheStolenCard(stolenUser);
}

var suspectList = [];
function decrementTheStolenCard(stolenUser)
{
   decrementOneCard(getUser(stolenUser), "unknown_card");
   var zerocards = getZeroCardsList(stolenUser);
   var suspect = {zerocards: zerocards, username:stolenUser, count: 1};
   suspectList.push(suspect);
}

function getZeroCardsList(username)
{
  var zerocards = [];
   addWhenNotZeroFound(zerocards, username, "card_lumber");
   addWhenNotZeroFound(zerocards, username, "card_brick");
   addWhenNotZeroFound(zerocards, username, "card_wool");
   addWhenNotZeroFound(zerocards, username, "card_grain");
   addWhenNotZeroFound(zerocards, username, "card_ore");
   return zerocards;
}

function addWhenNotZeroFound(zerocards, username, card)
{
  var count = getOneCardCount(username, card);
  if(count > 0)
  {
      zerocards.push(card);
  }
}

function resetSuspectList()
{
   for(var i=0;i<suspectList.length;i++)
   {
      var suspect = suspectList[i];
      var zerocards = suspect.zerocards;
      for(var j=0;j<zerocards.length;j++)
      {
         if(getCard(getUser(suspect.username), zerocards[j]) <= 0)
         {
           zerocards.splice(j, 1);
           j--;
         }
      }
      if(zerocards.length == 1)
      {
         decrementOneCard(getUser(suspect.username), zerocards[0]);
         incrementOneCard(getUser(suspect.username), "unknown_card");
         suspectList.splice(i, 1);
         i--;
      }
      if(zerocards.length <= 0)
      {
           updateCard(getUser(suspect.username), "unknown_card", 0);
           suspectList.splice(i, 1);
           i--;
      }
   }
    var keylist = Object.keys(data);
    for(var i=0;i<keylist.length;i++)
    {
       var key = keylist[i];
       var dt = data[key];
       var zerocards = getZeroCardsList(key);
       if(zerocards.length == 0)
       {
         updateCard(getUser(key), "unknown_card", 0);
       }
    }
}

function tradeWithBank(username, gavebankcards, tookcards)
{
   discardCards(username, gavebankcards);
   gotCards(username, tookcards);
}

function gotCards(username, cardstext)
{
   var userdata = getUser(username);
   var cards = cardstext.trim();
   var cardlist = cards.split(" ");
   for(var i=0;i<cardlist.length;i++)
   {
     var card = cardlist[i];
     incrementOneCard(userdata, card);
   }
}

function discardCards(username, cardstext)
{
  var userdata = getUser(username);
  var cards = cardstext.trim();
  var cardlist = cards.split(" ");
  for(var i=0;i<cardlist.length;i++)
  {
    var card = cardlist[i];
    decrementOneCard(userdata, card);
  }
}

function buildRoad(username)
{
   var userdata = getUser(username);
   decrementOneCard(userdata, "card_lumber");
   decrementOneCard(userdata, "card_brick");
}

function buildSettlement(username)
{
   var userdata = getUser(username);
   decrementOneCard(userdata, "card_lumber");
   decrementOneCard(userdata, "card_brick");
   decrementOneCard(userdata, "card_wool");
   decrementOneCard(userdata, "card_grain");
}

function buildCity(username)
{
   var userdata = getUser(username);
   decrementOneCard(userdata, "card_grain");
   decrementOneCard(userdata, "card_grain");
   decrementOneCard(userdata, "card_ore");
   decrementOneCard(userdata, "card_ore");
   decrementOneCard(userdata, "card_ore");
}

function boughtDevCard(username)
{
   var userdata = getUser(username);
   decrementOneCard(userdata, "card_wool");
   decrementOneCard(userdata, "card_grain");
   decrementOneCard(userdata, "card_ore");
}

function decrementOneCard(userdata, card)
{
  var count = getCard(userdata, card);
  var decrement = count - 1;
  if(decrement < 0)
  {
    if(card != "unknown_card")
    {
      decrement = 0;
      decrementOneCard(userdata, "unknown_card");
    }
  }
  updateCard(userdata, card, decrement);
}

function incrementOneCard(userdata, card)
{
  var count = getCard(userdata, card);
  var increase = count + 1;
  updateCard(userdata, card, increase);
}

var data = {};
function getUser(username)
{
  var usernametrim = username.trim();
  var userdata = data[usernametrim];
  if(typeof userdata != "object")
   {
      userdata = {};
      data[usernametrim] = userdata;
   }
   return userdata;
}

function getCard(userdata, card)
{
  var usercards = userdata["cards"];
  if(typeof usercards != "object")
   {
      usercards = {};
      userdata["cards"] = usercards;
   }

   var carddata = usercards[card];
   if(typeof carddata != "number")
   {
      carddata = 0;
      usercards[card] = carddata;
   }
   return carddata;
}

function getTotalCards(username)
{
  var sum = 0;
  sum = sum + getOneCardCount(username, "card_lumber");
  sum = sum + getOneCardCount(username, "card_brick");
  sum = sum + getOneCardCount(username, "card_wool");
  sum = sum + getOneCardCount(username, "card_grain");
  sum = sum + getOneCardCount(username, "card_ore");
  sum = sum + getOneCardCount(username, "unknown_card");
  return sum
}

function getOneCardCount(username, card)
{
  var userdata = getUser(username);
  return getCard(userdata, card);
}

function updateCard(userdata, card, count)
{
  var usercards = userdata["cards"];
  if(typeof usercards != "object")
   {
      usercards = {};
      userdata["cards"] = usercards;
   }

   usercards[card] = count;
}

function printJson()
{
  console.log(JSON.stringify(data));
}


function printInView()
{
   var tablebody = document.getElementById("mirror-cards-counter-tbody")
   if(!tablebody)
   {
      var view = document.createElement("div");
      view.id = "mirror-cards-counter";
      view.setAttribute("style", "position: fixed;top: 200px;width: 199px;height: 160px;z-index: 100;"
                  + "background: white;border: 2px solid grey;");
      var table = document.createElement("table");
      table.style.width = "100%"
      var thead = document.createElement("thead");
      var row = document.createElement("tr");
      row.innerHTML = "<th>Name</th>"
                  + "<th><img src='../dist/images/card_lumber.svg?v90.2' alt='wool' height='20' width='14.25' class='lobby-chat-text-icon'></th>"
                  + "<th><img src='../dist/images/card_brick.svg?v90.2' alt='wool' height='20' width='14.25' class='lobby-chat-text-icon'></th>"
                  + "<th><img src='../dist/images/card_wool.svg?v90.2' alt='wool' height='20' width='14.25' class='lobby-chat-text-icon'></th>"
                  + "<th><img src='../dist/images/card_grain.svg?v90.2' alt='wool' height='20' width='14.25' class='lobby-chat-text-icon'></th>"
                  + "<th><img src='../dist/images/card_ore.svg?v90.2' alt='wool' height='20' width='14.25' class='lobby-chat-text-icon'></th>";
      thead.appendChild(row);
      tablebody = document.createElement("tbody");
      tablebody.id = "mirror-cards-counter-tbody";
      table.appendChild(thead);
      table.appendChild(tablebody);
      view.appendChild(table);
      document.body.appendChild(view);
   }
   tablebody.innerHTML = "";
   var datamap = data;
   var keylist = Object.keys(datamap);
   for(var i=0;i<keylist.length;i++)
   {
      var key = keylist[i];
      var dt = datamap[key];
      var tr = document.createElement("tr");
      var name = document.createElement("td");
      var firstColoum = key + " (" + getTotalCards(key) + ")";
      name.innerHTML = firstColoum;
      tr.appendChild(name);
      var cards = dt.cards;
      if(cards)
      {
         createTableData(tr, cards, "card_lumber");
         createTableData(tr, cards, "card_brick");
         createTableData(tr, cards, "card_wool");
         createTableData(tr, cards, "card_grain");
         createTableData(tr, cards, "card_ore");
      }
      tablebody.appendChild(tr);
   }

}

function createTableData(tr, cards, cardName)
{
  var td = document.createElement("td");
  if(typeof cards[cardName] == "number")
  {
      td.innerHTML = cards[cardName];
  }
  else
  {
    td.innerHTML = "-";
  }
  tr.appendChild(td);
}
