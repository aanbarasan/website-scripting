function CommonFunctionalities()
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