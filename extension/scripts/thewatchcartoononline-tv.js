/* Started to add css for removing one pop-up ad and remove outline of the video player in the page */

var maxIncrement = 50;
var counterIncrement = 1;
var counterTimeout = 0;
var timeoutIncrement = 10;

function executeInterval()
{
    setTimeout(function(){
        if(counterIncrement >= maxIncrement)
        {
            console.log("CSS addition failed with max timeout: " + counterIncrement);
        }
        else
        {
            var resultBoolean = userFunction();
            if(resultBoolean == true)
            {
                console.log("CSS addition success in: " + counterIncrement);
            }
            else
            {
                counterTimeout = counterTimeout + timeoutIncrement;
                counterIncrement = counterIncrement + 1;
                // console.log("CSS addition check: ", counterIncrement, counterTimeout);
                executeInterval();
            }
        }
    }, counterTimeout);
}

function userFunction()
{
    var framesFound = false;
    var iFrameList = document.getElementsByTagName("iframe");
    for(var i=0;i<iFrameList.length;i++)
    {
       var stylesTag= `<style type="text/css">
             video {
                outline: 0 !important;
             }
             .video-js .vjs-fullscreen-control
             {
                outline: none;
             }
          </style>`;

       var styleSheetDiv = document.createElement("div")
       styleSheetDiv.innerHTML = stylesTag;
       if(iFrameList[i].contentDocument && iFrameList[i].contentDocument.body) {
          iFrameList[i].contentDocument.body.appendChild(styleSheetDiv);
          framesFound = true;
       }
    }
    return framesFound;
}

executeInterval();
/* Ended to add css */
