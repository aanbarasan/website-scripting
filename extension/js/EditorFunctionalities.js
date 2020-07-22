function EditorFunctionalities()
{
    var chromeFunctions = new ChromeFunctionalities();
    this.configurationId;

    this.init = function()
    {
        this.inputNameTag = document.getElementById("web-script-name-input");
        this.inputURLTag = document.getElementById("page-url-show");
        this.inputEnabledTag = document.getElementById("web-script-enabled-checkbox-input");
        this.inputJqueryTag = document.getElementById("enable-jquery-checkbox-input");
        this.inputScriptDataTag = document.getElementById("script-data-text-area");

        document.getElementById("saveConfigurationButton").onclick = this.saveConfigurationButton;
        document.getElementById("libraries-open-button").onclick = this.toggleLibrariesBox;
    }

    this.toggleLibrariesBox = function()
    {
        if(document.getElementById("libraries-container").style.display == "none")
        {
            document.getElementById("libraries-container").style.display = "block";
        }
        else
        {
            document.getElementById("libraries-container").style.display = "none";
        }
    }

    this.loadContainer = function(thisConfiguration)
    {
        this.configurationId = thisConfiguration.id;
        this.inputNameTag.value = thisConfiguration.name;
        this.inputURLTag.value = thisConfiguration.urlRegEx;
        this.inputEnabledTag.checked = thisConfiguration.enabled;
        this.inputJqueryTag.checked = thisConfiguration.jqueryEnabled;
        this.inputScriptDataTag.value = thisConfiguration.scriptData;
    }

    this.saveConfigurationButton = function()
    {
        var thisConfiguration = {};
        thisConfiguration.scriptData = inputScriptDataTag.value;
        thisConfiguration.scriptDataID = this.configurationId;
        thisConfiguration.configurationName = inputNameTag.value;
        thisConfiguration.configurationPurpose = null;
        thisConfiguration.configurationUrlRegex = inputURLTag.value;
        thisConfiguration.configurationEnabled = inputEnabledTag.checked;
        thisConfiguration.jqueryEnabled = inputJqueryTag.checked;

        chromeFunctions.saveThisConfiguration(thisConfiguration, function(){
           showToast("Saved successfully");
        });
    }

    this.loadNewConfiguration = function(title, regexURL)
    {
        let initConfiguration = {};
        initConfiguration.id = Math.random() + "";
        initConfiguration.name = title;
        initConfiguration.urlRegEx = regexURL;
        initConfiguration.enabled = true;
        initConfiguration.jqueryEnabled = false;
        initConfiguration.scriptData = "// Add your script here to run in this page.\n\nconsole.log(\"Testing JavaScript\");";
        this.loadContainer(initConfiguration);
    }

    this.getRegexForURL = function(url){
        var urlObject = new URL(url);
        console.log(urlObject);
        var regexUrl = urlObject.origin + "(.*)";
        return regexUrl;
    }
}