/* Started to set video quality HIGH when page opens */

var defaultQualityList = ["High", "Medium"];

function userFunctionAutoHigh()
{
    var videoQualityMenu = document.getElementsByClassName("video-quality-menu");
    if(videoQualityMenu && videoQualityMenu.length > 0)
    {
        var videoQualityMenuDiv = videoQualityMenu[0];
        for(var quality_i=0;quality_i<defaultQualityList.length;quality_i++)
        {
            var optionContainer = videoQualityMenuDiv.getElementsByClassName("option");
            if(optionContainer && optionContainer.length > 0)
            {
                for(var i=0;i<optionContainer.length;i++)
                {
                    var option = optionContainer[i];
                    if(option.textContent == defaultQualityList[quality_i])
                    {
                        option.click();
                        return true;
                    }
                }
            }
        }
    }
    return false;
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
                console.log("Quality set failed with max timeout: " + _this.counterIncrement);
            }
            else
            {
                var resultBoolean = userFunctionAutoHigh();
                if(resultBoolean == true)
                {
                    console.log("Quality set success in: " + _this.counterIncrement);
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

/* End video quality update*/
