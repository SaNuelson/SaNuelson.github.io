$(window).on("load hashchange",() => {
  // check for popup
  if (window.location.href.includes("#")) {
    let imgname = window.location.href.match(/\#.*/)[0].substr(1);
    $("img").each((_, img) => {
      if (img.src.includes(imgname))
        $(img).trigger('click');
    })
  }
})

// Get the modal
var modal = document.getElementById("imgPopupModal");
var modalImg = document.getElementById("modalImg");
var captionText = document.getElementById("modalImgCaption");
var span = document.getElementById("imgPopupCloseBtn");

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
  tryHidePopup();
}

$(document).keydown(function (e) { if (e.key === "Escape") tryHidePopup(); })

$(window).on('popstate', function () { tryHidePopup(false) });

function tryHidePopup(goBack = true) {
  if (modal.style.display !== "none") {
    if (window.history && goBack)
      window.history.back();
    modal.style.display = "none";
  }
}

var imgs = [...document.getElementsByClassName('popup-img')];
imgs.forEach((img) => {
  img.addEventListener('click', function () {
    console.log(img);
    modal.style.display = 'block';
    modalImg.src = img.src.replace("-thumbnail.jpg", ".jpg");
    captionText.innerHTML = img.alt;
    var imgname = modalImg.src.replace(/^.*[\\\/]/, '').replace(/\.[^.]*/, "");
    window.history.pushState('forward', null, window.location.href.replace(/\#.*/, "") + "#" + imgname);
  })
})