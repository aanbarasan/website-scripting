/* Started to set video fullscreen when page opens */

var incrementCounter = 1;
var maxCounter = 5;
var timeoutGap = 3000;
var playedOneTime = false;

var videoFullScreenDefaultInterval = setInterval(function(){
    var result = setFullScreen();
    if(result === true || incrementCounter > maxCounter)
    {
        console.log("Finished after: " + incrementCounter);
        clearInterval(videoFullScreenDefaultInterval);
    }
    else
    {
        console.log("Repeating quality set: " + incrementCounter)
        incrementCounter++;
    }
}, timeoutGap);

function setFullScreen()
{
    var videoPlayers = document.getElementsByTagName("video");
    if(videoPlayers && videoPlayers.length > 0)
    {
        for(var i=0;i<videoPlayers.length;i++)
        {
            var videoPlayer = videoPlayers[i];
            if(videoPlayer.paused != true || playedOneTime == true)
            {
                playedOneTime = true;
                var fullScreenButtonList = document.getElementsByClassName("fullscreen player-control");
                if(fullScreenButtonList && fullScreenButtonList.length > 0)
                {
                    var fullScreenButton = fullScreenButtonList[0];
                    if(fullScreenButton)
                    {
                        if(!isFullScreenOrNot())
                        {
                            fullScreenButton.click();
                        }
                        return true;
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
/* End video fullscreen*/
