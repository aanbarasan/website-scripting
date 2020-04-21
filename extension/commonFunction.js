window.websiteConfigurationString = "websiteConfigurations";
window.siteURL = "https://raw.githubusercontent.com/aanbarasan/website-scripting/master";
window.scriptPreText = "CustomScript_";


function urlMatchCallbackScript(currentURLLocation, callback)
{
    getStorageVariablesFromSync([websiteConfigurationString], function(result){
        var foundConfiguration = false;
        var websiteConfiguration = result[websiteConfigurationString];
        if(websiteConfiguration && websiteConfiguration.webList)
        {
            var webList = websiteConfiguration.webList;
            for(var i=0;i<webList.length;i++)
            {
                var thisConfiguration = webList[i];
                if(matchURL(currentURLLocation, thisConfiguration.urlRegEx))
                {
                    callback(thisConfiguration);
                    foundConfiguration = true;
                }
            }
        }
        if(foundConfiguration == false)
        {
            callback();
        }
    });
}

function matchURL(urlLocation, regex)
{
    var pattern = new RegExp(regex);
    return pattern.test(urlLocation);
}

function updateDataFromCloud(callback)
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
               saveStorage(data, callback);
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

function getStorageVariablesFromSync(storageVariables, callback){
	chrome.storage.sync.get(storageVariables, function(result) {
		if(result){
			callback(result);
		}
	});
}

function saveStorage(data, callback){
  chrome.storage.sync.set(data, callback);
}

function showToast(text){
    var div = document.getElementById("fixedToastDiv");
    div.style.display = "none";
    setTimeout(function(){
        var divContent = document.getElementById("fixedToastContent");
        div.style.display = "block";
        divContent.innerText = text;
        setTimeout(function(){
            divContent.innerText = "";
            div.style.display = "none";
        }, 2000);
    }, 500);
}