window.onload = function () {
	var ajaxRequest = new XMLHttpRequest();

	ajaxRequest.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			var obJson = JSON.parse(this.responseText);
			afiseajaJsonTemplate(obJson);
			checkLocalStorage()
			selectare();
		}
	};

	ajaxRequest.open("GET", "/JSON/prajituri.json", true);
	ajaxRequest.send();

	function afiseajaJsonTemplate(obJson) {
		let container = document.getElementById("afisTemplate");
		let textTemplate = "";
		for (let i = 0; i < obJson.prajituri.length; i++) {
			textTemplate += ejs.render("<div class='templ_prajitura'>\
				<p>ID PRODUS: <%= prajitura.id %></p>\
				<p>DENUMIRE: <%= prajitura.denumire %></p>\
				<p>GRAMAJ: <%= prajitura.gramaj %> grame </p>\
				<p>PRET: <%= prajitura.pret %> RON </p>\
                <p>DE POST: <% if(prajitura.post) { %>da<% } else { %>nu<% } %> </p>\
				<p>SE VINDE LA BUCATA: <% if(prajitura.bucata) { %>da<% } else { %>nu<% } %></p>\
				<p>TIP PRODUS: <%= prajitura.tipprodus %> </p>\
				<p>INGREDIENTE: <% for(let i=0; i<prajitura.ingrediente.length;i++){ %> <%=prajitura.ingrediente[i]%>, <%}%></p>\
				</div>", {
				prajitura: obJson.prajituri[i]
			});
		}
		container.innerHTML = textTemplate;
	}


	//---------------- scroll_top ----------------
	scroll();

	//---------------- sortare ----------------
	sortare = document.getElementById("sort");
	divproduse = document.getElementById("afisTemplate");
	prajituri = document.getElementsByClassName("templ_prajitura");

	sortare.onchange = function () {
		var list = Array.prototype.slice.call(prajituri);

		if (sortare.value == "cr") {
			list.sort(function (a, b) {
				let preta = parseInt(a.getElementsByTagName("p")[3].innerHTML.split(" ")[1]);
				let pretb = parseInt(b.getElementsByTagName("p")[3].innerHTML.split(" ")[1]);
				return preta - pretb;
			});
		} else {
			list.sort(function (a, b) {
				let preta = parseInt(a.getElementsByTagName("p")[3].innerHTML.split(" ")[1]);
				let pretb = parseInt(b.getElementsByTagName("p")[3].innerHTML.split(" ")[1]);
				return pretb - preta;
			});
		}
		for (let i = 0; i < list.length; i++)
			divproduse.appendChild(list[i]);
	}


	//---------------- filtrare ----------------
	document.getElementById("filtprod").onclick = filtrare;
	
	function filtrare () {
		filtrare = document.getElementsByName("filt");
		var op = 0
		for (let rad of filtrare) {
			if (rad.checked) {
				op = parseInt(rad.value)
				break;
			}
		}
		window.localStorage.setItem("opfiltrare", op )
		for (let i = 0; i < prajituri.length; i++)
			prajituri[i].classList.remove("hidefilt");
		if (op == 1) {
			for (let i = 0; i < prajituri.length; i++)
				if (!prajituri[i].getElementsByTagName("p")[4].innerHTML.includes("da"))
					prajituri[i].classList.add("hidefilt");
		} else {
			if (op == 2) {
				for (let i = 0; i < prajituri.length; i++)
					if (!prajituri[i].getElementsByTagName("p")[6].innerHTML.includes("patiserie"))
						prajituri[i].classList.add("hidefilt");
			} else {
				if (op == 3) {
					for (let i = 0; i < prajituri.length; i++)
						if (!prajituri[i].getElementsByTagName("p")[6].innerHTML.includes("prajitura"))
							prajituri[i].classList.add("hidefilt");
				}
			}
		}
	}
	

	//---------------- localStorage ----------------
	function checkLocalStorage() {
		let check = parseInt(window.localStorage.getItem("opfiltrare"))
		if (check){
			if(check==1)
				document.getElementById("rad1").checked = true;
			else{
				if(check==2)
					document.getElementById("rad2").checked = true;
				else
					if(check==3)
						document.getElementById("rad3").checked = true;
			}
			filtrare();
		}
	}


	//---------------- calculare minim ----------------
	document.getElementById("calcmin").onclick = function () {
		var pretmin = parseInt(prajituri[0].getElementsByTagName("p")[3].innerHTML.split(" ")[1])
		for (let i = 1; i < prajituri.length; i++) {
			let pretcurent = parseInt(prajituri[i].getElementsByTagName("p")[3].innerHTML.split(" ")[1])
			if (pretcurent < pretmin)
				pretmin = pretcurent;
		}
		var divpret = document.createElement("DIV");
		var text = document.createTextNode("Pretul minim: " + pretmin);
		divpret.appendChild(text);
		divpret.classList.add("divcalcpret")
		document.getElementById("calcularepret").appendChild(divpret);

		setTimeout(function () {
			document.getElementsByClassName("divcalcpret")[0].remove()
		}, 3000)
	}


	//---------------- calculare maxim ----------------
	document.getElementById("calcmax").onclick = function () {
		var pretmax = parseInt(prajituri[0].getElementsByTagName("p")[3].innerHTML.split(" ")[1])
		for (let i = 1; i < prajituri.length; i++) {
			let pretcurent = parseInt(prajituri[i].getElementsByTagName("p")[3].innerHTML.split(" ")[1])
			if (pretcurent > pretmax)
				pretmax = pretcurent;
		}
		var divpretmax = document.createElement("DIV");
		var textmax = document.createTextNode("Pretul maxim: " + pretmax);
		divpretmax.appendChild(textmax);
		divpretmax.classList.add("divcalcpret")
		document.getElementById("calcularepret").appendChild(divpretmax);
		setTimeout(function () {
			document.getElementsByClassName("divcalcpret")[0].remove()
		}, 3000)
	}


	//---------------- calculare suma ----------------
	function calcularesumprod(){
		setInterval(getsuma,10000)
	}
	document.getElementById("suma").onclick = calcularesumprod;
	function getsuma(){
		var listp = document.getElementsByClassName("templ_prajitura");
		var suma=0;
		for(let l=0;l<listp.length;l++)
			if(listp[l].classList.contains("selecttemplate"))
				suma = suma + parseInt(listp[l].getElementsByTagName("p")[3].innerHTML.split(" ")[1])
		document.getElementById("calcularesuma").innerHTML=" ";
		document.getElementById("calcularesuma").innerHTML = suma;
	}


	//---------------- resetare ----------------
	document.getElementById("reset").onclick = resetare;

	function resetare() {
		for (let i = 0; i < prajituri.length; i++)
			prajituri[i].classList.remove("hidefilt");
		var list = Array.prototype.slice.call(prajituri);
		list.sort(function (a, b) {
			let ida = parseInt(a.getElementsByTagName("p")[0].innerHTML.split(" ")[2]);
			let idb = parseInt(b.getElementsByTagName("p")[0].innerHTML.split(" ")[2]);
			return ida - idb;
		});

		for (let i = 0; i < list.length; i++)
			divproduse.appendChild(list[i]);

		fil = document.getElementsByName("filt");
		for (let rad of filtrare) {
			if (rad.checked) {
				rad.checked=false;
				break;
			}
		}
		localStorage.clear();
	}


	//---------------- selectare template (modificare stil)----------------
	function selectare() {
		for (var i = 0; i < document.getElementsByClassName("templ_prajitura").length; i++) {
			document.getElementsByClassName("templ_prajitura")[i].onclick = function () {
				if (this.classList.contains("selecttemplate")) {
					this.classList.remove("selecttemplate");
				} else {
					// for (var j = 0; j < document.getElementsByClassName("templ_prajitura").length; j++) {
					// 	document.getElementsByClassName("templ_prajitura")[j].classList.remove("selecttemplate")
					// }
					this.classList.add("selecttemplate");
				}
			}
		}
	}

	//---------------- setTimeout ----------------
	// setTimeout(function () {
	// 	resetare();
	// 	alert("Aplicatia a fost resetata")
	// }, 6000);
}