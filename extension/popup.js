
var scriptDataID = "";

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
                // console.log(configurationResultList);
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
                    // console.log(thisTab);
                    if(scriptDataID == "")
                    {
                        scriptDataID = Math.random() + "";
                    }
                    let title = thisTab.title;
                    var regexURL = getRegexForURL(url);
                    document.getElementById("page-url-show").value = regexURL;
                    document.getElementById("web-script-name-input").value = title;
                    document.getElementById("web-script-enabled-checkbox-input").checked  = true;
                    document.getElementById("enable-jquery-checkbox-input").checked  = false;
                    document.getElementById("script-data-text-area").value = "// Add your script here to run in this page.\n\nconsole.log(\"Testing JavaScript\");";
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
    document.getElementById("run-code-on-page-button").onclick = runCodeOnThisPage;
    document.getElementById("libraries-open-button").onclick = function(){
        if(document.getElementById("libraries-container").style.display == "none")
        {
            document.getElementById("libraries-container").style.display = "block";
        }
        else
        {
            document.getElementById("libraries-container").style.display = "none";
        }
    }
}

function runCodeOnThisPage()
{
    getCurrentActiveOrLastFocusedWindows(function(tabs){
        if(tabs && tabs.length>0)
        {
            var thisTab = tabs[0];
            var tabURL = thisTab.url;
            var urlRegEx = document.getElementById("page-url-show").value;
            if(matchURL(tabURL, urlRegEx))
            {
                console.log(thisTab);
                var scriptData = document.getElementById("script-data-text-area").value;
                var jqueryEnabled = document.getElementById("enable-jquery-checkbox-input").checked;
                if(jqueryEnabled == true)
                {
                    chrome.tabs.executeScript(thisTab.id, {file: "js/jquery-3.3.1.min.js"}, function() {
                        chrome.tabs.executeScript(thisTab.id, {code: scriptData}, function() {
                            showToast("Executed successfully..", "secondary");
                        });
                    });
                }
                else
                {
                    chrome.tabs.executeScript(thisTab.id, {code: scriptData}, function() {
                        showToast("Executed successfully", "secondary");
                    });
                }
            }
            else
            {
                showToast("URL regex not match with current active tab", "danger");
            }
        }
        else
        {
            showToast("No active tab found", "warning");
        }
    });
}

function addNewScriptButton(){
   getCurrentActiveOrLastFocusedWindows(function(tabs){
       if(tabs && tabs.length>0)
       {
            var thisTab = tabs[0];
            var selectOptions = document.getElementById("select-option-for-different-script");
            let url = thisTab.url;
            let title = thisTab.title;
            var optionsLength = selectOptions.children.length;
            title = title + "(" + optionsLength + ")";
            scriptDataID = Math.random() + "";
            var regexURL = getRegexForURL(url);
            document.getElementById("page-url-show").value = regexURL;
            document.getElementById("web-script-name-input").value = title;
            document.getElementById("web-script-enabled-checkbox-input").checked  = true;
            document.getElementById("enable-jquery-checkbox-input").checked  = false;
            document.getElementById("script-data-text-area").value = "// Add your script here to run in this page.\n\nconsole.log(\"Testing javascript\");";
            var newOption = document.createElement( 'option' );
            newOption.value = scriptDataID;
            newOption.text = title;
            selectOptions.add(newOption);
            selectOptions.value = scriptDataID;
       }
   });
}

function selectButtonChanged()
{
    console.log("selectButtonChanged called")
    var selectOptions = document.getElementById("select-option-for-different-script");
    var configurationName;
    var configurationId = selectOptions.value;
    var childrenList = selectOptions.children;
    for(var i=0;i<childrenList.length;i++)
    {
        if(childrenList[i].value == configurationId)
        {
            configurationName = childrenList[i].text;
        }
    }
    getConfigurationForConfigurationId(configurationId, function(thisConfiguration){
        loadContainer(thisConfiguration, configurationName, configurationId);
    });
}

function loadContainer(thisConfiguration, configurationName, configurationId)
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
                // console.log(thisTab);
                let url = thisTab.url;
                let title = thisTab.title;
                scriptDataID = configurationId;
                var regexURL = getRegexForURL(url);
                document.getElementById("page-url-show").value = regexURL;
                if(configurationName)
                {
                    document.getElementById("web-script-name-input").value = configurationName;
                }
                else
                {
                    document.getElementById("web-script-name-input").value = title;
                }
                document.getElementById("web-script-enabled-checkbox-input").checked  = true;
                document.getElementById("enable-jquery-checkbox-input").checked  = false;
                document.getElementById("script-data-text-area").value = "// Add your script here to run in this page.\n\nconsole.log(\"Testing JavaScript\");";
           }
       });
    }
}

function getRegexForURL(url){
    var urlObject = new URL(url);
    console.log(urlObject);
    var regexUrl = urlObject.origin + "(.*)";
    return regexUrl;
}

init();