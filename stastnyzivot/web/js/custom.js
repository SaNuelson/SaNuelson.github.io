// Vertical Sidebar Logic

function loadSidebarElements(){
    var toggleButton = document.getElementById('navToggleButton');
    var navWrapper = document.getElementById('navWrapper');
    var navBar = document.getElementById('navBar');
    var main = document.getElementById('mainWrapper');
}

function toggleCollapseVerticalNav(){
    // open menu
    if(isNavWrapperCollapsed()){
        setNavWrapperCollapsed(false);
        setNoScroll(true);
        setNavBarDisplayNone(false);
    // close menu
    }else{
        setNavWrapperCollapsed(true);
        setNoScroll(false);
        setNavBarDisplayNone(true); 
    }
}

function setNoScroll(value){
    if(value){
        if(!document.body.classList.contains('no-scroll')){
            document.body.classList.add('no-scroll');
        }
        if(!document.documentElement.classList.contains('no-scroll')){
            document.documentElement.classList.add('no-scroll'); 
        }
    }else{
        if(document.body.classList.contains('no-scroll')){
            document.body.classList.remove('no-scroll');
        }
        if(document.documentElement.classList.contains('no-scroll')){
            document.documentElement.classList.remove('no-scroll'); 
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
    loadSidebarElements();

    if (window.innerWidth >= 768) {
        setNoScroll(false);
        setNavWrapperCollapsed(false);
        setNavBarDisplayNone(false);
    }
    else {
        setNoScroll(false);
        setNavWrapperCollapsed(true);
        setNavBarDisplayNone(true);
    }

    // show page to hide sidebar collapsing
    document.body.style.display = "block";
});

$(window).resize(function() {
    if (window.innerWidth >= 768) { // width - no scollbar, outerWidth - scrollbar + window frame, innerWidth - with scrollbar, no window frame.
        setNoScroll(false);
        setNavWrapperCollapsed(false);
        setNavBarDisplayNone(false);
    }
    else {
        setNoScroll(false);
        setNavWrapperCollapsed(true);
        setNavBarDisplayNone(true);
    }
});