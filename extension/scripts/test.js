var maxIncrement = 50;
var counterIncrement = 1;
var counterTimeout = 0;
var timeoutIncrement = 10;

function executeInterval()
{
    setTimeout(function(){
        if(counterIncrement >= maxIncrement)
        {
            console.log("User function failed with max timeout: " + counterIncrement);
        }
        else
        {
            var resultBoolean = userFunction();
            if(resultBoolean == true)
            {
                console.log("User function success in: " + counterIncrement);
            }
            else
            {
                counterTimeout = counterTimeout + timeoutIncrement;
                counterIncrement = counterIncrement + 1;
                // console.log("Loop execution check: ", counterIncrement, counterTimeout);
                executeInterval();
            }
        }
    }, counterTimeout);
}

function userFunction()
{
    return false;
}

executeInterval();