<!---
    Developed by roshka - www.roshka.com
-->

# mobi.roshka.cordova.callphone

This plugin allows calls to a phone number from an ios or android smartphone.

# CallPhone

navigator.callphone.call(function () {}, 
    function (error) {
        showErrorDialog(errors.call);
        log(error);
    },
        number
);

## Installation

    cordova plugin add mobi.roshka.cordova.callphone

### Supported Platforms

- Android
- iOS