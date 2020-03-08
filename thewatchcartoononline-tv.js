/* Started to add css for removing one pop-up ad and remove outline of the video player in the page */

var styles = '#aniBox { display: none; }'; 
styles += 'video.vjs-tech { outline: none; }'; 

var css = document.createElement('style'); 
css.type = 'text/css'; 
  
if (css.styleSheet)  
    css.styleSheet.cssText = styles; 
else  
    css.appendChild(document.createTextNode(styles)); 
              
document.getElementsByTagName("head")[0].appendChild(css); 

/* Ended to add css */
