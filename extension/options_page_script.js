
function init()
{
    document.getElementById("scripts-list-container").innerHTML = "";
    getStorageVariablesFromSync([websiteConfigurationString], function(result){
        var websiteConfiguration = result[websiteConfigurationString];
        console.log(websiteConfiguration)
        if(websiteConfiguration && websiteConfiguration.webList)
        {
            var container = document.getElementById("scripts-list-container");
            for(var i=0;i<websiteConfiguration.webList.length;i++)
            {
                var thisConfiguration = websiteConfiguration.webList[i];
                var nameTag = document.createElement("span");
                nameTag.innerHTML = thisConfiguration.name;
                var checkBoxOption = document.createElement("input");
                checkBoxOption.type = "checkbox";
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
                container.append(innerContainer);
            }
        }
    });
    document.getElementById("saveDataButton").onclick = saveData;
    document.getElementById("updateDataFromCloudButton").onclick = updateDataFromCloudFiles;
    document.getElementById("clearLocalButton").onclick = clearLocal;
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
        showToast("Saved successfully")
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
