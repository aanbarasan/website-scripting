/* Started to set video fullscreen when page opens */

function userFunctionFullScreen()
{
    var videoPlayers = document.getElementsByTagName("video");
    if(videoPlayers && videoPlayers.length > 0)
    {
        for(var i=0;i<videoPlayers.length;i++)
        {
            var videoPlayer = videoPlayers[i];
            if(videoPlayer.networkState > 0 && videoPlayer.videoWidth > 0 && videoPlayer.videoHeight > 0)
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

(function(){
    var _this = {};
    _this.maxIncrement = 50;
    _this.counterIncrement = 1;
    _this.counterTimeout = 0;
    _this.timeoutIncrement = 10;

    _this.executeInterval = function(){
        setTimeout(function(){
            if(_this.counterIncrement >= _this.maxIncrement)
            {
                console.log("Fullscreen set failed with max timeout: " + _this.counterIncrement);
            }
            else
            {
                var resultBoolean = userFunctionFullScreen();
                if(resultBoolean == true)
                {
                    console.log("Fullscreen set success in: " + _this.counterIncrement);
                }
                else
                {
                    _this.counterTimeout = _this.counterTimeout + _this.timeoutIncrement;
                    _this.counterIncrement = _this.counterIncrement + 1;
                    _this.executeInterval();
                }
            }
        }, _this.counterTimeout);
    }
    _this.executeInterval();
})();

/* End video fullscreen*/
