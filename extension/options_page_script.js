
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
    document.getElementById("updateDataFromCloudButton").onclick = updateDataFromCloud;
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

function updateDataFromCloud()
{
    var entryJsonURL = siteURL + "/entry.json";
    var xHttp = new XMLHttpRequest();
    xHttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
           // Typical action to be performed when the document is ready:
            var couldData = JSON.parse(this.responseText);
            getStorageVariablesFromSync([websiteConfigurationString], function(result){
               var websiteConfiguration = result[websiteConfigurationString];
               var couldDataWebList = couldData.webList;
               for(var i=0;i<couldDataWebList.length;i++)
               {
                   if(websiteConfiguration && websiteConfiguration.webList)
                   {
                       var container = document.getElementById("scripts-list-container");
                       for(var j=0;j<websiteConfiguration.webList.length;j++)
                       {
                           var thisConfiguration = websiteConfiguration.webList[j];
                           if(thisConfiguration.id == couldDataWebList[i].id &&
                                    thisConfiguration.customizedByOwn != true)
                           {
                               couldDataWebList[i].enabled = thisConfiguration.enabled;
                               updateScriptDataFromCloud(couldDataWebList[i].fileName, couldDataWebList[i].id);
                           }
                       }
                   }
                   if(typeof couldDataWebList[i].enabled != "boolean")
                   {
                        couldDataWebList[i].enabled = couldDataWebList[i].defaultEnabled;
                   }
               }
               if(websiteConfiguration && websiteConfiguration.webList)
               {
                  var container = document.getElementById("scripts-list-container");
                  for(var j=0;j<websiteConfiguration.webList.length;j++)
                  {
                      var thisConfiguration = websiteConfiguration.webList[j];
                      if(thisConfiguration.customizedByOwn == true)
                      {
                          couldDataWebList.push(thisConfiguration);
                      }
                  }
               }
               var data = {};
               data[websiteConfigurationString] = couldData;
               saveStorage(data, function(){
                   showToast("Saved successfully")
                   init();
               });
           });
        }
    };
    xHttp.open("GET", entryJsonURL, true);
    xHttp.send();
}

function updateScriptDataFromCloud(fileName, scriptDataID)
{
   var scriptDownloadURL = siteURL + "/scripts/" + fileName;
   var xHttpScriptDownload = new XMLHttpRequest();
   xHttpScriptDownload.onreadystatechange = function() {
       if (this.readyState == 4 && this.status == 200) {
           var scriptData = this.responseText;
           var scriptDataToStore = {};
           scriptDataToStore[scriptPreText + scriptDataID] = scriptData;
           saveStorage(scriptDataToStore, function(){});
        }
   };
   xHttpScriptDownload.open("GET", scriptDownloadURL, true);
   xHttpScriptDownload.send();
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
