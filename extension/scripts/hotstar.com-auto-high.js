/* Started to set video quality HIGH when page opens */

var defaultQuality = "High";
var incrementCounter = 1;
var maxCounter = 5;
var timeoutGap = 3000;

var videoQualityDefaultInterval = setInterval(function(){
    var result = setVideoQuality(defaultQuality);
    if(result === true || incrementCounter > maxCounter)
    {
        console.log("Finished quality set after: " + incrementCounter);
        clearInterval(videoQualityDefaultInterval);
    }
    else
    {
        console.log("Repeating quality set: " + incrementCounter)
        incrementCounter++;
    }
}, timeoutGap);


function setVideoQuality(quality)
{
    var videoQualityMenu = document.getElementsByClassName("video-quality-menu");
    if(videoQualityMenu && videoQualityMenu.length > 0)
    {
        var videoQualityMenuDiv = videoQualityMenu[0];
        var optionContainer = videoQualityMenuDiv.getElementsByClassName("option");
        if(optionContainer && optionContainer.length > 0)
        {
            for(var i=0;i<optionContainer.length;i++)
            {
                var option = optionContainer[i];
                if(option.textContent == quality)
                {
                    option.click();
                    return true;
                }
            }
        }
    }
    return false;
}
/* End video quality update*/
