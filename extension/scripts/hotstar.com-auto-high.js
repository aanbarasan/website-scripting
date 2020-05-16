/* Started to set video quality HIGH when page opens */

var maxIncrement = 50;
var counterIncrement = 1;
var counterTimeout = 0;
var timeoutIncrement = 10;
var defaultQualityList = ["High", "Medium"];

function executeInterval()
{
    setTimeout(function(){
        if(counterIncrement >= maxIncrement)
        {
            console.log("Quality set failed with max timeout: " + counterIncrement);
        }
        else
        {
            var resultBoolean = userFunction();
            if(resultBoolean == true)
            {
                console.log("Quality set success in: " + counterIncrement);
            }
            else
            {
                counterTimeout = counterTimeout + timeoutIncrement;
                counterIncrement = counterIncrement + 1;
                 console.log("Quality execution check: ", counterIncrement, counterTimeout);
                executeInterval();
            }
        }
    }, counterTimeout);
}

function userFunction()
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

executeInterval();

/* End video quality update*/
