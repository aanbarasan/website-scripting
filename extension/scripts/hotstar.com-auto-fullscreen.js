/* Started to set video fullscreen when page opens */

var maxIncrement = 50;
var counterIncrement = 1;
var counterTimeout = 0;
var timeoutIncrement = 10;

function executeInterval()
{
    setTimeout(function(){
        if(counterIncrement >= maxIncrement)
        {
            console.log("Fullscreen set failed with max timeout: " + counterIncrement);
        }
        else
        {
            var resultBoolean = userFunction();
            if(resultBoolean == true)
            {
                console.log("Fullscreen set success in: " + counterIncrement);
            }
            else
            {
                counterTimeout = counterTimeout + timeoutIncrement;
                counterIncrement = counterIncrement + 1;
                // console.log("Fullscreen set execution check: ", counterIncrement, counterTimeout);
                executeInterval();
            }
        }
    }, counterTimeout);
}

function userFunction()
{
    var videoPlayers = document.getElementsByTagName("video");
    if(videoPlayers && videoPlayers.length > 0)
    {
        for(var i=0;i<videoPlayers.length;i++)
        {
            var videoPlayer = videoPlayers[i];
            if(videoPlayer.networkState > 0)
            {
                var fullScreenButtonList = document.getElementsByClassName("fullscreen player-control");
                if(fullScreenButtonList && fullScreenButtonList.length > 0)
                {
                    var fullScreenButton = fullScreenButtonList[0];
                    if(fullScreenButton)
                    {
                        if(!isFullScreenOrNot())
                        {
                            fullScreenButton.click();
                            return true;
                        }
                    }
                }
            }
        }
    }
    return false;
}

function isFullScreenOrNot()
{
    if((window.fullScreen) ||
       (window.innerWidth == screen.width && window.innerHeight == screen.height)) {
        return true;
    } else {
        return false;
    }
}

executeInterval();

/* End video fullscreen*/
