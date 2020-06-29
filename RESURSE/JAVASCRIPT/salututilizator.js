function salut(){
    var nume = prompt("Cum te numesti?");
    if (nume != null) {
       var titlu= document.getElementsByTagName('title')[0].innerHTML;
       document.getElementsByTagName('title')[0].innerHTML = "Salut " + nume + "!";
       setTimeout(function() { document.getElementsByTagName('title')[0].innerHTML = titlu}, 2000)
  }
}
