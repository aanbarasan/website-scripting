window.websiteConfigurationString = "websiteConfigurations";
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

function updateDataOneTime(callback)
{
    var entryJsonURL = "entry.json";
    var xhr = new XMLHttpRequest();
    xhr.open('GET', entryJsonURL, true);
    xhr.responseType = 'blob';
    xhr.onload = function(e) {
      if (this.status == 200) {
          var file = new File([this.response], 'temp');
          var fileReader = new FileReader();
          fileReader.addEventListener('load', function(){
               var localFileData = JSON.parse(fileReader.result);
               console.log(localFileData);
               getStorageVariablesFromSync([websiteConfigurationString], function(result){
                   var websiteConfiguration = result[websiteConfigurationString];
                   var localFileDataList = localFileData.webList;
                   for(var i=0;i<localFileDataList.length;i++)
                   {
                       var thisConfiguration = localFileDataList[i];
                       if(websiteConfiguration && websiteConfiguration.webList)
                       {
                           for(var j=0;j<websiteConfiguration.webList.length;j++)
                           {
                               var thisWebConfig = websiteConfiguration.webList[j];
                               if(thisWebConfig.id == thisConfiguration.id)
                               {
                                    if(thisWebConfig.customizedByOwn == true)
                                    {
                                       thisConfiguration.enabled = thisWebConfig.enabled;
                                       thisConfiguration.customizedByOwn = true;
                                    }
                               }
                           }
                       }
                       if(thisConfiguration.customizedByOwn != true)
                       {
                            updateScriptDataFromLocalFile(thisConfiguration.fileName, thisConfiguration.id, callback);
                       }
                   }
                   if(websiteConfiguration && websiteConfiguration.webList)
                   {
                      for(var j=0;j<websiteConfiguration.webList.length;j++)
                      {
                          var thisConfiguration = websiteConfiguration.webList[j];
                          if(thisConfiguration.nature != true)
                          {
                              localFileDataList.push(thisConfiguration);
                          }
                      }
                   }
                   var data = {};
                   data[websiteConfigurationString] = localFileData;
                   saveStorage(data, callback);
               });
          });
          fileReader.readAsText(file);
      }
    }
    xhr.send();
}

function updateScriptDataFromLocalFile(fileName, scriptDataID, callback)
{
    getScriptDataFromLocalFile(fileName, function(scriptData){
       var scriptDataToStore = {};
       scriptDataToStore[scriptPreText + scriptDataID] = scriptData;
       saveStorage(scriptDataToStore, function(){
           callback("success");
       });
    });
}

function getScriptDataFromLocalFile(fileName, callback)
{
    var entryJsonURL = "scripts/" + fileName;
    var xhr = new XMLHttpRequest();
    xhr.open('GET', entryJsonURL, true);
    xhr.responseType = 'blob';
    xhr.onload = function(e) {
      if (this.status == 200) {
          var file = new File([this.response], 'temp');
          var fileReader = new FileReader();
          fileReader.addEventListener('load', function(){
               var scriptData = fileReader.result;
               callback(scriptData);
           });
           fileReader.readAsText(file);
       }
   }
   xhr.send();
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