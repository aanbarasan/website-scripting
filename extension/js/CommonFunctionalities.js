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