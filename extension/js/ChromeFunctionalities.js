function ChromeFunctionalities()
{
    this.websiteConfigurationString = "websiteConfigurations";
    this.scriptPreText = "CustomScript_";
    this.deletedScriptText = "DeletedScriptList"
    var commonFunctions = new CommonFunctionalities();
    var _this = this;

    this.scriptIdFromConfigId = function(configurationId)
    {
        var scriptId = this.scriptPreText + configurationId;
        return scriptId;
    }

    this.saveInStorage = function(data, callback)
    {
        chrome.storage.sync.set(data, function(response){
            callback(response);
        });
    }

    this.getStorageVariables = function(storageVariables, callback){
        chrome.storage.sync.get(storageVariables, function(response) {
            callback(response);
        });
    }

    this.getConfigurationVariable = function(callback){
        var _this = this;
        this.getStorageVariables([_this.websiteConfigurationString], function(result){
            var websiteConfiguration;
            if(result)
            {
                websiteConfiguration = result[_this.websiteConfigurationString];
            }
            callback(websiteConfiguration);
        });
    }

    this.getSingleConfiguration = function(configurationId, callback){
        var _this = this;
        this.getConfigurationVariable(function(websiteConfiguration){
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
                        break;
                    }
                }
            }
            if(foundConfiguration == false)
            {
                callback();
            }
        });
    }

    this.addToDeletedConfiguration = function(configurationId)
    {
        this.getSingleConfigurationFromLocalFile(configurationId, function(thisConfig){
            if(thisConfig)
            {
                _this.getStorageVariables([_this.deletedScriptText], function(result){
                    var list = result[_this.deletedScriptText];
                    if(!list)
                    {
                        list = [];
                    }
                    list.push(configurationId);
                    var data = {};
                    data[_this.deletedScriptText] = list;
                    _this.saveInStorage(data, function(response){
                        console.log(response, data);
                    });
                })
            }
        })
    }

    this.getDeletedConfiguration = function(callback)
    {
        _this.getStorageVariables([_this.deletedScriptText], function(result){
            var list = result[_this.deletedScriptText];
            callback(list);
        });
    }

    this.restoreDeletedScriptsButton = function(callback)
    {
        var data = {};
        data[_this.deletedScriptText] = [];
        _this.saveInStorage(data, function(response){
            callback("success");
        });
    }

    this.getCurrentActiveOrLastFocusedWindows = function(callback)
    {
        if(chrome && chrome.tabs && chrome.tabs.query)
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

    this.getTitleAndUrlOfLastWindow = function(callback)
    {
        this.getCurrentActiveOrLastFocusedWindows(function(tabs){
            var thisTab;
            if(tabs && tabs.length>0)
            {
                thisTab = tabs[0];
            }
            else
            {
                thisTab = {};
            }
            let url = thisTab.url;
            let title = thisTab.title;
            callback(title, url);
        });
    }

    this.urlAllMatchConfigurations = function(currentURLLocation, callback)
    {
        var _this = this;
        this.getConfigurationVariable(function(websiteConfiguration){
            var configurationResultList = [];
            if(websiteConfiguration && websiteConfiguration.webList)
            {
                var webList = websiteConfiguration.webList;
                for(var i=0;i<webList.length;i++)
                {
                    var thisConfiguration = webList[i];
                    if(commonFunctions.isMatchRegex(thisConfiguration.urlRegEx, currentURLLocation))
                    {
                        configurationResultList.push(thisConfiguration);
                    }
                }
            }
            callback(configurationResultList);
        });
    }

    this.getActiveConfigurations = function(currentURLLocation, callback)
    {
        this.urlAllMatchConfigurations(currentURLLocation, function(configurationResultList){
            var configList = [];
            for(var i=0;i<configurationResultList.length;i++)
            {
                if(configurationResultList[i].enabled == true)
                {
                    configList.push(configurationResultList[i]);
                }
            }
            callback(configList);
        });
    }

    this.getCurrentTabConfigurations = function(callback)
    {
        _this.getCurrentActiveOrLastFocusedWindows(function(tabs){
            let url, thisTab = {};
            if(tabs && tabs.length > 0)
            {
                thisTab = tabs[0];
                console.log(thisTab);
                url = thisTab.url;
            }
            else
            {
                thisTab.url = "https://example.com";
            }
            _this.urlAllMatchConfigurations(thisTab.url, function(configurationResultList){
                callback(configurationResultList, thisTab);
            });
        });
    }

    this.getConfigurationVariableFromFile = function(callback)
    {
        var entryJsonURL = "../entry.json";
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

    this.getSingleConfigurationFromLocalFile = function(configurationId, callback){
         this.getConfigurationVariableFromFile(function(websiteConfiguration){
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

    this.getScriptDataFromConfigurationId = function(configurationId, callback){
        var scriptIdUrl = this.scriptIdFromConfigId(configurationId);
        this.getStorageVariables([scriptIdUrl], function(result){
            var scriptData = result[scriptIdUrl];
            callback(scriptData);
        });
    }

    this.loadScriptDataFromLocalFile = function(fileName, callback)
    {
        if(fileName)
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
        else
        {
            callback();
        }
    }

    this.getScriptDataFromLocalFile = function(scriptId, callback)
    {
        var _this = this;
        this.getConfigurationVariable(function(websiteConfiguration){
           if(websiteConfiguration && websiteConfiguration.webList)
           {
              var webList = websiteConfiguration.webList;
              for(var i=0;i<webList.length;i++)
              {
                   var thisWebConfiguration = webList[i];
                   if(scriptId == thisWebConfiguration.id)
                   {
                        _this.loadScriptDataFromLocalFile(thisWebConfiguration.fileName, function(scriptData){
                            callback(scriptData);
                        });
                        return;
                   }
               }
           }
           callback();
        })
    }

    this.updateScriptDataFromLocalFile = function(scriptDataID, callback)
    {
        var _this = this;
        this.getScriptDataFromLocalFile(scriptDataID, function(scriptData){
           var scriptDataToStore = {};
           scriptDataToStore[_this.scriptIdFromConfigId(scriptDataID)] = scriptData;
           console.log("storing", scriptDataToStore);
           _this.saveInStorage(scriptDataToStore, function(){
               callback("success");
           });
        });
    }

    this.saveThisConfiguration = function(thisConfigurationToSave, callback)
    {
        this.getConfigurationVariable(function(websiteConfiguration){
           if(!websiteConfiguration)
           {
                websiteConfiguration = {"webList":[]};
           }
           if(!websiteConfiguration.webList)
           {
                websiteConfiguration.webList = [];
           }
           // console.log(websiteConfiguration)
           var webList = websiteConfiguration.webList;
           var scriptDataToStore = {};

           scriptIdUrl = _this.scriptIdFromConfigId(thisConfigurationToSave.scriptDataID);
           scriptDataToStore[scriptIdUrl] = thisConfigurationToSave.scriptData;

           _this.getScriptDataFromLocalFile(thisConfigurationToSave.scriptDataID, function(existingScriptDataForScriptId){
               var scriptFound = false;
               for(var i=0;i<webList.length;i++)
               {
                    var thisWebConfiguration = webList[i];
                    if(thisConfigurationToSave.scriptDataID == thisWebConfiguration.id)
                    {
                        thisWebConfiguration.name = thisConfigurationToSave.configurationName;
                        thisWebConfiguration.urlRegEx = thisConfigurationToSave.configurationUrlRegex;
                        thisWebConfiguration.enabled = thisConfigurationToSave.configurationEnabled;
                        thisWebConfiguration.jqueryEnabled = thisConfigurationToSave.jqueryEnabled;
                        if(thisConfigurationToSave.configurationPurpose)
                        {
                            thisWebConfiguration.purpose = thisConfigurationToSave.configurationPurpose;
                        }
                        thisWebConfiguration.id = thisConfigurationToSave.scriptDataID;
                        if(typeof existingScriptDataForScriptId == "string")
                        {
                            var differentValue = commonFunctions.compareText(thisConfigurationToSave.scriptData, existingScriptDataForScriptId);
                            // console.log(differentValue)
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
                    thisWebConfiguration.name = thisConfigurationToSave.configurationName;
                    thisWebConfiguration.urlRegEx = thisConfigurationToSave.configurationUrlRegex;
                    thisWebConfiguration.enabled = thisConfigurationToSave.configurationEnabled;
                    thisWebConfiguration.jqueryEnabled = thisConfigurationToSave.jqueryEnabled;
                    thisWebConfiguration.id = thisConfigurationToSave.scriptDataID;
                    thisWebConfiguration.customizedByOwn = true;
                    webList.push(thisWebConfiguration);
               }
               scriptDataToStore[_this.websiteConfigurationString] = websiteConfiguration;
               _this.saveInStorage(scriptDataToStore, callback);
           });
       });
    }

    this.updateDataOneTime = function(callback)
    {
        var _this = this;
        this.getConfigurationVariableFromFile(function(localFileData){
           _this.getConfigurationVariable(function(websiteConfiguration){
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
                               thisConfiguration.enabled = thisWebConfig.enabled;
                               thisConfiguration.customizedByOwn = thisWebConfig.customizedByOwn;
                           }
                       }
                   }
                   console.log(thisConfiguration)
                   if(thisConfiguration.customizedByOwn != true)
                   {
                        _this.updateScriptDataFromLocalFile(thisConfiguration.id, function(result){console.log(result)});
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
               data[_this.websiteConfigurationString] = localFileData;
               _this.saveInStorage(data, callback);
           });
        });
    }

    this.openOrFocusOptionsPage = function()
    {
        var optionsUrl = chrome.extension.getURL('options_page.html');
        chrome.tabs.query({}, function(extensionTabs) {
            var found = false;
            for (var i=0; i < extensionTabs.length; i++) {
                if (optionsUrl == extensionTabs[i].url) {
                    found = true;
                    // console.log("tab id: " + extensionTabs[i].id);
                    chrome.tabs.update(extensionTabs[i].id, {"active": true});
                }
            }
            if (found == false) {
                chrome.tabs.create({url: "options_page.html"});
            }
        });
     }

     this.executeScript = function(tabId, scriptData, callback)
     {
        chrome.tabs.executeScript(tabId, {code: scriptData}, callback);
     }

     this.executeScriptWithJquery = function(tabId, scriptData, callback)
     {
        chrome.tabs.executeScript(tabId, {file: "js/plugins/jquery-3.3.1.min.js"}, function() {console.log("jquery executed")
            chrome.tabs.executeScript(tabId, {code: scriptData}, callback);
        });
     }
}