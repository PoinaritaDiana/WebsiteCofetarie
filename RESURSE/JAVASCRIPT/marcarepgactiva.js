function marcare() {
    var adresa = window.location.href.split("/");
    var adresacurenta = adresa[adresa.length - 1];
    var meniu = document.getElementById("meniu");
    var links = meniu.getElementsByTagName("a");

    if(adresacurenta=="")
        links[0].parentNode.classList.add("curent");
        
    for (i = 0; i < links.length; i++) {
        var linkmeniu = links[i].href.split("/");
        if (linkmeniu[linkmeniu.length - 1] == adresacurenta) {
            links[i].parentNode.classList.add("curent");
        }
    }
}