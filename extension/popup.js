var chromeFunctions = new ChromeFunctionalities();
var editorFunctions = new EditorFunctionalities();

function init()
{
    document.getElementById("ConfigurationButton").onclick = chromeFunctions.openOrFocusOptionsPage;
    document.getElementById("add-new-script-button").onclick = addNewScriptButton;
    document.getElementById("run-code-on-page-button").onclick = runCodeOnThisPage;
    document.getElementById("select-option-for-different-script").onchange = selectButtonChanged;
    editorFunctions.init();

    chromeFunctions.getCurrentTabConfigurations(function(configurationResultList, thisTab){
        console.log(configurationResultList);
        var initConfiguration = {};
        if(configurationResultList.length > 0)
        {
            var selectOptions = document.getElementById("select-option-for-different-script");
            for(var i=0;i<configurationResultList.length;i++)
            {
                var thisConfiguration = configurationResultList[i];
                var newOption = document.createElement( 'option' );
                newOption.value = thisConfiguration.id;
                newOption.text = thisConfiguration.name;
                selectOptions.add(newOption);
            }
            selectOptions.value = configurationResultList[0].id;
            initConfiguration = configurationResultList[0];
            chromeFunctions.getScriptDataFromConfigurationId(initConfiguration.id, function(scriptData){
                initConfiguration.scriptData = scriptData;
                chromeFunctions.loadContainer(initConfiguration);
            });
        }
        else
        {
            let title = thisTab.title;
            let regexURL = editorFunctions.getRegexForURL(thisTab.url);
            editorFunctions.loadNewConfiguration(title, regexURL);
            var selectOptions = document.getElementById("select-option-for-different-script");
            selectOptions.innerHTML = "<option selected value=\""+editorFunctions.configurationId+"\">"+title+"</option>";
        }
    });
}

function runCodeOnThisPage()
{
    chromeFunctions.getCurrentActiveOrLastFocusedWindows(function(tabs){
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
                    chromeFunctions.executeScriptWithJquery(thisTab.id, scriptData, function() {
                        showToast("Executed successfully..", "secondary");
                    });
                }
                else
                {
                    chromeFunctions.executeScript(thisTab.id, scriptData, function() {
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
   chromeFunctions.getTitleAndUrlOfLastWindow(function(title, url){
        var selectOptions = document.getElementById("select-option-for-different-script");
        var optionsLength = selectOptions.children.length;
        title = title + "(" + optionsLength + ")";
        let regexURL = getRegexForURL(url);
        chromeFunctions.loadNewConfiguration(title, regexURL);
        var newOption = document.createElement( 'option' );
        newOption.value = scriptDataID;
        newOption.text = title;
        selectOptions.add(newOption);
        selectOptions.value = scriptDataID;
   });
}

function selectButtonChanged()
{
    console.log("selectButtonChanged called")
    var selectOptions = document.getElementById("select-option-for-different-script");
    var configurationId = selectOptions.value;
    var childrenList = selectOptions.children;
    for(var i=0;i<childrenList.length;i++)
    {
        if(childrenList[i].value == configurationId)
        {
            configurationName = childrenList[i].text;
        }
    }
    chromeFunctions.getConfigurationForConfigurationId(configurationId, function(thisConfiguration){
        if(thisConfiguration)
        {
            loadContainer(thisConfiguration);
        }
        else
        {
            chromeFunctions.getTitleAndUrlOfLastWindow(function(title, url){
                let regexURL = getRegexForURL(url);
                chromeFunctions.loadNewConfiguration(configurationName, regexURL);
            });
        }
    });
}

init();