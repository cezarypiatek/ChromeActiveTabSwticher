chrome.browserAction.onClicked.addListener(function(tab) {
	chrome.tabs.query({}, function(tabs){
		chrome.tabs.sendMessage(tab.id, {
			command: "show_tabswitcher",
				allTabs: tabs		
		  },
		  function() {
		  });
	});
});

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		if(request.command == "select_tab")
		{
			chrome.tabs.update(request.tab.id, {active: true});
			sendResponse();
		}
	});
