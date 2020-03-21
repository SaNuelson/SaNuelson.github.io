// Get the modal
var modal = document.getElementById("imgPopupModal");
var modalImg = document.getElementById("modalImg");
var captionText = document.getElementById("modalImgCaption");
var span = document.getElementById("imgPopupCloseBtn");

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

var imgs = [...document.getElementsByClassName('popup-img')];
imgs.forEach((img)=>{
    img.addEventListener('click',function(){
        console.log(img);
        modal.style.display = 'block';
        modalImg.src = img.src.replace("-thumbnail.jpg",".jpg");
        captionText.innerHTML = img.alt;
    })
})