windows.onload = function(){
    document.getElementById("sorteaza_medie").onclick=function(){
			var tbody=tabelash.getElementsByTagName("tbody")[0];
      var randuri=tbody.children;//tbody.getElementsByTagName("tr")
 			var vranduri=Array.prototype.slice.call(randuri);
		     
      vranduri.sort(function(a,b){// a si b sunt <tr>
        return medie(a)-medie(b);
      });

      for(let rand of vranduri){
        tbody.appendChild(rand);
			}

   }
}