(function () {
	function showTabSwitcher(tab) {
		chrome.tabs.query({}, function (tabs) {
			chrome.tabs.sendMessage(tab.id, {
				command: "show_tabswitcher",
				allTabs: tabs
			}, function () {});
		});
	}
	chrome.browserAction.onClicked.addListener(function (tab) {
		showTabSwitcher(tab);
	});

	chrome.commands.onCommand.addListener(function (command) {
		if (command == "show-tabswitcher") {
			chrome.tabs.getSelected(null, function(tab){
				showTabSwitcher(tab);
			});
		}
	});

	chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
		if (request.command == "select_tab") {
			chrome.tabs.update(request.tab.id, { active: true });
			sendResponse();
		}
	});
})();