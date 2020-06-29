function aparitietitlu() {
    var titlu = "COFETARIE-PRAJITURI"
    var divt = document.getElementsByClassName("divtitlu")[0]
    var lungimetitlu = titlu.length;

    for (var i = 0; i < lungimetitlu; i++) {
        var divlitera = document.createElement("DIV");
        var text = document.createTextNode(titlu[i]);
        divlitera.appendChild(text);
        divlitera.classList.add("apartitlu")
        divt.appendChild(divlitera);
        if (i <= lungimetitlu / 2)
            divlitera.classList.add("litera" + i)
        else {
            var nr = lungimetitlu - i - 1
            divlitera.classList.add("litera" + nr)
        }
    }

    function aparitieTreptata(div) {
        setInterval(function () {
            if (div.style.opacity == "1") {
                clearInterval(this)
            } else {
                div.style.opacity = (parseFloat(div.style.opacity) + 0.1).toString()
            }
        }, 100)
    }

    var inc = 0;
    var fin = lungimetitlu / 2

    setInterval(function () {
        if (inc > fin) {
            clearInterval()
        } else {
            var nume = "litera" + inc
            div1 = document.getElementsByClassName(nume)[0];
            div2 = document.getElementsByClassName(nume)[1];
            if (div1 && div2) {
                div1.style.opacity = 0;
                div2.style.opacity = 0;
                aparitieTreptata(div1)
                aparitieTreptata(div2)
            }
        }
        inc++
    }, 100)
}