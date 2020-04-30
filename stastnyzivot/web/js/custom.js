// Vertical Sidebar Logic
$("#navToggleButton").click(function(){
    // open menu
    $("#navWrapper").toggleClass('sidebar-collapsed');
    $("#mainWrapper").toggle();
});

let isPortrait;

// undo hidden state of button when resizing to bigger screen
$(window).ready(function() {

    if (window.innerWidth >= 768) {
        isPortrait = false;
    }
    else {
        isPortrait = true;
        $("#navWrapper").toggleClass("sidebar-collapsed");
    }
});

$(window).resize(function() {
    if (window.innerWidth >= 768 && isPortrait) { // width - no scollbar, outerWidth - scrollbar + window frame, innerWidth - with scrollbar, no window frame.
        isPortrait = false;
        $("#mainWrapper").show();
        $("#navWrapper").removeClass("sidebar-collapsed");
    }
    else if(window.innerWidth < 768 && !isPortrait) {
        isPortrait = true;
        $("#navWrapper").addClass("sidebar-collapsed");
        $("#mainWrapper").show();
    }
});