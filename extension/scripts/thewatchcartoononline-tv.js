/* Started to add css for removing one pop-up ad and remove outline of the video player in the page */

setTimeout(function(){
    var iframes = document.getElementsByTagName("iframe");
    for(var i=0;i<iframes.length;i++)
    {
       var stylesTag= `<style type="text/css">
             video { 
                outline: 0 !important; 
             }
          </style>`;

       var styleSheetDiv = document.createElement("div")
       styleSheetDiv.innerHTML = stylesTag;
       if(iframes[i].contentDocument && iframes[i].contentDocument.body) {
          iframes[i].contentDocument.body.appendChild(styleSheetDiv);
       }
    }
}, 5000);
/* Ended to add css */
