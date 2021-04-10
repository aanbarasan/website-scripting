const path = require('path');
const fs = require('fs');

var messageJsonMap = {};

function compareJson()
{
    // console.log(messageJsonMap);
    var languageKeys = Object.keys(messageJsonMap);
    var messageKeys = [];
    for(var i=0;i<languageKeys.length;i++)
    {
        var lang = languageKeys[i];
        var mess = messageJsonMap[lang];
        var keysList = Object.keys(mess);
        for(var j=0;j<keysList.length;j++)
        {
            var key = keysList[j];
            if(messageKeys.indexOf(key) < 0)
            {
                messageKeys.push(key);
            }
        }
    }
    var missingKeys = {};
    for(var k=0;k<messageKeys.length;k++)
    {
        var messKey = messageKeys[k];

        for(var i=0;i<languageKeys.length;i++)
        {
            var lang = languageKeys[i];
            var mess = messageJsonMap[lang];
            var keysList = Object.keys(mess);

            if(keysList.indexOf(messKey) < 0)
            {
                var missKey = missingKeys[messKey];
                if(!missKey)
                {
                    missingKeys[messKey] = [];
                    missKey = missingKeys[messKey];
                }
                missKey.push(lang);
            }
        }
    }
    console.log(missingKeys);
}

function parseJsonMessages()
{
    const directoryPath = path.join('../extension/_locales', '');
    fs.readdir(directoryPath, function (err, files) {
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        }
        files.forEach(function (file) {
            const filePath = path.join('../extension/_locales/' + file + '/messages.json', '');
            fs.readFile(filePath, function (err, data) {
                if (err) throw err;
                var textContent = data.toString();
                messageJsonMap[file] = JSON.parse(textContent);
            });
        });
        setTimeout(function(){
            compareJson();
        }, 3000);
    });
}


parseJsonMessages();