
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
    var scriptData = document.getElementById("script-data-text-area").value;
    var configurationPurpose = null;
    var configurationName = document.getElementById("web-script-name-input").value;
    var configurationUrlRegex = document.getElementById("page-url-show").value;
    var configurationEnabled = document.getElementById("web-script-enabled-checkbox-input").checked;
    var jqueryEnabled = document.getElementById("enable-jquery-checkbox-input").checked;
    var callback = function(){
        showToast("Saved successfully");
    }
    saveConfigurationForOneData(scriptData, scriptDataID, configurationName, configurationPurpose, configurationUrlRegex, configurationEnabled, jqueryEnabled, callback);
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
    getCurrentActiveOrLastFocusedWindows(function(tabs){
        if(tabs)
        {
            var thisTab = tabs[0];
            let url = thisTab.url;
            urlMatchCallbackScript(url, function(configurationResultList){
                console.log(configurationResultList);
                if(configurationResultList.length > 0)
                {
                    var optionList = "";
                    for(var i=0;i<configurationResultList.length;i++)
                    {
                        var thisConfiguration = configurationResultList[i];
                        var selected = "";
                        if(i == 0)
                        {
                            selected = "selected";
                        }
                        optionList = optionList + "<option "+ selected +" value=\""+ thisConfiguration.id +"\">" + thisConfiguration.name + "</option>";
                    }
                    var selectOptions = document.getElementById("select-option-for-different-script");
                    selectOptions.innerHTML = optionList;
                    selectOptions.onchange = selectButtonChanged;
                    loadContainer(configurationResultList[0]);
                }
                else
                {
                    console.log(thisTab);
                    if(scriptDataID == "")
                    {
                        scriptDataID = Math.random() + "";
                    }
                    let title = thisTab.title;
                    var regexURL = getRegexForURL(url);
                    document.getElementById("page-url-show").value = regexURL;
                    document.getElementById("web-script-name-input").value = title;
                    document.getElementById("web-script-enabled-checkbox-input").checked  = true;
                    document.getElementById("enable-jquery-checkbox-input").checked  = true;
                    document.getElementById("script-data-text-area").value = "// Add your script here to run in this page.\n\nconsole.log(\"Testing javascript\");";
                    var selectOptions = document.getElementById("select-option-for-different-script");
                    selectOptions.innerHTML = "<option selected value=\""+scriptDataID+"\">"+title+"</option>";
                    selectOptions.onchange = selectButtonChanged;
                }
            });
        }
    });
    document.getElementById("ConfigurationButton").onclick = openOrFocusOptionsPage;
    document.getElementById("saveConfigurationButton").onclick = saveConfigurationButton;
    document.getElementById("add-new-script-button").onclick = addNewScriptButton;
}

function addNewScriptButton(){
   getCurrentActiveOrLastFocusedWindows(function(tabs){
       if(tabs)
       {
            var thisTab = tabs[0];
            console.log(thisTab);
            let url = thisTab.url;
            let title = thisTab.title;
            scriptDataID = Math.random() + "";
            var regexURL = getRegexForURL(url);
            document.getElementById("page-url-show").value = regexURL;
            document.getElementById("web-script-name-input").value = title;
            document.getElementById("web-script-enabled-checkbox-input").checked  = true;
            document.getElementById("enable-jquery-checkbox-input").checked  = true;
            document.getElementById("script-data-text-area").value = "// Add your script here to run in this page.\n\nconsole.log(\"Testing javascript\");";
            var selectOptions = document.getElementById("select-option-for-different-script");
            selectOptions.innerHTML = selectOptions.innerHTML + "<option selected value=\""+scriptDataID+"\">"+title+"</option>";
       }
   });
}

function selectButtonChanged()
{
    console.log("selectButtonChanged called")
    var selectOptions = document.getElementById("select-option-for-different-script");
    var configurationId = selectOptions.value;
    getConfigurationForConfigurationId(configurationId, function(thisConfiguration){
        loadContainer(thisConfiguration, configurationId);
    });
}

function loadContainer(thisConfiguration, configurationId)
{
    if(thisConfiguration)
    {
        scriptDataID = thisConfiguration.id;
        document.getElementById("web-script-name-input").value = thisConfiguration.name;
        document.getElementById("page-url-show").value = thisConfiguration.urlRegEx;
        document.getElementById("web-script-enabled-checkbox-input").checked = thisConfiguration.enabled;
        document.getElementById("enable-jquery-checkbox-input").checked = thisConfiguration.jqueryEnabled;
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
        getCurrentActiveOrLastFocusedWindows(function(tabs){
           if(tabs)
           {
                var thisTab = tabs[0];
                console.log(thisTab);
                let url = thisTab.url;
                let title = thisTab.title;
                scriptDataID = configurationId;
                var regexURL = getRegexForURL(url);
                document.getElementById("page-url-show").value = regexURL;
                document.getElementById("web-script-name-input").value = title;
                document.getElementById("web-script-enabled-checkbox-input").checked  = true;
                document.getElementById("enable-jquery-checkbox-input").checked  = true;
                document.getElementById("script-data-text-area").value = "// Add your script here to run in this page.\n\nconsole.log(\"Testing javascript\");";
           }
       });
    }
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