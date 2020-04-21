var websiteConfigurationString = "websiteConfigurations";
var siteURL = "https://raw.githubusercontent.com/aanbarasan/website-scripting/master";
var scriptPreText = "CustomScript_";
var scriptDataID = "";

function openOrFocusOptionsPage() {
    var optionsUrl = chrome.extension.getURL('options_page.html');
    chrome.tabs.query({}, function(extensionTabs) {
        var found = false;
        for (var i=0; i < extensionTabs.length; i++) {
            if (optionsUrl == extensionTabs[i].url) {
                found = true;
                console.log("tab id: " + extensionTabs[i].id);
                chrome.tabs.update(extensionTabs[i].id, {"selected": true});
            }
        }
        if (found == false) {
            chrome.tabs.create({url: "options_page.html"});
        }
    });
 }

function saveConfigurationButton()
{
    getStorageVariablesFromSync([websiteConfigurationString], function(result){
       var websiteConfiguration = result[websiteConfigurationString];
       if(!websiteConfiguration)
       {
            websiteConfiguration = {};
       }
       if(!websiteConfiguration.webList)
       {
            websiteConfiguration["webList"] = [];
       }
       var webList = websiteConfiguration.webList;
       var scriptData = document.getElementById("script-data-text-area").value;
       var scriptDataToStore = {};
       if(scriptDataID == "")
       {
            scriptDataID = Math.random() + "";
       }
       scriptDataToStore[scriptPreText + scriptDataID] = scriptData;
       var scriptFound = false;
       for(var i=0;i<webList.length;i++)
       {
            var thisWebConfiguration = webList[i];
            if(scriptDataID == thisWebConfiguration.id)
            {
                thisWebConfiguration.name = document.getElementById("web-script-name-input").value;
                thisWebConfiguration.urlRegEx = document.getElementById("page-url-show").value;
                thisWebConfiguration.enabled = document.getElementById("web-script-enabled-checkbox-input").checked;
                thisWebConfiguration.id = scriptDataID;
                scriptFound = true;
                break;
            }
       }
       if(scriptFound == false)
       {
            var thisWebConfiguration = {};
            thisWebConfiguration.name = document.getElementById("web-script-name-input").value;
            thisWebConfiguration.urlRegEx = document.getElementById("page-url-show").value;
            thisWebConfiguration.enabled = document.getElementById("web-script-enabled-checkbox-input").checked;
            thisWebConfiguration.id = scriptDataID;
            webList.push(thisWebConfiguration);
       }
       scriptDataToStore[websiteConfigurationString] = websiteConfiguration;
       console.log(scriptDataToStore)
       saveStorage(scriptDataToStore, function(){
            showToast("Saved successfully");
       });

   });
}

function init()
{
    chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
        let url = tabs[0].url;
        document.getElementById("page-url-show").value = url;
    });
    document.getElementById("ConfigurationButton").onclick = openOrFocusOptionsPage;
    document.getElementById("saveConfigurationButton").onclick = saveConfigurationButton;
}

init();