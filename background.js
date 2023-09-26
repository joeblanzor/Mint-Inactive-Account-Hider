// background.js

chrome.storage.local.get('enable', function(data) {
    console.log('jrLog storage enabled: ', data.enable);
    var enable = data.enable !== undefined ? data.enable : true;

    if (enable) {
        console.log('jrLog executing main');
        hideInactiveAccounts();
    }
});

function hideInactiveAccounts() {
    // TODO: Enable and remove the storage check from mint-filter after setting up messaging.
        // Add the following to manifest.json
        // "background": {
        //   "service_worker": "background.js"
        // },  
    console.log('jrLog main mint');
    chrome.tabs.query({url: 'https://mint.intuit.com/settings'}, function(tabs) {
        console.log('jrLog tabs ', tabs);
        tabs.forEach(function(tab) {
            if (chrome.runtime.lastError || !tab) {
                return;
            }

            console.log('jrLog executing script');
            chrome.scripting.executeScript({
                target: {tabId: tab.id},
                func: () => {
                    if (typeof chrome !== 'undefined' && chrome.runtime) {
                        // Chrome, Edge, Opera
                        console.log('jrLog chrome Script');
                        chrome.runtime.sendMessage("toggleInactiveAccounts");
                    } else if (typeof browser !== 'undefined' && browser.runtime) {
                        // Firefox
                        console.log('jrLog FF Script');
                        browser.runtime.sendMessage("toggleInactiveAccounts");
                    } else {
                        console.error("Browser does not support the runtime messaging API.");
                    }
                }
            });
        });
    });
}
