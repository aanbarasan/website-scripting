import { ChromeFunctionalities } from "./js/ChromeFunctionalities.js";

var chromeFunctions = new ChromeFunctionalities();

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
     if(changeInfo.status == "complete") {
        chromeFunctions.getActiveConfigurations(tab.url, function(configurationList){
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
                chrome.tabs.executeScript(tabId, {file: "js/plugins/jquery-3.6.0.min.js"}, function() {
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
        // chrome.scripting.executeScript(tabId, {code: scriptData}, function() {});
        // chromeFunctions.executeScript(tabId, scriptData, function(){console.error("Done");});
    });
 }

chrome.action.onClicked.addListener(function(tab) {
    chrome.tabs.create({url : "popup.html"});
});


function init()
{
    chromeFunctions.updateDataOneTime(function(){});
    chromeFunctions.registerAllScripts();
}

init();