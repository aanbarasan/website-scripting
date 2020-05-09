
function init()
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
                innerContainer.onclick = previewScript;
                container.append(innerContainer);
            }
        }
        else
        {
            container.innerHTML = "<div>No script found. Add new script by click extension in same website. It will open a popup. Add you script and save it, then that will appear here</div>";
        }
    });
    document.getElementById("popupViewModalClose").onclick = function(){
        document.getElementById("popupViewModal").style.display = "none";
    }
}

function getSortedScript(callback){
    getStorageVariablesFromSync([websiteConfigurationString], function(result){
        var websiteConfiguration = result[websiteConfigurationString];
        if(websiteConfiguration && websiteConfiguration.webList && websiteConfiguration.webList.length > 0)
        {
            var configurationWebList = [];
            var webList = websiteConfiguration.webList;
            for(var i=0;i<webList.length;i++)
            {
                if(webList[i].customizedByOwn == true && webList[i].nature != true)
                {
                    configurationWebList.push(webList[i]);
                    webList.splice(i, 1);
                    i--;
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
            console.log(websiteConfiguration, configurationWebList);
            callback(configurationWebList);
        }
        else
        {
            callback();
        }
    })
}

function previewScript()
{
    var _this = this;
    var configurationId = this.getAttribute("configuration-id");
    getConfigurationForConfigurationId(configurationId, function(thisConfiguration){
        var scriptId = scriptPreText + configurationId;
        getStorageVariablesFromSync([scriptId], function(result){
            var scriptData = result[scriptId];
            console.log(scriptData);
            document.getElementById("popupViewModal").style.display = "block";
            document.getElementById("popupViewModalContent").value = scriptData;
            var modelName = thisConfiguration.name;
            if(thisConfiguration.purpose)
            {
                modelName = modelName + " (" + thisConfiguration.purpose + ")";
            }
            document.getElementById("popupViewModalName").innerHTML = modelName;
            document.getElementById("popupViewModalURL").innerHTML = thisConfiguration.urlRegEx;
        });
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
        getStorageVariablesFromSync([websiteConfigurationString], function(result){
            var websiteConfiguration = result[websiteConfigurationString];
            if(websiteConfiguration)
            {
                var webList = websiteConfiguration.webList;
                for(var i=0;i<webList.length;i++)
                {
                    if(webList[i].id == configurationId)
                    {
                        webList.splice(i, 1);
                        var data = {};
                        data[websiteConfigurationString] = websiteConfiguration;
                        saveStorage(data, function(){
                            _this.parentElement.remove();
                            showToast("Successfully deleted");
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
    getStorageVariablesFromSync([websiteConfigurationString], function(result){
        var websiteConfiguration = result[websiteConfigurationString];
        if(websiteConfiguration)
        {
            updateFeatureState(websiteConfiguration, configurationId, checkBoxCheckedStatus);
            var data = {};
            data[websiteConfigurationString] = websiteConfiguration;
            saveStorage(data, function(){
                var message = "";
                message = "'" + configurationName + "' script " + (checkBoxCheckedStatus ? "enabled" : "disabled")
                showToast(message);
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

function updateDataFromCloudFiles()
{
    updateDataFromCloud(function(){
        showToast("Saved successfully");
        init();
    });
}

function clearLocal()
{
    var data = {};
    data[websiteConfigurationString] = {};
    saveStorage(data, function(){
        showToast("Cleared successfully");
    });
    init();
}

init();
