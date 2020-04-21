
function init()
{
    document.getElementById("scripts-list-container").innerHTML = "";
    getStorageVariablesFromSync([websiteConfigurationString], function(result){
        var websiteConfiguration = result[websiteConfigurationString];
        var container = document.getElementById("scripts-list-container");
        if(websiteConfiguration && websiteConfiguration.webList && websiteConfiguration.webList.length > 0)
        {
            for(var i=0;i<websiteConfiguration.webList.length;i++)
            {
                var thisConfiguration = websiteConfiguration.webList[i];
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
                var purposeTag = document.createElement("span");
                purposeTag.innerHTML = "(" + thisConfiguration.purpose + ")";
                var innerContainer = document.createElement("div");
                innerContainer.append(checkBoxOption);
                innerContainer.append(nameTag);
                innerContainer.append(purposeTag);
                innerContainer.setAttribute("configuration-id", thisConfiguration.id);
                innerContainer.className = "innerContainer";
                var previewButton = document.createElement("button");
                previewButton.innerText = "Preview";
                previewButton.onclick = previewScript;
                var deleteButton = document.createElement("button");
                deleteButton.innerText = "Delete";
                deleteButton.onclick = deleteConfiguration;
                innerContainer.append(deleteButton);
                innerContainer.append(previewButton);
                container.append(innerContainer);
            }
        }
        else
        {
            container.innerHTML = "<div>No script found. Add new script by click extension in same website. It will open a popup. Add you script and save it, then that will appear here</div>";
        }
    });
    document.getElementById("saveDataButton").onclick = saveData;
    document.getElementById("updateDataFromCloudButton").onclick = updateDataFromCloudFiles;
    document.getElementById("clearLocalButton").onclick = clearLocal;
    document.getElementById("popupViewModalClose").onclick = function(){
        document.getElementById("popupViewModal").style.display = "none";
    }
}

function previewScript()
{
    var _this = this;
    var configurationId = this.parentElement.getAttribute("configuration-id");
    var scriptId = scriptPreText + configurationId;
    getStorageVariablesFromSync([scriptId], function(result){
        var scriptData = result[scriptId];
        console.log(scriptData);
        document.getElementById("popupViewModal").style.display = "block";
        document.getElementById("popupViewModalContent").value = scriptData;
        document.getElementById("popupViewModalTitle").innerHTML = _this.parentElement.getElementsByClassName("nameTag")[0].innerHTML;
    });
}

function deleteConfiguration()
{
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
                            showToast("Saved successfully");
                        })
                        break;
                    }
                }
            }
        });
    } else {
      txt = "You pressed Cancel!";
    }
}

function saveData()
{
    getStorageVariablesFromSync([websiteConfigurationString], function(result){
        var websiteConfiguration = result[websiteConfigurationString];
        if(websiteConfiguration)
        {
            var container = document.getElementById("scripts-list-container");
            var innerContainerList = container.children;
            for(var i=0;i<innerContainerList.length;i++)
            {
                var innerContainer = innerContainerList[i];
                var inputTag = innerContainer.getElementsByTagName("input")[0];
                var configId = innerContainer.getAttribute("configuration-id");
                if(inputTag.checked)
                {
                    updateFeatureState(websiteConfiguration, configId, true);
                }
                else
                {
                    updateFeatureState(websiteConfiguration, configId, false);
                }
            }
            var data = {};
            data[websiteConfigurationString] = websiteConfiguration;
            saveStorage(data, function(){
                showToast("Saved successfully");
                init();
            })
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
