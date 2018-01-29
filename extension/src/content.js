chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
    if (msg.command == "show_tabswitcher") {
        var $container = $("<div></div>",{id:"TabSwithcherContainer"});	       
        function selectFirst(){
            var allTails = $container.find(".tab_tail");
            allTails.removeClass("selected");
            allTails.filter(":visible:first").addClass("selected");
        }
        $("body").append($container);
        var $filter = $('<input type="text" />');
        $filter.on("input",function(){
            var term =  $(this).val().toLowerCase();
            $container.find(".tab_tail").each(function(){
                var thisTabInfo = $(this).data("tabInfo");
                var doesTitleContainTerm = thisTabInfo.title.toLowerCase().indexOf(term) > -1;
                var doesUrlContainTerm = thisTabInfo.url.toLowerCase().indexOf(term) > -1;
                var isDisplayed = doesTitleContainTerm || doesUrlContainTerm;
                $(this).css({
                    display: isDisplayed ? "block" : "none"
                });
            });
            setTimeout(selectFirst, 100);
        });
        $filter.on("keydown",function(e){
            if(e.which == 40)
            {
                var $selected = $container.find(".tab_tail.selected");
                var $next =  $selected.nextAll(".tab_tail:visible").first();
                if($next.length)
                {
                    $selected.removeClass("selected");
                    $next.addClass("selected");
                }
            }

            if(e.which == 38)
            {
                var $selected = $container.find(".tab_tail.selected");
                var $prev =  $selected.prevAll(".tab_tail:visible").first();
                if($prev.length)
                {
                    $selected.removeClass("selected");
                    $prev.addClass("selected");
                }
            }
            
            if(e.which == 13)
            {
                var $selected = $container.find(".tab_tail.selected");
                $selected.click();
            }
        });
        $container.append($filter);
        
        msg.allTabs.forEach(function(tab){
            var $tab  = $("<div></div>");
            $tab.data("tabInfo", tab);
            $tab.addClass("tab_tail")            
            var $tabImg = $("<img />", {src:tab.favIconUrl});           
            var $title = $("<div></div>",{text:tab.title})
            $title.addClass("tab_tail_title");
            $tab.append($tabImg);
            $tab.append($title);          
            $tab.on("click", function(){
                chrome.runtime.sendMessage({command: "select_tab", tab:tab},function(){
                    $container.remove();
                })    
            });
            $container.append($tab);
        });
        selectFirst();
        setTimeout(function(){$filter.focus();},100);
        sendResponse();
    }

    $(document).on("keyup", function(e) {
        if (e.keyCode == 27) { 
            $container.remove();
       }
   });
});




