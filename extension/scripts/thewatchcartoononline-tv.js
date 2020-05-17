/* Started to add css for removing one pop-up ad and remove outline of the video player in the page */

function userFunctionCssAddition()
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
                console.log("CSS addition failed with max timeout: " + _this.counterIncrement);
            }
            else
            {
                var resultBoolean = userFunctionCssAddition();
                if(resultBoolean == true)
                {
                    console.log("CSS addition success in: " + _this.counterIncrement);
                }
                else
                {
                    // console.log("CSS addition check: ", _this.counterIncrement, _this.counterTimeout);
                    _this.counterTimeout = _this.counterTimeout + _this.timeoutIncrement;
                    _this.counterIncrement = _this.counterIncrement + 1;
                    _this.executeInterval();
                }
            }
        }, _this.counterTimeout);
    }
    _this.executeInterval();
})();
/* Ended to add css */
