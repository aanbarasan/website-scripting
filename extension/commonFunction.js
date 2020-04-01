
window.helper_obj = {};
window.helper_obj.enableyoutube = "helper_enableYoutubeCheckBox";
window.helper_obj.floatyoutube = "helper_floatYoutubeViewOption";
window.helper_obj.floatyoutube_bannersize = "helper_floatYoutubeViewBannerSize";
window.helper_obj.middleaddclose = "helper_enableYoutubeMiddleAddClose";


function helper_startupfunction(hostName, callback){
	var localHostName = window.location.hostname;
	if(localHostName && localHostName.endsWith(hostName)){
		var data = {};
		data[helper_obj.enableyoutube] = true;
		data[helper_obj.floatyoutube] = true;
		data[helper_obj.middleaddclose] = true;
		data[helper_obj.floatyoutube_bannersize] = 150;
		helper_setDefaultValueInStorage(data, callback);
	}
}

function helper_setDefaultValueInStorage(storageVariables, callback){
		var storageKeyArray = Object.keys(storageVariables);
		helper_getStorageVariablesFromSync(storageKeyArray, function(result){
				var foundUndefined = false;
				var data = {};
				for(var i=0;i<storageKeyArray.length;i++){
						if(result[storageKeyArray[i]] == undefined || result[storageKeyArray[i]] === ""){
							 data[storageKeyArray[i]] = storageVariables[storageKeyArray[i]];
							 foundUndefined = true;
						}
				}
				if(foundUndefined){
						saveStorage(data, callback);
				}
				else{
						callback();
				}
		})
}

function helper_getStorageVariablesFromSync(storageVariables, callback){
	chrome.storage.sync.get(storageVariables, function(result) {
		if(result){
			callback(result);
		}
	});
}

function saveStorage(data, callback){
  chrome.storage.sync.set(data, callback);
}

function showToast(text){
  var div = document.getElementById("fixedToastDiv");
  div.style.display = "none";
  setTimeout(function(){
    var divContent = document.getElementById("fixedToastContent");
    div.style.display = "block";
    divContent.innerText = text;
    setTimeout(function(){
      divContent.innerText = "";
      div.style.display = "none";
    },2000);
  },500);
}

function tryAgainWithTimeout(count, timeoutValue, callBack){
	if(count > 0){
		count = count - 1;
		setTimeout(function(){
			var result = callBack();
			if(result != true){
				tryAgainWithTimeout(count, timeoutValue, callBack);
			}
		}, timeoutValue);
	}
}

function enableDisableInputs(arr, option){
	for(var i=0;i<arr.length;i++){
		if(option != true){
    		arr[i].disabled=true;
		}
		else{
			arr[i].disabled=false;
		}
    }
}