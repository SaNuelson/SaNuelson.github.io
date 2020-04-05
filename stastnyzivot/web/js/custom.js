// Vertical Sidebar Logic

var toggleButton = document.getElementById('navToggleButton');
var navWrapper = document.getElementById('navWrapper');
var navBar = document.getElementById('navBar');
var main = document.getElementById('mainWrapper');

function toggleCollapseVerticalNav(){
    // open menu
    if(isNavWrapperCollapsed()){
        setNavWrapperCollapsed(false);
        setMainHidden(true);
        setNavBarDisplayNone(false);
    // close menu
    }else{
        setNavWrapperCollapsed(true);
        setMainHidden(false);
        setNavBarDisplayNone(true); 
    }
}

function setMainHidden(value){
    if(value){
        if(main.style.display != "none"){
            document.body.classList.add("bg-custom-fill");
            main.style.display = "none";
        }
    }else{
        if(main.style.display == "none")
        {
            document.body.classList.remove("bg-custom-fill");
            main.style.display = "";
        }
    }
}

function setNavWrapperCollapsed(value){
    if(value){
        if(!navWrapper.classList.contains('sidebar-collapsed')){
            navWrapper.classList.add('sidebar-collapsed');
        }
    }else{
        if(navWrapper.classList.contains('sidebar-collapsed')){
            navWrapper.classList.remove('sidebar-collapsed');
        }
    }
}

function isNavWrapperCollapsed(){
    return navWrapper.classList.contains('sidebar-collapsed');
}

function setNavBarDisplayNone(value){
    if(value){
        if(navBar.style.display != 'none'){
            navBar.style.oldDisplay = navBar.style.display;
            navBar.style.display = 'none';
        }
    }else{
        if(navBar.style.display == 'none'){
            navBar.style.display = navBar.style.oldDisplay;
        }
    }
}

// undo hidden state of button when resizing to bigger screen
$(window).ready(function() {

    if (window.innerWidth >= 768) {
        setMainHidden(false);
        setNavWrapperCollapsed(false);
        setNavBarDisplayNone(false);
    }
    else {
        setMainHidden(true);
        setNavWrapperCollapsed(false);
        setNavBarDisplayNone(false);
    }

    // show page to hide sidebar collapsing
    document.body.style.display = "block";
});

$(window).resize(function() {
    if (window.innerWidth >= 768) { // width - no scollbar, outerWidth - scrollbar + window frame, innerWidth - with scrollbar, no window frame.
        setMainHidden(false);
        setNavWrapperCollapsed(false);
        setNavBarDisplayNone(false);
    }
    else {
        setMainHidden(false);
        setNavWrapperCollapsed(true);
        setNavBarDisplayNone(true);
    }
});