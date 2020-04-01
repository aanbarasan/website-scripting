/* Started to set video quality HIGH when page opens */

var defaultQuality = "High";
var repeatCounter = 1;
var maxCounter = 10;

var videoQualitDefaultInterval = setInterval(function(){
    var result = setVideoQuality(defaultQuality);
    if(result === true || repeatCounter > maxCounter)
    {
        console.log("Finished after: " + repeatCounter);
        clearInterval(videoQualitDefaultInterval);
    }
    else
    {
        console.log("Repeating quality set: " + repeatCounter)
        repeatCounter++;
    }
}, 1000);


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
