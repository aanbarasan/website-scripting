var commonFunctions = new CommonFunctionalities();
var chromeFunctions = new ChromeFunctionalities();

function init()
{
    loadContainer();
    document.getElementById("popupViewModalClose").onclick = closeModalFunction;
    document.getElementById("popupSettingsModalClose").onclick = closeSettingsModalFunction;
    document.getElementById("cancelConfigurationButton").onclick = cancelConfigurationButton;
    document.getElementById("popup-update-reset-script-from-local-button").onclick = resetScriptFromLocal;
    document.getElementById("add-new-script-button").onclick = addNewScriptButton;
    document.getElementById("setting-popup-button").onclick = openSettingsModalButton;
    document.getElementById("restore-deleted-script-button").onclick = restoreDeletedScriptsButton;
    document.getElementById("edit-configuration-button").onclick = editButtonClick;
    document.onkeyup = detectEscapeKey;
}

function detectEscapeKey(evt) {

    evt = evt || window.event;
    var isEscape = false;
    if ("key" in evt) {
        isEscape = (evt.key === "Escape" || evt.key === "Esc");
    } else {
        isEscape = (evt.keyCode === 27);
    }

    if (isEscape) {
        document.getElementById("popupViewModal").style.display = "none";
        document.getElementById("popupEditorModule").style.display = "none";
        document.getElementById("popupSettingsModal").style.display = "none";
    }
}

function restoreDeletedScriptsButton(){
    chromeFunctions.restoreDeletedScripts(function(message){
        if(message == "success")
        {
            chromeFunctions.updateDataOneTime(function(){
                loadContainer();
                commonFunctions.showToast("Successfully restored");
            });
        }
    });
}

function openSettingsModalButton(){
    document.getElementById("popupSettingsModal").style.display = "block";
}

function closeModalFunction(){
    document.getElementById("popupViewModal").style.display = "none";
}

function closeSettingsModalFunction(){
    document.getElementById("popupSettingsModal").style.display = "none";
}

function cancelConfigurationButton(){
    document.getElementById("popupEditorModule").style.display = "none";
}

function loadContainer()
{
    document.getElementById("scripts-list-container").innerHTML = "";
    getSortedScript(function(configurationWebList){
        var container = document.getElementById("scripts-list-container");
        if(configurationWebList)
        {
            for(var i=0;i<configurationWebList.length;i++)
            {
                var thisConfiguration = configurationWebList[i];
                var nameTag = document.createElement("span");
                nameTag.innerHTML = thisConfiguration.name;
                nameTag.className = "nameTag";
                var checkBoxOption = document.createElement("input");
                checkBoxOption.type = "checkbox";
                checkBoxOption.className = "checkBoxOption";
                if(thisConfiguration.enabled == true)
                {
                    checkBoxOption.checked = true;
                }
                checkBoxOption.onclick = updateActiveStatusFromCheckBox;

                var innerContainer = document.createElement("div");
                innerContainer.append(checkBoxOption);
                innerContainer.append(nameTag);
                if(thisConfiguration.purpose)
                {
                    var purposeTag = document.createElement("span");
                    purposeTag.innerHTML = "(" + thisConfiguration.purpose + ")";
                    innerContainer.append(purposeTag);
                }
                innerContainer.setAttribute("configuration-id", thisConfiguration.id);
                innerContainer.className = "innerContainer";
                if(thisConfiguration.customizedByOwn == true)
                {
                    if(thisConfiguration.nature == true)
                    {
                        innerContainer.className = innerContainer.className + " natureCustomisedScriptBlock"
                    }
                    else
                    {
                        innerContainer.className = innerContainer.className + " ownCustomizationScriptBlock"
                    }
                }
                var deleteButton = document.createElement("button");
                deleteButton.innerText = "Delete";
                deleteButton.onclick = deleteConfiguration;
                innerContainer.append(deleteButton);
                innerContainer.onclick = previewScriptClick;
                container.append(innerContainer);
            }
        }
        else
        {
            container.innerHTML = "<div>No script found. Add new script by click extension in same website. It will open a popup. Add you script and save it, then that will appear here</div>";
        }
    });
}

