
function openOrFocusOptionsPage() {
    var optionsUrl = chrome.extension.getURL('options_page.html'); 
    chrome.tabs.query({}, function(extensionTabs) {
       var found = false;
       for (var i=0; i < extensionTabs.length; i++) {
          if (optionsUrl == extensionTabs[i].url) {
             found = true;
             // console.log("tab id: " + extensionTabs[i].id);
             chrome.tabs.update(extensionTabs[i].id, {"active": true});
          }
       }
       if (found == false) {
           chrome.tabs.create({url: "options_page.html"});
       }
    });
 }

 chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
     if(changeInfo.status == "complete") {
        // console.log(tabId, changeInfo, tab);
        getActiveUrlMatchCallbackScript(tab.url, function(configurationList){
            // console.log(configurationList);
            var isJqueryEnabled = false;
            for(var i=0;i<configurationList.length;i++)
            {
                if(configurationList[i].jqueryEnabled == true)
                {
                    isJqueryEnabled = true;
                }
            }
            if(isJqueryEnabled == true)
            {
                chrome.tabs.executeScript(tabId, {file: "js/jquery-3.3.1.min.js"}, function() {
                    executeConfigurationOfList(configurationList, tabId, tab.url);
                });
            }
            else
            {
                executeConfigurationOfList(configurationList, tabId, tab.url);
            }
        });
     }
 });

 function executeConfigurationOfList(configurationList, tabId, tabURL)
 {
    for(var i=0;i<configurationList.length;i++)
    {
        executeScript(configurationList[i].id, tabId, tabURL);
    }
 }

 function executeScript(configurationId, tabId, tabURL)
 {
    var scriptId = scriptPreText + configurationId;
    getStorageVariablesFromSync([scriptId], function(result){
        var scriptData = result[scriptId];
        chrome.tabs.executeScript(tabId, {code: scriptData}, function() {
            // console.log("Script injected", configurationId, tabURL);
        });
    });
 }


/* chrome.extension.onConnect.addListener(function(port) {
   var tab = port.sender.tab;
   // This will get called by the content script we execute in
   // the tab as a result of the user pressing the browser action.
   port.onMessage.addListener(function(info) {
     var max_length = 1024;
     if (info.selection.length > max_length)
       info.selection = info.selection.substring(0, max_length);
       openOrFocusOptionsPage();
   });
 });*/
 
 // Called when the user clicks on the browser action icon.
 chrome.browserAction.onClicked.addListener(function(tab) {
    // openOrFocusOptionsPage();
    chrome.tabs.create({url : "popup.html"});
 });


function init()
{
    updateDataOneTime(function(){});
}

init();