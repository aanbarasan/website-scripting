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
    console.log("udpate from cloud");
    xHttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
           // Typical action to be performed when the document is ready:
            var couldData = JSON.parse(this.responseText);
            getStorageVariablesFromSync([websiteConfigurationString], function(result){
               var websiteConfiguration = result[websiteConfigurationString];
               var couldDataWebList = couldData.webList;
               for(var i=0;i<couldDataWebList.length;i++)
               {
                   var thisConfiguration = couldDataWebList[i];
                   var existingConfiguration = {};
                   if(websiteConfiguration && websiteConfiguration.webList)
                   {
                       for(var j=0;j<websiteConfiguration.webList.length;j++)
                       {
                           if(websiteConfiguration.webList[j].id == thisConfiguration.id)
                           {
                                existingConfiguration = websiteConfiguration.webList[j];
                           }
                       }
                   }
                   if(typeof thisConfiguration.enabled != "boolean")
                   {
                        thisConfiguration.enabled = thisConfiguration.defaultEnabled;
                   }
                   if(existingConfiguration.customizedByOwn != true)
                   {
                        thisConfiguration.enabled = existingConfiguration.enabled;
                   }
                   if(versionCompare(thisConfiguration.version, existingConfiguration.version))
                   {
                        updateScriptDataFromCloud(thisConfiguration.fileName, thisConfiguration.id, function(result){
                            if(result != "success")
                            {
                                thisConfiguration.version = undefined;
                                console.log("script update failed")
                            }
                            else
                            {
                                console.log("script update success")
                            }
                        });
                   }
                   else
                   {
                        console.log("Version mismatch");
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

function updateScriptDataFromCloud(fileName, scriptDataID, callback)
{
    var scriptDownloadURL = siteURL + "/scripts/" + fileName;
    var xHttpScriptDownload = new XMLHttpRequest();
    xHttpScriptDownload.onreadystatechange = function() {
        if (this.readyState == 4)
        {
            if(this.status == 200)
            {
                var scriptData = this.responseText;
                var scriptDataToStore = {};
                scriptDataToStore[scriptPreText + scriptDataID] = scriptData;
                saveStorage(scriptDataToStore, function(){
                    callback("success");
                });
            }
            else
            {
                callback("failed");
            }
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


function versionCompare(v1, v2, options) {
    if(typeof v1 != "string")
    {
        return -1;
    }
    if(typeof v2 != "string")
    {
        return 1;
    }
    var lexicographical = options && options.lexicographical,
        zeroExtend = options && options.zeroExtend,
        v1parts = v1.split('.'),
        v2parts = v2.split('.');

    function isValidPart(x) {
        return (lexicographical ? /^\d+[A-Za-z]*$/ : /^\d+$/).test(x);
    }

    if (!v1parts.every(isValidPart) || !v2parts.every(isValidPart)) {
        return NaN;
    }

    if (zeroExtend) {
        while (v1parts.length < v2parts.length) v1parts.push("0");
        while (v2parts.length < v1parts.length) v2parts.push("0");
    }

    if (!lexicographical) {
        v1parts = v1parts.map(Number);
        v2parts = v2parts.map(Number);
    }

    for (var i = 0; i < v1parts.length; ++i) {
        if (v2parts.length == i) {
            return 1;
        }

        if (v1parts[i] == v2parts[i]) {
            continue;
        }
        else if (v1parts[i] > v2parts[i]) {
            return 1;
        }
        else {
            return -1;
        }
    }

    if (v1parts.length != v2parts.length) {
        return -1;
    }

    return 0;
}