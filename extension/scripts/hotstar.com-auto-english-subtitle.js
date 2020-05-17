var maxIncrement = 50;
var counterIncrement = 1;
var counterTimeout = 0;
var timeoutIncrement = 10;
var subtitleLanguageText = "English";

function executeInterval()
{
    setTimeout(function(){
        if(counterIncrement >= maxIncrement)
        {
            console.log("English subtitle set failed with max timeout: " + counterIncrement);
        }
        else
        {
            var resultBoolean = userFunction();
            if(resultBoolean == true)
            {
                console.log("English subtitle set success in: " + counterIncrement);
            }
            else
            {
                counterTimeout = counterTimeout + timeoutIncrement;
                counterIncrement = counterIncrement + 1;
                console.log("English subtitle set check: ", counterIncrement, counterTimeout);
                executeInterval();
            }
        }
    }, counterTimeout);
}

function userFunction()
{
    var languageSelectorMenu = document.getElementsByClassName("language-selector");
    if(languageSelectorMenu && languageSelectorMenu.length > 0)
    {
        var languageSelectorMenuDiv = languageSelectorMenu[0];
        var selectBoxContainer = languageSelectorMenuDiv.getElementsByClassName("selection-box");
        if(selectBoxContainer && selectBoxContainer.length > 0)
        {
            var optionContainer = selectBoxContainer[0].getElementsByClassName("option");
            if(optionContainer && optionContainer.length > 0)
            {
                for(var i=0;i<optionContainer.length;i++)
                {
                    var option = optionContainer[i];
                    if(option.textContent == subtitleLanguageText)
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