function getSortedScript(callback){
    chromeFunctions.getConfigurationVariable(function(websiteConfiguration){
        if(websiteConfiguration && websiteConfiguration.webList && websiteConfiguration.webList.length > 0)
        {
            chromeFunctions.getDeletedConfiguration(function(deleteList){
                var configurationWebList = [];
                var webList = websiteConfiguration.webList;
                for(var i=webList.length - 1;i>=0;i--)
                {
                    if(webList[i].customizedByOwn == true && webList[i].nature != true)
                    {
                        configurationWebList.push(webList[i]);
                        webList.splice(i, 1);
                    }
                }
                for(var i=0;i<webList.length;i++)
                {
                    if(webList[i].customizedByOwn == true && webList[i].nature == true)
                    {
                        configurationWebList.push(webList[i]);
                        webList.splice(i, 1);
                        i--;
                    }
                }

                for(var i=0;i<webList.length;i++)
                {
                    configurationWebList.push(webList[i]);
                }
                var configList = removeDeleteListFromList(configurationWebList, deleteList);
                callback(configList);
            });
        }
        else
        {
            callback();
        }
    })
}

function removeDeleteListFromList(webList, deleteList)
{
    var configList = [];
    if(!deleteList)
    {
        deleteList = [];
    }
    for(var i=0;i<webList.length;i++)
    {
        if(deleteList.indexOf(webList[i].id) < 0)
        {
            configList.push(webList[i]);
        }
    }
    return configList;
}

function previewScriptClick()
{
    var configurationId = this.getAttribute("configuration-id");
    previewScript(configurationId);
}

function previewScript(configurationId)
{
    chromeFunctions.getSingleConfiguration(configurationId, function(thisConfiguration){
        if(!thisConfiguration)
        {
            thisConfiguration = {};
        }
        chromeFunctions.getScriptDataFromConfigurationId(thisConfiguration.id, function(scriptData){
            document.getElementById("popup-current-configuration-id").value = thisConfiguration.id;
            document.getElementById("popupViewModal").style.display = "block";
            document.getElementById("popupViewModalContent").value = scriptData;
            var modelName = thisConfiguration.name;
            if(thisConfiguration.purpose)
            {
                modelName = modelName + " (" + thisConfiguration.purpose + ")";
            }
            document.getElementById("popupViewModalName").innerHTML = modelName;
            document.getElementById("popupViewModalURL").innerHTML = thisConfiguration.urlRegEx;
            if(thisConfiguration.nature == true && thisConfiguration.customizedByOwn == true)
            {
                document.getElementById("popup-update-reset-script-from-local-button").style.display = "";
            }
            else
            {
                document.getElementById("popup-update-reset-script-from-local-button").style.display = "none";
            }
        });
    });
}

function resetScriptFromLocal()
{
    var _this = this;
    var configurationId = document.getElementById("popup-current-configuration-id").value;
    chromeFunctions.getSingleConfiguration(configurationId, function(thisConfiguration){
        if(thisConfiguration)
        {
            var r = confirm("Confirm to reset the script '" + thisConfiguration.name +"'");
            if (r == true) {
                chromeFunctions.getScriptDataFromLocalFile(configurationId, function(existingScriptDataForScriptId){
                    if(existingScriptDataForScriptId)
                    {
                        chromeFunctions.getSingleConfigurationFromLocalFile(configurationId, function(thisLocalConfiguration){
                            var savingConfiguration = {};
                            savingConfiguration.scriptData = existingScriptDataForScriptId;
                            savingConfiguration.scriptDataID = configurationId;
                            savingConfiguration.configurationName = thisConfiguration.name;
                            savingConfiguration.configurationPurpose = thisConfiguration.purpose;
                            savingConfiguration.configurationUrlRegex = thisConfiguration.urlRegEx;
                            savingConfiguration.configurationEnabled = thisConfiguration.enabled;
                            savingConfiguration.jqueryEnabled = thisConfiguration.jqueryEnabled;
                            if(thisLocalConfiguration)
                            {
                                savingConfiguration.configurationPurpose = thisLocalConfiguration.purpose;
                                savingConfiguration.configurationName = thisLocalConfiguration.name;
                                savingConfiguration.configurationUrlRegex = thisLocalConfiguration.urlRegEx;
                                savingConfiguration.jqueryEnabled = thisLocalConfiguration.jqueryEnabled;
                            }
                            chromeFunctions.saveThisConfiguration(savingConfiguration, function(){
                                   commonFunctions.showToast("Saved successfully");
                                   var configurationId = document.getElementById("popup-current-configuration-id").value;
                                   previewScript(configurationId);
                                   loadContainer();
                               });
                        })
                    }
                    else
                    {
                        commonFunctions.showToast("Local data not found");
                    }
                });
            }
        }
    });
}

