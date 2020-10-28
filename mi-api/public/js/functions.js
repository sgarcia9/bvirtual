function validateForm() {
    var nombre = document.forms["form-bvirtual"]["nombre"].value;
    var apellidos = document.forms["form-bvirtual"]["apellidos"].value;
    var email = document.forms["form-bvirtual"]["email"].value;
    var repeat_email = document.forms["form-bvirtual"]["repeat-email"].value;
    var dni = document.forms["form-bvirtual"]["dni"].value;
    var movil = document.forms["form-bvirtual"]["movil"].value;
    var flag_error = false;
    //nombre
    if (nombre == "") {
        const el = document.querySelector('#nombre');
        if (!el.classList.contains("error-input")) {
            el.classList.add("error-input");
        }
        const el1 = document.querySelector('#error-nombre');
        el1.textContent = "Nombre no puede estar en blanco.";
        flag_error =  true;
    } else {
        const el = document.querySelector('#nombre');
        if (el.classList.contains("error-input")) {
            el.classList.remove("error-input");
        }
        const el1 = document.querySelector('#error-nombre');
        el1.textContent = "";
    }

    //apellidos
    if (apellidos == "") {
        el = document.querySelector('#apellidos');
        if (!el.classList.contains("error-input")) {
            el.classList.add("error-input");
        }
        el1 = document.querySelector('#error-apellidos');
        el1.textContent = "Apellidos no puede estar en blanco.";
        flag_error = false;
    } else {
        el = document.querySelector('#apellidos');
        if (el.classList.contains("error-input")) {
            el.classList.remove("error-input");
        }
        el1 = document.querySelector('#error-apellidos');
        el1.textContent = "";
    }

    //email
    if ((email == "" || repeat_email == "") || email != repeat_email) {
        el = document.querySelector('#email');
        if (!el.classList.contains("error-input")) {
            el.classList.add("error-input");
        }
        el1 = document.querySelector('#repeat-email');
        if (!el1.classList.contains("error-input")) {
            el1.classList.add("error-input");
        }
        var f = false;
        if (email == "") {
            el2 = document.querySelector('#error-email');
            el2.textContent = "Email no puede estar en blanco.";
            f = true;
        }

        if (repeat_email == "") {
            el3 = document.querySelector('#error-repeat-email');
            el3.textContent = "La repetición del email no puede estar en blanco.";
            f = true;
        }

        if ((email != repeat_email) && f == false) {
            el2 = document.querySelector('#error-email');
            el2.textContent = "El email y la repetición tienen que coincidir.";
            el3 = document.querySelector('#error-repeat-email');
            el3.textContent = "";
        }
        flag_error = true;
    } else {
        var emailRegex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
        if (!emailRegex.test(email)) {
            el2 = document.querySelector('#error-email');
            el2.textContent = "El email y la repetición tienen que llevar @ y .xxx.";
            el3 = document.querySelector('#error-repeat-email');
            el3.textContent = "";
            flag_error =  true;
        } else {
            el = document.querySelector('#email');
            if (el.classList.contains("error-input")) {
                el.classList.remove("error-input");
            }
            el1 = document.querySelector('#repeat-email');
            if (el1.classList.contains("error-input")) {
                el1.classList.remove("error-input");
            }
            el2 = document.querySelector('#error-email');
            el2.textContent = "";
            el3 = document.querySelector('#error-repeat-email');
            el3.textContent = "";
        }
    }

    //dni
    if (dni == "") {
        const el = document.querySelector('#dni');
        if (!el.classList.contains("error-input")) {
            el.classList.add("error-input");
        }
        const el1 = document.querySelector('#error-dni');
        el1.textContent = "Dni no puede estar en blanco.";

        flag_error =  true;
    } else {
        var result = nif(dni);
        if (result != "") {
            const el = document.querySelector('#dni');
            if (!el.classList.contains("error-input")) {
                el.classList.add("error-input");
            }
            const el1 = document.querySelector('#error-dni');
            el1.textContent = result;

            flag_error =  true;
        } else {
            el1 = document.querySelector('#dni');
            if (el1.classList.contains("error-input")) {
                el1.classList.remove("error-input");
            }
            el2 = document.querySelector('#error-dni');
            el2.textContent = "";
        }
    }

    //movil
    if (movil == "") {
        const el = document.querySelector('#movil');
        if (!el.classList.contains("error-input")) {
            el.classList.add("error-input");
        }
        const el1 = document.querySelector('#error-movil');
        el1.textContent = "Movil no puede estar en blanco.";
        flag_error =  true;
    } else {
        var expresion_regular_movil = /^[6-7]{1}[0-9]{8}$/;
        if(expresion_regular_movil.test(movil) == true){
            el1 = document.querySelector('#movil');
            if (el1.classList.contains("error-input")) {
                el1.classList.remove("error-input");
            }
            el2 = document.querySelector('#error-movil');
            el2.textContent = "";
        } else {
            const el = document.querySelector('#movil');
            if (!el.classList.contains("error-input")) {
                el.classList.add("error-input");
            }
            const el1 = document.querySelector('#error-movil');
            el1.textContent = "Movil no válido, tiene que ser 9 dígitos y empezar por 6 o 7.";
            flag_error =  true;
        }
    }

    //Comprobar que hay error para mostrarlo por pantalla y que no cambie de pantalla.
    if (flag_error == true) {
        return false;
    }

    //ajax
    if (flag_error == false) {
        var request = new XMLHttpRequest();
        request.open('POST', '/', true);
        request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');

        request.onreadystatechange = function() {
          if (xhr.readyState == XMLHttpRequest.DONE) {
            // Peticion terminada.
            if (request.status == 200) {
              // Todo salio bien
              console.log(request.response);
            } else {
              // Hubo un problema
            }
          }
        }

        var formData = new FormData(document.getElementById('form-bvirtual'));
        request.send(formData);
    }
}


function nif(dni) {
  var numero
  var letr
  var letra
  var expresion_regular_dni
 
  expresion_regular_dni = /^\d{8}[a-zA-Z]$/;
 
  if(expresion_regular_dni.test (dni) == true){
     numero = dni.substr(0,dni.length-1);
     letr = dni.substr(dni.length-1,1);
     numero = numero % 23;
     letra='TRWAGMYFPDXBNJZSQVHLCKET';
     letra=letra.substring(numero,numero+1);
    if (letra!=letr.toUpperCase()) {
       return 'Dni erroneo, la letra del NIF no se corresponde';
     }else{
       return "";
     }
  }else{
     return 'Dni erroneo, formato no válido';
   }
}