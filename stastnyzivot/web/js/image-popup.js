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

$(window).on('popstate', function () {
  if ($(location)[0].hash.includes('#popup'))
    tryHidePopup();
});

function tryHidePopup() {
  if (modal.style.display !== "none")
    modal.style.display = "none";
}

var imgs = [...document.getElementsByClassName('popup-img')];
imgs.forEach((img) => {
  img.addEventListener('click', function () {
    console.log(img);
    modal.style.display = 'block';
    modalImg.src = img.src.replace("-thumbnail.jpg", ".jpg");
    captionText.innerHTML = img.alt;

    // add state to history for being able to go back
    window.history.pushState('forward', null, '#popup');
  })
})