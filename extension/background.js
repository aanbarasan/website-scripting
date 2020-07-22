var chromeFunctions = new ChromeFunctionalities();

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
        chromeFunctions.getActiveConfigurations(tab.url, function(configurationList){
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
                chrome.tabs.executeScript(tabId, {file: "js/plugins/jquery-3.3.1.min.js"}, function() {
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
    var scriptId = chromeFunctions.scriptIdFromConfigId(configurationId);
    chromeFunctions.getStorageVariables([scriptId], function(result){
        var scriptData = result[scriptId];
        chrome.tabs.executeScript(tabId, {code: scriptData}, function() {
            // console.log("Script injected", configurationId, tabURL);
        });
    });
 }

 // Called when the user clicks on the browser action icon.
 chrome.browserAction.onClicked.addListener(function(tab) {
    // openOrFocusOptionsPage();
    chrome.tabs.create({url : "popup.html"});
 });


function init()
{
    chromeFunctions.updateDataOneTime(function(){});
}

init();