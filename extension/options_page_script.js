var websiteConfigurationString = "websiteConfigurations";

function init()
{
    helper_getStorageVariablesFromSync([websiteConfigurationString], function(result){
        var websiteConfiguration = result[websiteConfigurationString];
        if(websiteConfiguration)
        {
            var container = document.getElementById("scripts-list-container");
            for(var i=0;i<websiteConfiguration.length;i++)
            {
                var thisConfiguration = websiteConfiguration[i];
                var nameTag = document.createElement("span");
                nameTag.innerHTML = thisConfiguration.name;
                var checkBoxOption = document.createElement("input");
                checkBoxOption.type = "checkbox";
                if(thisConfiguration.enabled == true)
                {
                    checkBoxOption.checked = true;
                }
                var innerContainer = document.createElement("div");
                innerContainer.append(checkBoxOption);
                innerContainer.append(nameTag);
                innerContainer.name = thisConfiguration.id;
                container.append(innerContainer);
            }
        }
    })
}

function saveData()
{
    helper_getStorageVariablesFromSync([websiteConfigurationString], function(result){
        var websiteConfiguration = result[websiteConfigurationString];
        if(websiteConfiguration)
        {
            var container = document.getElementById("scripts-list-container");
            var innerContainerList = container.children;
            for(var i=0;i<innerContainerList.length;i++)
            {
                var innerContainer = innerContainerList[i];
                var inputTag = innerContainer.getElementsByTagName("input");
                if(inputTag.checked)
                {
                    updateFeatureState(websiteConfiguration, innerContainer.name, true);
                }
                else
                if(inputTag.checked)
                {
                    updateFeatureState(websiteConfiguration, innerContainer.name, false);
                }
            }
            var data = {};
            data[websiteConfiguration] = websiteConfiguration;
            saveStorage(data, function(){
                console.log("finished");
            })
        }
    });
}

function updateFeatureState(websiteConfiguration, name, booleanValue)
{
    for(var i=0;i<websiteConfiguration.length;i++)
    {
        if(websiteConfiguration[i].name == name)
        {
            websiteConfiguration[i].enabled = booleanValue;
        }
    }
}

init();






















var enableYoutubeCheckBox = document.getElementById("enableYoutubeCheckBox");
var floatYoutubeViewOption = document.getElementById("floatYoutubeViewOption");
var enableYoutubeMiddleAddClose = document.getElementById("enableYoutubeMiddleAddClose");
var floatYoutubeViewBannerSize = document.getElementById("floatYoutubeViewBannerSize");
var youtubeArray = [floatYoutubeViewOption, enableYoutubeMiddleAddClose, floatYoutubeViewBannerSize];

helper_startupfunction("", function(){
    helper_getStorageVariablesFromSync([helper_obj.enableyoutube], function(result){
      if(result[helper_obj.enableyoutube] == true){
          enableYoutubeCheckBox.checked = true;
      }
      else{
          enableYoutubeCheckBox.checked = false;
      }
      enableDisableInputs(youtubeArray, enableYoutubeCheckBox.checked);
    });
    enableYoutubeCheckBox.onchange = function(){
      var data = {};
      data[helper_obj.enableyoutube] = enableYoutubeCheckBox.checked;
      saveStorage(data, function(){
          enableDisableInputs(youtubeArray, enableYoutubeCheckBox.checked);
          showToast("Saved Successfully");
      });
    }
    updateCheckBox(floatYoutubeViewOption, helper_obj.floatyoutube);
    updateCheckBox(enableYoutubeMiddleAddClose, helper_obj.middleaddclose);
    helper_getStorageVariablesFromSync([helper_obj.floatyoutube_bannersize], function(result){
        floatYoutubeViewBannerSize.value = result[helper_obj.floatyoutube_bannersize];
    });

    commonCheckBoxChangeFunction(floatYoutubeViewOption, helper_obj.floatyoutube);
    commonCheckBoxChangeFunction(enableYoutubeMiddleAddClose, helper_obj.middleaddclose);
    floatYoutubeViewBannerSize.onchange = function(){
        var data = {};
        data[helper_obj.floatyoutube_bannersize] = floatYoutubeViewBannerSize.value;
        saveStorage(data, function(){
            showToast("Saved Successfully");
        });
    }
});


function updateCheckBox(checkbox, storagetext){
  helper_getStorageVariablesFromSync([storagetext], function(result){
      if(result[storagetext] == true){
          checkbox.checked = true;
      }
      else{
          checkbox.checked = false;
      }
  });
}
