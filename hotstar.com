/* Started to set video quality HIGH when page opens */

var defaultQuality = "High";
var videoQualityMenu = document.getElementsByClassName("video-quality-menu");

if(videoQualityMenu && videoQualityMenu.length > 0)
{
    var videoQualityMenuDiv = videoQualityMenu[0]
    var optionContainer = videoQualityMenuDiv.getElementsByClassName("option");
    if(optionContainer)
    {
         for(var i=0;i<optionContainer.length;i++)
         {
             var option = optionContainer[i];
             if(option.textContent == defaultQuality)
             {
                 option.click()
             }
          }
    }
}

/* End video quality update*/
