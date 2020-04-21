
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
                thisWebConfiguration.purpose = document.getElementById("web-script-purpose-text").value;
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
            thisWebConfiguration.purpose = document.getElementById("web-script-purpose-text").value;
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
        var thisTab = tabs[0];
        let url = thisTab.url;
        urlMatchCallbackScript(url, function(thisConfiguration){
            console.log(thisConfiguration);
            if(thisConfiguration)
            {
                scriptDataID = thisConfiguration.id;
                document.getElementById("web-script-name-input").value = thisConfiguration.name;
                document.getElementById("page-url-show").value = thisConfiguration.urlRegEx;
                document.getElementById("web-script-purpose-text").value = thisConfiguration.purpose;
                document.getElementById("web-script-enabled-checkbox-input").checked = (thisConfiguration.enabled == true) ? true : false;
                var scriptIdUrl = scriptPreText + scriptDataID;
                getStorageVariablesFromSync([scriptIdUrl], function(result){
                    var scriptData = result[scriptIdUrl];
                    if(typeof scriptData == "string")
                    {
                        document.getElementById("script-data-text-area").value = scriptData;
                    }
                });
            }
            else
            {
                let title = thisTab.title;
                document.getElementById("page-url-show").value = url;
                document.getElementById("web-script-name-input").value = title;
                document.getElementById("web-script-enabled-checkbox-input").checked  = false;
                document.getElementById("web-script-purpose-text").value = "Script added";
            }
        });
    });
    document.getElementById("ConfigurationButton").onclick = openOrFocusOptionsPage;
    document.getElementById("saveConfigurationButton").onclick = saveConfigurationButton;
}

init();