var commonFunctions = new CommonFunctionalities();
var chromeFunctions = new ChromeFunctionalities();
var editorFunctions = new EditorFunctionalities();

function init()
{
    chromeInternationalization();
    document.getElementById("ConfigurationButton").onclick = configurationButtonClick;
    document.getElementById("add-new-script-button").onclick = addNewScriptButton;
    document.getElementById("run-code-on-page-button").onclick = runCodeOnThisPage;
    document.getElementById("select-option-for-different-script").onchange = selectButtonChanged;
    editorFunctions.init();

    chromeFunctions.getCurrentTabConfigurations(function(configurationResultList, thisTab){
        // console.log(configurationResultList);
        var initConfiguration = {};
        if(configurationResultList.length > 0)
        {
            var selectOptions = document.getElementById("select-option-for-different-script");
            selectOptions.innerHTML = "";
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
                editorFunctions.loadContainer(initConfiguration);
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


function chromeInternationalization()
{
    updateLocalizationClassElements("editor-name-header-block", "nameHeader");
    updateLocalizationClassElements("checkbox-label-active", "active");
    updateLocalizationById("saveConfigurationButton", "save");
    updateLocalizationClassElements("url-regex-header-block", "urlRegexHeader");
    updateLocalizationById("include-libraries-span", "includeLibraries");
    updateLocalizationById("run-code-on-page-button", "run");
    updateLocalizationById("select-script-label", "selectScriptHeader");
    updateLocalizationById("add-new-script-button", "addNewScript");
    updateLocalizationById("ConfigurationButton", "configurationPage");
}

function getLocalizeText(id, text)
{
    var content = chrome.i18n.getMessage(id);
    var result = (content && content != "") ? content : text;
    return result;
}

function updateLocalizationById(id, localId)
{
    var text = chrome.i18n.getMessage(localId);
    if(text && text != "")
    {
        var elem = document.getElementById(id);
        if(elem)
        {
            elem.innerHTML = text;
        }
    }
}

function updateLocalizationClassElements(className, localId)
{
    var elements = document.getElementsByClassName(className);
    var text = chrome.i18n.getMessage(localId);
    if(text && text != "" && elements && elements.length > 0)
    {
        for(var i=0;i<elements.length;i++)
        {
            elements[i].innerHTML = text;
        }
    }
}

function configurationButtonClick()
{
    chromeFunctions.openOrFocusOptionsPage(function(){
        window.close();
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
            if(commonFunctions.isMatchRegex(urlRegEx, tabURL))
            {
                // console.log(thisTab);
                var scriptData = document.getElementById("script-data-text-area").value;
                var jqueryEnabled = document.getElementById("enable-jquery-checkbox-input").checked;
                if(jqueryEnabled == true)
                {
                    chromeFunctions.executeScriptWithJquery(thisTab.id, scriptData, function() {
                        var mess = getLocalizeText("executedSuccessfully", "Executed successfully");
                        commonFunctions.showToast(mess+"..", "secondary");
                    });
                }
                else
                {
                    chromeFunctions.executeScript(thisTab.id, scriptData, function() {
                        var mess = getLocalizeText("executedSuccessfully", "Executed successfully..");
                        commonFunctions.showToast(mess, "secondary");
                    });
                }
            }
            else
            {
                var mess = getLocalizeText("urlNotMatchWithActiveTab", "URL regex not match with current active tab");
                commonFunctions.showToast(mess, "danger");
            }
        }
        else
        {
            var mess = getLocalizeText("noActiveTabFound", "No active tab found");
            commonFunctions.showToast(mess, "warning");
        }
    });
}

function addNewScriptButton(){
   chromeFunctions.getTitleAndUrlOfLastWindow(function(title, url){
        var selectOptions = document.getElementById("select-option-for-different-script");
        var optionsLength = selectOptions.children.length;
        title = title + "(" + optionsLength + ")";
        let regexURL = editorFunctions.getRegexForURL(url);
        editorFunctions.loadNewConfiguration(title, regexURL);
        var newOption = document.createElement( 'option' );
        newOption.value = editorFunctions.configurationId;
        newOption.text = title;
        selectOptions.add(newOption);
        selectOptions.value = editorFunctions.configurationId;
   });
}

function selectButtonChanged()
{
    // console.log("selectButtonChanged called")
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
    chromeFunctions.getSingleConfiguration(configurationId, function(thisConfiguration){
        if(thisConfiguration)
        {
            chromeFunctions.getScriptDataFromConfigurationId(thisConfiguration.id, function(scriptData){
                thisConfiguration.scriptData = scriptData;
                editorFunctions.loadContainer(thisConfiguration);
            });
        }
        else
        {
            chromeFunctions.getTitleAndUrlOfLastWindow(function(title, url){
                let regexURL = editorFunctions.getRegexForURL(url);
                editorFunctions.loadNewConfiguration(configurationName, regexURL);
            });
        }
    });
}

init();