function deleteConfiguration(event)
{
    event.stopPropagation();
    var _this = this;
    var configurationId = this.parentElement.getAttribute("configuration-id");
    var configurationName = _this.parentElement.getElementsByClassName("nameTag")[0].innerHTML;
    var r = confirm("Confirm to delete the script '" + configurationName +"'");
    if (r == true) {
        chromeFunctions.getConfigurationVariable(function(websiteConfiguration){
            if(websiteConfiguration)
            {
                var webList = websiteConfiguration.webList;
                for(var i=0;i<webList.length;i++)
                {
                    if(webList[i].id == configurationId)
                    {
                        webList.splice(i, 1);
                        var data = {};
                        data[chromeFunctions.websiteConfigurationString] = websiteConfiguration;
                        chromeFunctions.saveInStorage(data, function(){
                            _this.parentElement.remove();
                            chromeFunctions.addToDeletedConfiguration(configurationId);
                            commonFunctions.showToast("Successfully deleted");
                        });
                        break;
                    }
                }
            }
        });
    } else {
      txt = "You pressed Cancel!";
    }
}

function updateActiveStatusFromCheckBox(event)
{
    event.stopPropagation();
    var _this = this;
    var checkBoxCheckedStatus = this.checked
    var configurationId = this.parentElement.getAttribute("configuration-id");
    var configurationName = _this.parentElement.getElementsByClassName("nameTag")[0].innerHTML;
    chromeFunctions.getConfigurationVariable(function(websiteConfiguration){
        if(websiteConfiguration)
        {
            updateFeatureState(websiteConfiguration, configurationId, checkBoxCheckedStatus);
            var data = {};
            data[chromeFunctions.websiteConfigurationString] = websiteConfiguration;
            chromeFunctions.saveInStorage(data, function(){
                var message = "";
                message = "'" + configurationName + "' script " + (checkBoxCheckedStatus ? "enabled" : "disabled")
                commonFunctions.showToast(message);
            });
        }
    });
}

function updateFeatureState(websiteConfiguration, configId, booleanValue)
{
    for(var i=0;i<websiteConfiguration.webList.length;i++)
    {
        if(websiteConfiguration.webList[i].id == configId)
        {
            websiteConfiguration.webList[i].enabled = booleanValue;
        }
    }
}

function addNewScriptButton(){
    document.getElementById("popupEditorModule").style.display = "block";
    var editorFunctions = new EditorFunctionalities();
    editorFunctions.saveButtonCallback = function(){
        loadContainer();
    }
    editorFunctions.init();
    let title = "New script";
    let regexURL = "https://example.com";
    editorFunctions.loadNewConfiguration(title, regexURL);
}

function editButtonClick(){
    var configurationId = document.getElementById("popup-current-configuration-id").value;
    document.getElementById("popupViewModal").style.display = "none";
    document.getElementById("popupEditorModule").style.display = "block";
    var editorFunctions = new EditorFunctionalities();
    editorFunctions.saveButtonCallback = function(){
        loadContainer();
    }
    editorFunctions.init();
    chromeFunctions.getSingleConfiguration(configurationId, function(thisConfiguration){
        if(thisConfiguration)
        {
            chromeFunctions.getScriptDataFromConfigurationId(thisConfiguration.id, function(scriptData){
                thisConfiguration.scriptData = scriptData;
                editorFunctions.loadContainer(thisConfiguration);
            });
        }
    });

}

init();
