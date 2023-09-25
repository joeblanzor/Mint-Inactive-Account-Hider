document.addEventListener('DOMContentLoaded', function() {
    var enableToggle = document.getElementById('toggle');
    console.log('enableToggle ', enableToggle);
    chrome.storage.local.get('enable', function(data) {
        var enable = data.enable !== undefined ? data.enable : true;
        console.log('enabled', enable);
    
        if (enable) {
            console.log('setting checked to true');
            enableToggle.checked = true; // Set the default state to true
        }
    });

    enableToggle.addEventListener('change', function() {
        console.log('changed');
        var enable = enableToggle.checked;
        chrome.storage.local.set({ enable });

        chrome.tabs.query({url: 'https://mint.intuit.com/settings'}, function(tabs) {
        tabs.forEach(function(tab) {    
                chrome.scripting.executeScript({
                    target: {tabId: tab.id},
                    func: () => {
                        location.reload();
                        // TODO: Implement messaging from popup.js to mint-filter.js in order to prevent the need for refreshing.
                        // chrome.runtime.sendMessage("toggleInactiveAccounts");
                    }
                });
            });
        });
    });
});
