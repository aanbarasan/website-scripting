import { CommonFunctionalities } from "./CommonFunctionalities.js";

export function ChromeFunctionalities()
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
            var errorLog = chrome.runtime.lastError;
            callback(response, errorLog);
        });
    }

    this.getStorageVariables = function(storageVariables, callback){
        chrome.storage.sync.get(storageVariables, function(response) {
            callback(response);
        });
    }

    this.getConfigurationVariable = function(callback){
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
                    _this.saveInStorage(data, function(response){});
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

    this.restoreDeletedScripts = function(callback)
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
        this.getConfigurationVariable(function(websiteConfiguration){
            var configurationResultList = [];
            if(websiteConfiguration && websiteConfiguration.webList)
            {
                var webList = websiteConfiguration.webList;
                for(var i=0;i<webList.length;i++)
                {
                    var thisConfiguration = webList[i];
                    try
                    {
                        if(commonFunctions.isMatchRegex(thisConfiguration.urlRegEx, currentURLLocation))
                        {
                            configurationResultList.push(thisConfiguration);
                        }
                    }
                    catch(ex)
                    {
                        console.error(ex);
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
                url = thisTab.url;
            }
            else
            {
                thisTab.url = "https://example.com/*";
            }
            _this.urlAllMatchConfigurations(thisTab.url, function(configurationResultList){
                callback(configurationResultList, thisTab);
            });
        });
    }

    this.getConfigurationVariableFromFile = function(callback)
    {
        fetch(chrome.runtime.getURL("./../entry.json"))
            .then(response => response.json())
            .then(data => callback(data));
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
            fetch(chrome.runtime.getURL("./scripts/" + fileName))
                .then(response => response.text())
                .then(data => callback(data));
        }
        else
        {
            callback();
        }
    }

    this.getScriptDataFromLocalFile = function(scriptId, callback)
    {
        this.getConfigurationVariableFromFile(function(websiteConfiguration){
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
        this.getScriptDataFromLocalFile(scriptDataID, function(scriptData){
           var scriptDataToStore = {};
           scriptDataToStore[_this.scriptIdFromConfigId(scriptDataID)] = scriptData;
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
           var webList = websiteConfiguration.webList;
           var scriptDataToStore = {};

           var scriptId = _this.scriptIdFromConfigId(thisConfigurationToSave.scriptDataID);
           scriptDataToStore[scriptId] = thisConfigurationToSave.scriptData;
           var isConfigurationEnabled = thisConfigurationToSave.configurationEnabled;
           var isJqueryEnabled = thisConfigurationToSave.jqueryEnabled;

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

                _this.isUserScriptAvailable(scriptId, function(isAvailable){
                    let jsCode = [{code: thisConfigurationToSave.scriptData}];
                    if(isJqueryEnabled)
                    {
                        jsCode = [{file: "js/plugins/jquery-3.6.0.min.js"},
                                    {code: thisConfigurationToSave.scriptData}];
                    }
                    if(isAvailable)
                    {
                        if(isConfigurationEnabled)
                        {
                            _this.reRegisterUserScript(scriptId, thisConfigurationToSave.configurationUrlRegex, jsCode, function(){});
                        }
                        else
                        {
                            _this.unRegisterUserScript(scriptId, function(){});
                        }
                    }
                    else if(isConfigurationEnabled)
                    {
                        _this.registerUserScript(scriptId, thisConfigurationToSave.configurationUrlRegex, jsCode, function(){});
                    }
                });
            });
        });
    }

    this.registerAllScripts = function()
    {
        this.getConfigurationVariable(function(websiteConfiguration){
            if(websiteConfiguration && websiteConfiguration.webList)
            {
                for(var i=0;i<websiteConfiguration.webList.length;i++)
                {
                    let thisWebConfiguration = websiteConfiguration.webList[i];
                    let isConfigurationEnabled = thisWebConfiguration.enabled;
                    let scriptId = _this.scriptIdFromConfigId(thisWebConfiguration.id);
                    _this.getStorageVariables([scriptId], function(result){
                        let scriptData = result[scriptId];
                        _this.isUserScriptAvailable(scriptId, function(isAvailable){
                            let jsCode = [{code: scriptData}];
                            if(thisWebConfiguration.jqueryEnabled)
                            {
                                jsCode = [{file: "js/plugins/jquery-3.6.0.min.js"},
                                            {code: scriptData}];
                            }
                            if(isAvailable)
                            {
                                if(isConfigurationEnabled)
                                {
                                    _this.reRegisterUserScript(scriptId, thisWebConfiguration.urlRegEx, jsCode, function(){});
                                }
                                else
                                {
                                    _this.unRegisterUserScript(scriptId, function(){});
                                }
                            }
                            else if(isConfigurationEnabled)
                            {
                                _this.registerUserScript(scriptId, thisWebConfiguration.urlRegEx, jsCode, function(){});
                            }
                        });
                    });
                }
            }
        });
    }

    this.isUserScriptAvailable = function(id, callback)
    {
        chrome.userScripts.getScripts({ ids: [id] }, (scripts) => {
            var isAvailable = false;
            if(scripts && scripts.length > 0)
            {
                isAvailable = true;
            }
            callback(isAvailable);
        });
    }

    this.reRegisterUserScript = function(id, urlRegEx, jsCode, callback)
    {
        chrome.userScripts.unregister({ ids: [id] }, () => {
            if(chrome.runtime.lastError) {
                console.error("Failed", chrome.runtime.lastError);
            }
            _this.registerUserScript(id, urlRegEx, jsCode, function(){
                if(chrome.runtime.lastError) {
                    console.error("Failed", chrome.runtime.lastError);
                }
                callback();
            });
        });
    }

    this.unRegisterUserScript = function(id, callback)
    {
        chrome.userScripts.unregister({ ids: [id] }, () => {
            if(chrome.runtime.lastError) {
                console.error("Failed", chrome.runtime.lastError);
            }
            callback();
        });
    }

    this.registerUserScript = function(id, urlRegEx, jsCode, callback)
    {
        // TODO: remove this code after a while -- start
        if(urlRegEx.indexOf("(.*)") >= 0)
        {
            urlRegEx = urlRegEx.replaceAll("(.*)", "/*");
        }
        // TODO: remove this code after a while -- end
        chrome.userScripts.register([{
            id: id,
            matches: [urlRegEx],
            js: jsCode,
            runAt: "document_end"
        }], function(){
            callback();
        });
    }

    this.updateDataOneTime = function(callback)
    {
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
                    if(thisConfiguration.customizedByOwn != true)
                    {
                        _this.updateScriptDataFromLocalFile(thisConfiguration.id, function(result){});
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

    this.openOrFocusOptionsPage = function(callback)
    {
        var optionsUrl = chrome.runtime.getURL('options_page.html');
        chrome.tabs.query({}, function(extensionTabs) {
            var found = false;
            for (var i=0; i < extensionTabs.length; i++) {
                if (optionsUrl == extensionTabs[i].url) {
                    found = true;
                    chrome.tabs.update(extensionTabs[i].id, {"active": true});
                }
            }
            if (found == false) {
                chrome.tabs.create({url: "options_page.html"});
            }
            setTimeout(function(){
                callback();
            }, 100);
        });
     }
}