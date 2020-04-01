
var storageVariables = [helper_obj.enableyoutube, helper_obj.floatyoutube, helper_obj.middleaddclose,
					helper_obj.floatyoutube_bannersize];

helper_startupfunction("youtube.com", function(){
	helper_getStorageVariablesFromSync(storageVariables, function(result){
		if(result[helper_obj.enableyoutube]){
			startOnYoutubeFunction(result);
			floatYoutubeViewFunction(result);
		}
	});
});

function floatYoutubeViewFunction(result){
	if(result[helper_obj.floatyoutube]){ 
		
		window.floatVideoInYoutube = function (){
			console.log("float video enabled");
			var closeBannerView = false;
			var videoWidth = "";
			var videoHeight = "";
			var videoTop = "";
			var videoLeft = "";
			document.checkingDateValue = new Date().toTimeString();

			window.scrollFunctionality = function(event) {
				
				if(closeBannerView){
					return;
				}
				var vidplayer = document.getElementById("player-container");
				if(vidplayer.getBoundingClientRect().width > 10 &&
						vidplayer.getBoundingClientRect().bottom < 1){
					var bannerView = document.getElementById("bannerView");
					if(bannerView == null){
						addBannerInTheYoutubePage();
					}
				}
				else{
					var bannerView = document.getElementById("bannerView");
					if(bannerView != null){
						removedBannerAndBackToNormal();
					}
				}
			}

			window.resizeFunctionality = function(event){
				if(videoWidth != ""){
					setTimeout(function(){
						var vid = document.getElementsByClassName("html5-main-video")[0];
						videoWidth = vid.style.width;
						videoHeight = vid.style.height;
						videoTop = vid.style.top;
						videoLeft = vid.style.left;
					}, 500);
				}
			}

			function addBannerInTheYoutubePage(){
				if(videoWidth != ""){
					return;
				}
				var bannerHeight = result[helper_obj.floatyoutube_bannersize];
				if(bannerHeight < 50){
					bannerHeight = 50;
				}
				var bannerView = document.createElement("div");
				bannerView.id = "bannerView";
				bannerView.style.position = "fixed";
				bannerView.style.width  = "100%";
				bannerView.style.height = bannerHeight + "px";
				bannerView.style.backgroundColor = "white";
				bannerView.style.zIndex = 61;
				var closeButton = document.createElement("div");
				closeButton.style.display = "table-cell";
				closeButton.style.position = "absolute";
				closeButton.style.right = "0px";
				closeButton.style.cursor = "pointer";
				closeButton.style.fontSize = "30px";
				closeButton.style.padding = ((bannerHeight - 35) / 2) +"px";
				closeButton.innerHTML = "X";
				closeButton.onclick = function(event){
					closeBannerView = true;
					removedBannerAndBackToNormal();
				}
				bannerView.appendChild(closeButton);
				var ytdWatch = document.getElementsByTagName("ytd-watch")[0];
				if(!ytdWatch){
					ytdWatch = document.getElementsByTagName("ytd-watch-flexy")[0];
				}
				ytdWatch.insertBefore(bannerView, ytdWatch.firstChild);
				var vid = document.getElementsByClassName("html5-main-video")[0];
				videoWidth = vid.style.width;
				videoHeight = vid.style.height;
				videoTop = vid.style.top;
				videoLeft = vid.style.left;

				var vHeight = bannerHeight - 3;
				var normalWidth = 640;
				if(typeof vid.style.width == "string"){
					normalWidth = vid.style.width.replace("px","");
					normalWidth = parseInt(normalWidth);
				}
				var normalHeight = 350;
				if(typeof vid.style.height == "string"){
					normalHeight = vid.style.height.replace("px","");
					normalHeight = parseInt(normalHeight);
				}
				vWidth = (normalWidth / normalHeight) * vHeight;
				vid.style.height = vHeight + "px";
				vid.style.width = vWidth + "px";
				vid.style.top = bannerView.getBoundingClientRect().top + "px";
				vid.style.left = (bannerView.getBoundingClientRect().left + 10) + "px";
				vid.style.position = "fixed";
				var vidContainer = document.getElementsByClassName("html5-video-container")[0];
				vidContainer.style.zIndex = 62;
			}

			function removedBannerAndBackToNormal(){
				var bannerView = document.getElementById("bannerView");
				if(bannerView){
					bannerView.remove();
				}
				if(videoWidth != ""){
					var vid = document.getElementsByClassName("html5-main-video")[0];
					vid.style.width = videoWidth;
					vid.style.height = videoHeight;
					vid.style.top = videoTop;
					vid.style.left = videoLeft;
					videoWidth = "";
					videoHeight = "";
					videoTop = "";
					videoLeft = "";
					vid.style.position = "absolute";
					var vidContainer = document.getElementsByClassName("html5-video-container")[0];
					vidContainer.style.zIndex = 1;
				}
			}

			var oldURL = window.location.href;
			window.clearTimeoutForUrlChange;
			window.checkURLchange = function (currentURL){
				if(currentURL != oldURL){
					removeAllListenersAndReload();
					oldURL = currentURL;
				}
				else {
					clearTimeoutForUrlChange = setTimeout(function() {
						checkURLchange(window.location.href);
					}, 1000);
				}
			}

			function removeAllListenersAndReload(){
				clearTimeout(window.clearTimeoutForUrlChange);
				removedBannerAndBackToNormal();
				window.removeEventListener("scroll", scrollFunctionality);
				window.removeEventListener("resize", resizeFunctionality);
				setTimeout(function(){
					floatVideoInYoutube();
				},1000);
			}
			window.checkURLchange(oldURL);

			window.addEventListener("scroll", scrollFunctionality);
			window.addEventListener("resize", resizeFunctionality);

			return true;
		}

		tryAgainWithTimeout(5, 500, floatVideoInYoutube);
	}
}

function startOnYoutubeFunction(result){
	if(result[helper_obj.middleaddclose]){
		tryAgainWithTimeout(5, 1000, function(){
		    var head = document.getElementsByTagName('head')[0];
			if(head != null){
				var css = '.ad-container { display : none !important; }';
			    var style = document.createElement('style');
				style.type = 'text/css';
				if (style.styleSheet){
				  // This is required for IE8 and below.
				  style.styleSheet.cssText = css;
				} else {
				  style.appendChild(document.createTextNode(css));
				}
				head.appendChild(style);
				return true;
			}
		});
	}
}
