var cssTagSelector = "td.file-link a:nth-of-type(1)";

function initDownloadButton() {

    var divBlock = document.createElement("div");
    divBlock.style.width = "40px";
    divBlock.style.height = "40px";
    divBlock.style.borderRadius = "2px";
    divBlock.style.cursor = "pointer";
    divBlock.style.backgroundColor = "green";
    divBlock.style.position = "fixed";
    divBlock.style.bottom = "50px";
    divBlock.style.right = "50px";
    divBlock.onclick = downloadButtonClick;
    divBlock.innerHTML = '<img style="width: 100%;" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABmJLR0QA/wD/AP+gvaeTAAAA9ElEQVRoge2ZQQ6CMBAAR6O+UMNBvyO+FD4BiR7MHqy0lKalS9hJeiHpMkMCIQCGYeTiAryADnh7Vge0wLmSY5AWv7i7npUcg/TEB/S5TnrINYiv2OrnPuUY4sEVXBoYxbHE0DWxgNpYQG0soDYWUBsLqE1swBUYCL9hLiU0awTuCTODxESEgmL3FZFPiUgJKCovxEa4qJAXpiJG4BGx9+bZu5q8kBKhRl5YEqFOXoiJUCsvhCLUywsN/6KD51hTyXGWuUesyivv4ovYhLzgRmxKXpCITcoLDYpvWMMwFDD1k6HId/yM/Djv5quEWjYfYBh75wNHsstOyS3+9gAAAABJRU5ErkJggg=="/>';

    var bodyTag = document.getElementsByTagName("body")[0];
    bodyTag.appendChild(divBlock);
}

function downloadButtonClick() {
    var links = document.querySelectorAll(cssTagSelector);
    console.log(links);
    if (links.length > 0) {
        for (var i = 0; i < links.length; i++) {
            var linkhref = links[i].href;
            download(linkhref);
        }
    } else {
        alert("No links found for \"" + cssTagSelector + "\" selector");
    }
}

function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

initDownloadButton();