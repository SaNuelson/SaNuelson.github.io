// Vertical Sidebar Logic
$("#navToggleButton").click(function(){
    // open menu
    $("#navWrapper").toggleClass('sidebar-collapsed');
    $("#mainWrapper").toggle();
});

// undo hidden state of button when resizing to bigger screen
$(window).ready(function() {

    if (window.innerWidth >= 768) {
        // main displayed by default
        // nav wrapper uncollapsed by default
        // nav bar displayed by default
        console.log("Load over 768");
    }
    else {
        // main displayed by default
        $("#navWrapper").toggleClass("sidebar-collapsed");
        console.log("Load under 768.");
    }
});

$(window).resize(function() {
    if (window.innerWidth >= 768) { // width - no scollbar, outerWidth - scrollbar + window frame, innerWidth - with scrollbar, no window frame.
        $("#mainWrapper").show();
        $("#navWrapper").removeClass("sidebar-collapsed");
    }
    else {
        $("#navWrapper").removeClass("sidebar-collapsed");
        $("#mainWrapper").show();
    }
});