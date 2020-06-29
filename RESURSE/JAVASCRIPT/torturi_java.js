window.onload= function() { 
    var mybutton1 = document.getElementById("bt1");
    var mybutton2 = document.getElementById("bt2");
    var mybutton3 = document.getElementById("bt3");
    var mybutton4 = document.getElementById("bt4");
    var mybutton5 = document.getElementById("bt5");
    var mybutton6 = document.getElementById("bt6");

    mybutton1.onclick = function(){currentDiv(1)}
    mybutton2.onclick = function(){currentDiv(2)}
    mybutton3.onclick = function(){currentDiv(3)}
    mybutton4.onclick = function(){currentDiv(4)}
    mybutton5.onclick = function(){currentDiv(5)}
    mybutton6.onclick = function(){currentDiv(6)}

    var butprev=document.getElementById("bprev");
    var butnext=document.getElementById("bnext");

    butprev.onclick = function(){plusDivs(-1)}
    butnext.onclick = function(){plusDivs(1)}

    var slideIndex = 1;
    showDivs(slideIndex);
    
    function plusDivs(n) {
      showDivs(slideIndex += n);
    }
    
    function currentDiv(n) {
      showDivs(slideIndex = n);
    }
    
    function showDivs(n) {
      var i;
      var x = document.getElementsByClassName("mySlides");
      var dots = document.getElementsByClassName("demo");
      if (n > x.length) {slideIndex = 1}    
      if (n < 1) {slideIndex = x.length}
      for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";  
      }
      for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" w3-red", "");
      }
      x[slideIndex-1].style.display = "block";  
      dots[slideIndex-1].className += " w3-red";
    }

    marcare();
    scroll();
  
}
  