/* Started to add css for removing one pop-up ad and remove outline of the video player in the page */
// Version updated test

setTimeout(function(){
    var iFrameList = document.getElementsByTagName("iframe");
    for(var i=0;i<iFrameList.length;i++)
    {
       var stylesTag= `<style type="text/css">
             video { 
                outline: 0 !important; 
             }
          </style>`;

       var styleSheetDiv = document.createElement("div")
       styleSheetDiv.innerHTML = stylesTag;
       if(iFrameList[i].contentDocument && iFrameList[i].contentDocument.body) {
          iFrameList[i].contentDocument.body.appendChild(styleSheetDiv);
       }
    }
}, 5000);
/* Ended to add css */
