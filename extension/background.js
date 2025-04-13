import { ChromeFunctionalities } from "./js/ChromeFunctionalities.js";

var chromeFunctions = new ChromeFunctionalities();

chrome.action.onClicked.addListener(function(tab) {
    chrome.tabs.create({url : "popup.html"});
});

function init()
{
    chromeFunctions.updateDataOneTime(function(){});
    chromeFunctions.registerAllScripts();
}

init();