
function init()
{
    urlMatchCallbackScript(window.location.href, function(thisConfiguration){
        console.log("Matched location: ", thisConfiguration);
        if(thisConfiguration && thisConfiguration.enabled == true)
        {
            var scriptDataId = scriptPreText + thisConfiguration.id;
            getStorageVariablesFromSync([scriptDataId], function(result){
                var scriptData = result[scriptDataId];
                if(typeof scriptData == "string")
                {
                    eval(scriptData);
                }
            });
        }
    });
}

init();