export function CommonFunctionalities()
{
    this.isMatchRegex = function(regex, text)
    {
        var parsedRegex = "^(" + regex + "(/)?)$";
        var pattern = new RegExp(parsedRegex);
        return pattern.test(text);
    }

    this.compareText = function(oldText, newText)
    {
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

    this.generateUniqueId = function(){
        // always start with a letter (for DOM friendlyness)
        var idStr=String.fromCharCode(Math.floor((Math.random()*25)+65));
        do {
            // between numbers and characters (48 is 0 and 90 is Z (42-48 = 90)
            var asciCode=Math.floor((Math.random()*42)+48);
            if (asciCode<58 || asciCode>64){
                // exclude all chars between : (58) and @ (64)
                idStr+=String.fromCharCode(asciCode);
            }
        } while (idStr.length<32);

        return (idStr);
    }

    this.getProperty = function(content, key) {
        var configList = content.split("\n");
        for(var i=0;i<configList.length;i++)
        {
            var config = configList[i];
            if(config.indexOf(key+"=") >= 0)
            {
                return config.split(key+"=")[1];
            }
        }
        return "";
    }

    this.splitLineGeneration = function(length, charList) {
        var text = "";
        for(var i=0;i<length;i++)
        {
            text = text + charList[(i%charList.length)];
        }
        return text;
    }

    this.downloadTextAsFile = function(filename, text) {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    }

    this.isOpera = function()
    {
        return (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
    }

    this.isUrlHasSearchEngine = function(inputText)
    {
        if(inputText)
        {
            var text = inputText.toLocaleLowerCase();
            var searchEngines = ["google", "bing", "yahoo", "baidu", "yandex", "naver", "duckduckgo", "ask.com", "aol.com"];
            for(var i = 0;i<searchEngines.length;i++)
            {
                var eng = searchEngines[i];
                if(text.indexOf(eng) >= 0)
                {
                    return true;
                }
            }
        }
        return false;
    }

    this.showToast = function(text, severity, timeout){
        if(typeof timeout != "number")
        {
            timeout = 1000;
        }
        var toastContainer = document.getElementById("fixed-toast-container");
        if(!toastContainer)
        {
            toastContainer = document.createElement("div");
            toastContainer.className = "fixedToast";
            toastContainer.id = "fixed-toast-container";
            toastContainer.style.position = "fixed";
            toastContainer.style.top = "10px";
            toastContainer.style.left = "50%";
            toastContainer.style.transform = "translate(-50%, 0)";
            toastContainer.style.zIndex = "1000";
            document.body.append(toastContainer);
        }
        var toastId = "toast-id-" + (Math.random() * Math.pow(10,20));
        var toastContent = document.createElement("div");
        toastContent.className = "fixedToastContent";
        toastContent.style.border = "2px solid green";
        toastContent.style.margin = "1px";
        toastContent.style.borderRadius = "8px";
        toastContent.style.padding = "10px";
        toastContent.style.backgroundColor = "#48b348";
        toastContent.style.color = "white";
        toastContent.style.fontSize = "15px";
        toastContent.style.fontWeight = "bold";
        toastContent.style.transition = "0.2s opacity";
        toastContent.id = toastId;
        if(severity == "warning")
        {
            toastContent.style.border = "2px solid orange";
            toastContent.style.backgroundColor = "#ffba3c";
        }
        else if(severity == "danger")
        {
            toastContent.style.border = "2px solid red";
            toastContent.style.backgroundColor = "#b41f1f";
        }
        else if(severity == "success")
        {
            toastContent.style.border = "2px solid green";
            toastContent.style.backgroundColor = "#48b348";
        }
        else if(severity == "secondary")
        {
            toastContent.style.border = "2px solid #9c9c9c";
            toastContent.style.backgroundColor = "rgb(204, 204, 204)";
        }

        toastContent.innerHTML = text;
        toastContainer.append(toastContent);

        setTimeout(function(){
            var toast = document.getElementById(toastId);
            if(toast != null)
            {
                toast.style.opacity = "0";
            }
        }, (timeout - 200));

        setTimeout(function(){
            var toast = document.getElementById(toastId);
            if(toast != null)
            {
                toast.remove();
            }
        }, timeout);
    }
}