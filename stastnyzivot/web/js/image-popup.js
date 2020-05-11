$(window).on("load hashchange", function() {
    // check for popup
    if (window.location.href.search("#") !== -1) {
        let imgname = window.location.href.match(/\#.*/)[0].substr(1);
        $("img").each(function(_, img) {
            if (img.src.includes(imgname))
                loadModal(img, false);
        })
    } else {
        modal.style.display = 'none';
    }
})

// Get the modal
var modal = document.getElementById("imgPopupModal");
var modalImg = document.getElementById("modalImg");
var captionText = document.getElementById("modalImgCaption");
var span = document.getElementById("imgPopupCloseBtn");

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    tryHidePopup();
}

$(document).keydown(function(e) { if (e.key === "Escape") tryHidePopup(); })

function tryHidePopup(goBack) {
    if (!goBack) goBack = true;
    if (modal.style.display !== "none") {
        if (window.history && goBack)
            window.history.back();
        modal.style.display = "none";
    }
}

var imgs = document.getElementsByClassName('popup-img');
// IE11 Compatibility
for (let i = 0; i < imgs.length; i++) {
    imgs[i].addEventListener('click', function() { loadModal(this); });
}

function loadModal(img, pushState) {
    console.log("loadModal: ", img);
    if (!pushState) pushState = true;
    console.log(img);
    modal.style.display = 'block';
    modalImg.src = img.src.replace("-thumbnail.jpg", ".jpg");
    captionText.innerHTML = img.alt;
    var imgname = modalImg.src.replace(/^.*[\\\/]/, '').replace(/\.[^.]*/, "");
    if (pushState)
        window.history.pushState('forward', null, window.location.href.replace(/\#.*/, "") + "#" + imgname);
}