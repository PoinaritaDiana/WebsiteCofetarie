function sirOra(){
	astazi = new Date()
	hh=astazi.getHours()
	mm=astazi.getMinutes()
    ss=astazi.getSeconds()
    
    var datan = document.getElementById("datanastere").value;
    var zi=parseInt(datan.substr(0,2));
    var luna=parseInt(datan.substr(3,2));
    var an= parseInt(datan.substr(6,4));

    var lunacurenta=astazi.getMonth()+1;

    var ani = astazi.getFullYear()-an;
    var luni = lunacurenta - luna;
    var zile= astazi.getDate() - zi;


    if(lunacurenta > luna){
        if (astazi.getDate() < zi){
            luni--;
            zile = 31 + astazi.getDate() - zi;
        }
    }
    else{
        if(lunacurenta == luna){
            if (astazi.getDate() < zi){
                luni = 11;
                zile = 31 + astazi.getDate() - zi;
                ani--;
            }  
        }
        else{
            ani--;
            luni = 12 + lunacurenta - luna;
        }
    }
    
    return `${ani} ani, ${luni} luni, ${zile} zile,  ${hh} ore, ${mm} minute si ${ss} secunde `;
}

function afisInDiv(){
    document.getElementById("continut").innerHTML="Varsta: " + sirOra() + "<br> In curand, va veti putea delecta cu un tort de la cofetaria Savor cu ocazie aniversarii dumneavoastra!"
}

function varstautil(){
    document.getElementById("varsta").onclick = function(){
        document.getElementById("continut").innerHTML="Varsta: " +sirOra() + "<br> In curand, va veti putea delecta cu un tort de la cofetaria Savor cu ocazie aniversarii dumneavoastra!"
        setInterval(afisInDiv,1000);
    }
}