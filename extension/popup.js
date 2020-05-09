
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
            websiteConfiguration = {"webList":[]};
       }
       if(!websiteConfiguration.webList)
       {
            websiteConfiguration.webList = [];
       }
       console.log(websiteConfiguration)
       var webList = websiteConfiguration.webList;
       var scriptData = document.getElementById("script-data-text-area").value;
       var scriptDataToStore = {};
       if(scriptDataID == "")
       {
            scriptDataID = Math.random() + "";
       }
       scriptIdUrl = scriptPreText + scriptDataID;
       scriptDataToStore[scriptIdUrl] = scriptData;

       scriptDataFromFile(scriptDataID, function(existingScriptDataForScriptId){
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
                    if(typeof existingScriptDataForScriptId == "string")
                    {
                        var differentValue = compareText(scriptData, existingScriptDataForScriptId);
                        console.log(differentValue)
                        if(differentValue)
                        {
                            thisWebConfiguration.customizedByOwn = false;
                        }
                        else
                        {
                            thisWebConfiguration.customizedByOwn = true;
                        }
                    }
                    else
                    {
                        thisWebConfiguration.customizedByOwn = true;
                    }
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
                thisWebConfiguration.customizedByOwn = true;
                webList.push(thisWebConfiguration);
           }
           scriptDataToStore[websiteConfigurationString] = websiteConfiguration;
           console.log(scriptDataToStore);
           saveStorage(scriptDataToStore, function(){
                showToast("Saved successfully");
           });
       });
   });
}

function compareText(oldText, newText)
{
    console.log(oldText);
    console.log(newText);
    var oldTextArray = oldText.split("\n");
    var newTextArray = newText.split("\n");
    if(oldTextArray.length != newTextArray.length)
    {
        return false;
    }
    for(var i=0;i<oldTextArray.length,i<newTextArray.length;i++)
    {
        if(oldTextArray[i].valueOf().trim() != newTextArray[i].valueOf().trim())
        {
            return false;
        }
    }
    return true;
}

function scriptDataFromFile(scriptId, callback)
{
    getStorageVariablesFromSync([websiteConfigurationString], function(result){
       var websiteConfiguration = result[websiteConfigurationString];
       var webList = websiteConfiguration.webList;
       if(websiteConfiguration && websiteConfiguration.webList)
       {
          for(var i=0;i<webList.length;i++)
          {
               var thisWebConfiguration = webList[i];
               if(scriptId == thisWebConfiguration.id)
               {
                    getScriptDataFromLocalFile(thisWebConfiguration.fileName, function(scriptData){
                        callback(scriptData);
                    })
                    return;
               }
           }
       }
       callback();
    })
}

function checkScriptChanges(scriptDataID, scriptData)
{
    var ownCustomisedBoolean = true;
    var scriptIdUrl = scriptPreText + scriptDataID;
    getStorageVariablesFromSync([scriptIdUrl], function(result){
        var scriptData = result[scriptIdUrl];
        if(typeof scriptData == "string")
        {
            document.getElementById("script-data-text-area").value = scriptData;
        }
    });
    return ownCustomisedBoolean;
}

function init()
{
    chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
        var thisTab = tabs[0];
        let url = thisTab.url;
        urlMatchCallbackScript(url, function(thisConfiguration){
            if(thisConfiguration)
            {
                scriptDataID = thisConfiguration.id;
                document.getElementById("web-script-name-input").value = thisConfiguration.name;
                document.getElementById("page-url-show").value = thisConfiguration.urlRegEx;
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
                console.log(thisTab)
                let title = thisTab.title;
                var regexURL = getRegexForURL(url);
                document.getElementById("page-url-show").value = regexURL;
                document.getElementById("web-script-name-input").value = title;
                document.getElementById("web-script-enabled-checkbox-input").checked  = true;
                document.getElementById("script-data-text-area").value = "// Add your script here to run in this page.\n\nconsole.log(\"Testing javascript\");";
            }
        });
    });
    document.getElementById("ConfigurationButton").onclick = openOrFocusOptionsPage;
    document.getElementById("saveConfigurationButton").onclick = saveConfigurationButton;
}

function getRegexForURL(url){
    var regexUrl = url;
    regexUrl = regexUrl.replace("https://www", "https:(.*)").replace("http://www", "http:(.*)");
    regexUrl = regexUrl.replace("https://", "https:(.*)").replace("http://", "http:(.*)");
    regexUrl = regexUrl.split("/")[0];
    regexUrl = regexUrl + "(.*)";
    return regexUrl;
}

init();