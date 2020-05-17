
function userFunction()
{
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
                console.log("User function failed with max timeout: " + _this.counterIncrement);
            }
            else
            {
                var resultBoolean = userFunction();
                if(resultBoolean == true)
                {
                    console.log("User function success in: " + _this.counterIncrement);
                }
                else
                {
                    console.log("Loop execution check: ", _this.counterIncrement, _this.counterTimeout);
                    _this.counterTimeout = _this.counterTimeout + _this.timeoutIncrement;
                    _this.counterIncrement = _this.counterIncrement + 1;
                    _this.executeInterval();
                }
            }
        }, _this.counterTimeout);
    }
    _this.executeInterval();
})();