var websiteConfigurationString = "websiteConfigurations";
var siteURL = "https://raw.githubusercontent.com/aanbarasan/website-scripting/master";
var scriptPreText = "CustomScript_";

function init()
{
    getStorageVariablesFromSync([websiteConfigurationString], function(result){
       var websiteConfiguration = result[websiteConfigurationString];
       if(websiteConfiguration && websiteConfiguration.webList)
       {
            var webList = websiteConfiguration.webList;
            var currentURLLocation = window.location.href;
            for(var i=0;i<webList.length;i++)
            {
                var thisConfiguration = webList[i];
                // console.log(thisConfiguration);
                if(matchURL(currentURLLocation, thisConfiguration.urlRegEx))
                {
                    console.log("Matched location: ", thisConfiguration);
                    var scriptDataId = scriptPreText + thisConfiguration.id;
                    getStorageVariablesFromSync([scriptDataId], function(result){
                        var scriptData = result[scriptDataId];
                        if(typeof scriptData == "string")
                        {
                            eval(scriptData);
                        }
                    });
                }
            }
       }
   });
}

function matchURL(urlLocation, regex)
{
    if(urlLocation == regex)
    {
        return true;
    }
    return false;
}

init();