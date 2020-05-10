window.websiteConfigurationString = "websiteConfigurations";
window.scriptPreText = "CustomScript_";


function getActiveUrlMatchCallbackScript(currentURLLocation, callback)
{
    urlMatchCallbackScript(currentURLLocation, function(configurationResultList){
        var configList = [];
        for(var i=0;i<configurationResultList.length;i++)
        {
            if(configurationResultList[i].enabled == true)
            {
                configList.push(configurationResultList[i]);
            }
        }
        callback(configList);
    })
}

function urlMatchCallbackScript(currentURLLocation, callback)
{
    getStorageVariablesFromSync([websiteConfigurationString], function(result){
        var websiteConfiguration = result[websiteConfigurationString];
        var configurationResultList = [];
        if(websiteConfiguration && websiteConfiguration.webList)
        {
            var webList = websiteConfiguration.webList;
            for(var i=0;i<webList.length;i++)
            {
                var thisConfiguration = webList[i];
                if(matchURL(currentURLLocation, thisConfiguration.urlRegEx))
                {
                    configurationResultList.push(thisConfiguration);
                }
            }
        }
        callback(configurationResultList);
    });
}

function matchURL(urlLocation, regex)
{
    var pattern = new RegExp(regex);
    return pattern.test(urlLocation);
}

function getCurrentActiveOrLastFocusedWindows(callback)
{
    if(chrome.tabs && chrome.tabs.query)
    {
        chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
            callback(tabs);
        });
    }
    else
    {
        callback();
    }
}

function getConfigurationForConfigurationId(configurationId, callback){
    getStorageVariablesFromSync([websiteConfigurationString], function(result){
        var foundConfiguration = false;
        var websiteConfiguration = result[websiteConfigurationString];
        if(websiteConfiguration && websiteConfiguration.webList)
        {
            var webList = websiteConfiguration.webList;
            for(var i=0;i<webList.length;i++)
            {
                var thisConfiguration = webList[i];
                if(thisConfiguration.id == configurationId)
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

function updateDataOneTime(callback)
{
    getLocalDataJsonFromFile(function(localFileData){
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
}

function getConfigurationForConfigIdFromLocalFile(configurationId, callback){
     getLocalDataJsonFromFile(function(websiteConfiguration){
         var foundConfiguration = false;
         if(websiteConfiguration && websiteConfiguration.webList)
         {
             var webList = websiteConfiguration.webList;
             for(var i=0;i<webList.length;i++)
             {
                 var thisConfiguration = webList[i];
                 if(thisConfiguration.id == configurationId)
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

function getLocalDataJsonFromFile(callback)
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
               callback(localFileData);
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


function saveConfigurationForOneData(scriptData, scriptDataID, configurationName, configurationPurpose, configurationUrlRegex, configurationEnabled, callback)
{
    getStorageVariablesFromSync([websiteConfigurationString], function(result){
       var websiteConfiguration = result[websiteConfigurationString];
       if(!websiteConfiguration)
       {
            websiteConfiguration = {"webList":[]};
       }
       if(!websiteConfiguration.webList)
       {
            websiteConfiguration.webList = [];
       }
       console.log(websiteConfiguration)
       var webList = websiteConfiguration.webList;
       var scriptDataToStore = {};

       scriptIdUrl = scriptPreText + scriptDataID;
       scriptDataToStore[scriptIdUrl] = scriptData;

       scriptDataFromFile(scriptDataID, function(existingScriptDataForScriptId){
           var scriptFound = false;
           for(var i=0;i<webList.length;i++)
           {
                var thisWebConfiguration = webList[i];
                if(scriptDataID == thisWebConfiguration.id)
                {
                    thisWebConfiguration.name = configurationName;
                    thisWebConfiguration.urlRegEx = configurationUrlRegex;
                    thisWebConfiguration.enabled = configurationEnabled;
                    if(configurationPurpose)
                    {
                        thisWebConfiguration.purpose = configurationPurpose;
                    }
                    thisWebConfiguration.id = scriptDataID;
                    if(typeof existingScriptDataForScriptId == "string")
                    {
                        var differentValue = compareText(scriptData, existingScriptDataForScriptId);
                        console.log(differentValue)
                        if(differentValue)
                        {
                            thisWebConfiguration.customizedByOwn = false;
                        }
                        else
                        {
                            thisWebConfiguration.customizedByOwn = true;
                        }
                    }
                    else
                    {
                        thisWebConfiguration.customizedByOwn = true;
                    }
                    scriptFound = true;
                    break;
                }
           }
           if(scriptFound == false)
           {
                var thisWebConfiguration = {};
                thisWebConfiguration.name = configurationName;
                thisWebConfiguration.urlRegEx = configurationUrlRegex;
                thisWebConfiguration.enabled = configurationEnabled;
                thisWebConfiguration.id = scriptDataID;
                thisWebConfiguration.customizedByOwn = true;
                webList.push(thisWebConfiguration);
           }
           scriptDataToStore[websiteConfigurationString] = websiteConfiguration;
           console.log(scriptDataToStore);
           saveStorage(scriptDataToStore, callback);
       });
   });
}

function compareText(oldText, newText)
{
    console.log(oldText);
    console.log(newText);
    var oldTextArray = oldText.split("\n");
    var newTextArray = newText.split("\n");
    if(oldTextArray.length != newTextArray.length)
    {
        return false;
    }
    for(var i=0;i<oldTextArray.length,i<newTextArray.length;i++)
    {
        if(oldTextArray[i].valueOf().trim() != newTextArray[i].valueOf().trim())
        {
            return false;
        }
    }
    return true;
}

function scriptDataFromFile(scriptId, callback)
{
    getStorageVariablesFromSync([websiteConfigurationString], function(result){
       var websiteConfiguration = result[websiteConfigurationString];
       var webList = websiteConfiguration.webList;
       if(websiteConfiguration && websiteConfiguration.webList)
       {
          for(var i=0;i<webList.length;i++)
          {
               var thisWebConfiguration = webList[i];
               if(scriptId == thisWebConfiguration.id)
               {
                    getScriptDataFromLocalFile(thisWebConfiguration.fileName, function(scriptData){
                        callback(scriptData);
                    })
                    return;
               }
           }
       }
       callback();
    })
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