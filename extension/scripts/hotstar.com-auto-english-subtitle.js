/* Started to set english subtitle when page opens */

var subtitleLanguageText = "English";

function userFunctionAutoEnglish()
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
                console.log("English subtitle set failed with max timeout: " + _this.counterIncrement);
            }
            else
            {
                var resultBoolean = userFunctionAutoEnglish();
                if(resultBoolean == true)
                {
                    console.log("English subtitle set success in: " + _this.counterIncrement);
                }
                else
                {
                    _this.counterTimeout = _this.counterTimeout + _this.timeoutIncrement;
                    _this.counterIncrement = _this.counterIncrement + 1;
                    console.log("English subtitle set check: ", _this.counterIncrement, _this.counterTimeout);
                    _this.executeInterval();
                }
            }
        }, _this.counterTimeout);
    }
    _this.executeInterval();
})();

/* Ended to set subtitle */