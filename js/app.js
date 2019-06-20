//Configuración de tu aplicación
var firebaseConfig = {
  apiKey: "AIzaSyC3irobnGhDs8cCstSj_UBgY_rhDWqkwp0",
  authDomain: "mi-proyecto-150d9.firebaseapp.com",
  databaseURL: "https://mi-proyecto-150d9.firebaseio.com",
  projectId: "mi-proyecto-150d9",
  storageBucket: "mi-proyecto-150d9.appspot.com",
  messagingSenderId: "353426638733",
  appId: "1:353426638733:web:0f5256c0066bdfa9"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// Initialize Cloud Firestore through Firebase
var db = firebase.firestore();

// Definción de eventos para botones de registro y conexión
var re = document.getElementById("registrar");
re.addEventListener("click", registrar, false);
var co = document.getElementById("conectar");
co.addEventListener("click", conectar, false);

function registrar() {
  var email = document.getElementById("email1").value;
  var password = document.getElementById("password1").value;

  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(function () {
      confirmar();
      $("#botones").css("visibility", "hidden");
      $("#cerrarconexion").css("display", "inline");
      $("#modalRegistro").modal('hide');
    })
    .catch(function (error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      alert("Error: " + errorCode + ". " + errorMessage);
    });
}

function conectar() {
  var email = document.getElementById("email2").value;
  var password = document.getElementById("password2").value;

  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(function () {
      $("#botones").css("visibility", "hidden");
      $("#cerrarconexion").css("display", "inline");
    })
    .catch(function (error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      alert("Error: " + errorCode + ". " + errorMessage);
    });
}

function observador() {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      console.log("Existe usuario activo.");
      contenidosUsuarioRegistrado(user);

      var displayName = user.displayName;
      var email = user.email;
      var emailVerified = user.emailVerified;
      var photoURL = user.photoURL;
      var isAnonymous = user.isAnonymous;
      var uid = user.uid;
      var providerData = user.providerData;

      console.log('Usuario verificado: ' + emailVerified);
      $("#botones").css("visibility", "hidden");
      $("#cerrarconexion").css("display", "inline");
    } else {
      // User is signed out.
      console.log("No existe ningún usuario activo.");
      var contenido = document.getElementById("contenido");
      contenido.innerHTML = `
      <p class="col-sm-8 col-xl-5">Conecta para acceder a tu cuenta de registros.</p>
      `;
    }
  });
}

function contenidosUsuarioRegistrado(usuario, fechaActual) {
  var contenido = document.getElementById("contenido");
  if (usuario.emailVerified) {
    // if((new Date).getMonth() + 1) < 10) {
    //   var mes = "0" + (new Date().getMonth() + 1);
    // } else {
    //   var mes = (new Date().getMonth() +1);
    // }
    // let fechaActual = (new Date().getFullYear()) + "/" + mes + "/" + (new Date().getDate());

    contenido.innerHTML = `
      <div class="alert alert-warning alert-dismissible fade show mt-3" role="alert">
        <h4 class="alert-heading">¡Bienvenido ${usuario.email}!</h4>
        <hr>
        <p class="mb-0">Contenidos exclusivos solo para comerciales registrados.</p>
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>

      <h3 style="color:rgba(247, 247, 247); padding: 1.5em; border-radius: .5em; background: rgba(65, 105, 225, .9); margin: 1em 0 2em 0;">Gestión itinerarios de:<strong> ${usuario.email}</strong></h3>
        <div class="form-inline">
        <label for="tipTerritorio" class="col-sm-2 col-form-label">Tipo Territorio:</label>
        <span class="text-danger mr-3" title="contenido obligatorio">*</span>
          <input type="number" id="tipTerritorio" onchange="valTipTerritorio(tipTerritorio);" placeholder="Introduce código territorio" class="form-control my-3 col-5 col-sm-4 mr-3" maxlength="10" minlength="1" pattern="^(?:[1-9]|0[1-9]|10)$" required><span id="okTipTerritorio" style="display:none;"><i class="fas fa-check"></i><span>
        </div>
        <div class="form-inline">
        <label for="territorio" class="col-sm-2 col-form-label">Territorio: </label>
        <span class="text-danger mr-3" title="contenido obligatorio">*</span>
          <input type="number" id="territorio" onchange="valTerritorio(territorio);" placeholder="Introduce un territorio" class="form-control my-3 col-sm-4 mr-3" maxlenght="50" maxlength="300" minlength="1" pattern="^(?:[1-9]\d?|[12]\d{2}|300)$" required><span id="okTerritorio" style="display:none;"><i class="fas fa-check"></i><span>
        </div>
        <div class="form-inline">
        <label for="fInicio" class="col-sm-2 col-form-label">Fecha de inicio: </label>
        <span class="text-danger mr-3" title="contenido obligatorio">*</span>
          <input type="date" id="fInicio" onchange="valfInicio(fInicio);" placeholder="Introduce fecha de inicio" class="form-control my-3 col-sm-2 mr-3" required><span id="okfInicio" style="display:none;"><i class="fas fa-check"></i><span>
        </div>
        <div class="form-inline">
        <label for="fFin" class="col-sm-2 col-form-label">Fecha de fin: </label>
        <span class="text-danger mr-3" title="contenido obligatorio">*</span>
          <input type="date" id="fFin" onchange="comparaFecha(fInicio, fFin);" placeholder="Introduce fecha de fin" class="form-control my-3 col-sm-2 mr-3" required><span id="okfFin" style="display:none;"><i class="fas fa-check"></i><span>
        </div>
        <div class="form-inline">
        <label for="cuando" class="col-sm-2 col-form-label">Cuándo: </label>
        <span class="text-danger mr-3" title="contenido obligatorio">*</span>
          <textarea id="cuando" onchange="valCuando(cuando)" rows="4" cols="50" placeholder="Introduce cuando" class="form-control my-3 col-sm-4 mr-3" maxlenght="50" required></textarea><span id="okCuando" style="display:none;"><i class="fas fa-check"></i><span>
          </div>
        <div class="form-inline">
        <label for="quien" class="col-sm-2 col-form-label">Quién: </label>
        <span class="text-danger mr-3" title="contenido obligatorio">*</span>
          <input type="number" id="quien" onchange="valQuien(quien)" placeholder="Introduce tus datos" class="form-control my-3 col-sm-4  mr-3" minlength="1" maxlenght="120" pattern="^(12[0-0]|1[01][0-9]|[1-9][0-9])$" required><span id="okQuien" style="display:none;"><i class="fas fa-check"></i><span>
        </div>
      <button class="btn btn-secondary my-3" id="guardar">Guardar</button>
      <div id="act"></div>

      <table class="table container">
        <thead class="thead-dark">
          <tr>
            <th scope="col">- ID -</th>
            <th scope="col">Tipo Territorio</th>
            <th scope="col">Territorio</th>
            <th scope="col">Fecha Inicio</th>
            <th scope="col">Fecha Fin</th>
            <th scope="col">Cuándo</th>
            <th scope="col">Quién</th>
            <th scope="col">Editar</th>
            <th scope="col">Eliminar</th>
          </tr>
        </thead>
        <tbody id="tabla">
        </tbody>
      </table>
    `;
    cargarTabla();
    $("#cerrarconexion").html(`<button id="cerrar" class="btn btn-danger btn-sm ml-2">Cerrar sesión</button>`);
    var ce = document.getElementById("cerrar");
    ce.addEventListener("click", cerrar, false);
    var gu = document.getElementById("guardar");
    gu.addEventListener("click", guardar, false);
  } else {
    contenido.innerHTML = `
      <div class="alert alert-warning alert-dismissible fade show mt-3" role="alert">
        <h4 class="alert-heading">¡Bienvenido ${usuario.email}!</h4>
        <p>Activa tu cuenta para ver nuestros contenidos para usuarios registrados.</p>
        <hr>
        <p class="mb-0">Revisa tu correo electrónico</p>
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      `;
  }
}

function cerrar() {
  firebase.auth().signOut()
    .then(function () {
      console.log("Saliendo...");
      var salir = document.getElementById("salir");
      $("#botones").css("visibility", "visible");
      $("#cerrarconexion").css("display", "none");
      salir.innerHTML = `
      <div class="alert alert-warning alert-dismissible fade show mt-3" role="alert">
        <i class="fas fa-frown"></i> Esperamos verte pronto, no nos dejes abandonados.
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      `;
      cerrarconexion.innerHTML = "";
      // $("#salir").empty();
    })
    .catch(function (error) {
      console.log(error);
    });
  // revisar esto

}

function confirmar() {
  var user = firebase.auth().currentUser;

  user.sendEmailVerification().then(function () {
    // Email sent.
    console.log("Enviando correo...");
  }).catch(function (error) {
    // An error happened.
    console.log(error);
  });
}

function guardar() {
  tipTerritorio = document.getElementById("tipTerritorio").value;
  territorio = document.getElementById("territorio").value;
  fInicio = document.getElementById("fInicio").value;
  fFin = document.getElementById("fFin").value;
  cuando = document.getElementById("cuando").value;
  quien = document.getElementById("quien").value;
  if (tipTerritorio.trim() === "" || territorio.trim() === "" || fInicio.trim() === "" || fFin.trim() === "" || cuando.trim() === "" || quien.trim() === "") {
    alert("Todos los datos son obligatorios. Rellena segun formulario.");
  } else {
    /* var a = "15/06/2019"
var fecha = a.split("/").reversr().join("/")
var j = new Date(fecha)

new Date().getFullYear() + "/" + new Date().getMonth() + "/" + new Date().getDate()
*/
    var usuario = {
      tipTerritorio: tipTerritorio,
      territorio: territorio,
      fInicio: fInicio,
      fFin: fFin,
      cuando: cuando,
      quien: quien
    };

    db.collection("usuarios").add(usuario)
      .then(function (docRef) {
        console.log("Documento escrito con ID: ", docRef.id);
        document.getElementById("tipTerritorio").value = "";
        document.getElementById("territorio").value = "";
        document.getElementById("fInicio").value = "";
        document.getElementById("fFin").value = "";
        document.getElementById("cuando").value = "";
        document.getElementById("quien").value = "";
      })
      .catch(function (error) {
        console.error("Error añadiendo el documento: ", error);
      });
  }
}
// Lectura de los documentos
function cargarTabla() {
  db.collection("usuarios").onSnapshot(function (querySnapshot) {
    var tabla = document.getElementById("tabla");
    tabla.innerHTML = "";
    querySnapshot.forEach(function (doc) {
      tabla.innerHTML += `
        <tr>
          <th scope="row">${doc.id}</th>
          <td>${doc.data().tipTerritorio}</td>
          <td>${doc.data().territorio}</td>
          <td>${doc.data().fInicio}</td>
          <td>${doc.data().fFin}</td>
          <td>${doc.data().cuando}</td>
          <td>${doc.data().quien}</td>
          <td><button class="text-success alert-success btn"  onclick="editarDatos('${doc.id}', '${doc.data().tipTerritorio}', '${doc.data().territorio}', '${doc.data().fInicio}', '${doc.data().fFin}', '${doc.data().cuando}', '${doc.data().quien}' );"><i class="far fa-edit"></i></button></td>
          <td><button class="text-danger alert-danger btn" onclick="borrarDatos('${doc.id}', '${doc.data().tipTerritorio}', '${doc.data().territorio}', '${doc.data().fInicio}', '${doc.data().fFin}', '${doc.data().cuando}', '${doc.data().quien}');"><i class="far fa-trash-alt"></i></button></td>
        </tr>
      `;
    });
  });
}

// Borrar datos de documentos
function borrarDatos(parId, parTipTerritorio, parTerritorio) {
  var re = confirm("Vas a borrar estos datos: " + " - Tipo " + parTipTerritorio + " - Territorio " + parTerritorio + '...' + " ¿Estas seguro?");
  if (re == true) {
    db.collection("usuarios").doc(parId).delete()
      .then(function () {
        console.log("Usuario borrado correctamente.");
      }).catch(function (error) {
        console.error("Error borrando el usuario: ", error);
      });
  }
}

// Editar datos de documentos
function editarDatos(parId, parTipTerritorio, parTerritorio, parFinicio, parFfin, parCuando, parQuien) {
  document.getElementById("tipTerritorio").value = parTipTerritorio;
  document.getElementById("territorio").value = parTerritorio;
  document.getElementById("fInicio").value = parFinicio;
  document.getElementById("fFin").value = parFfin;
  document.getElementById("cuando").value = parCuando;
  document.getElementById("quien").value = parQuien;
  $("#guardar").css("display", "none");
  $(".linea").attr("disabled", true);
  $("#act").append("<button class='btn btn-info my-3' id='actualizar'>Guardar</button>");
  $("#actualizar").on("click", function () {
    var userRef = db.collection("usuarios").doc(parId);
    tipTerritorio = document.getElementById("tipTerritorio").value;
    territorio = document.getElementById("territorio").value;
    fInicio = document.getElementById("fInicio").value;
    fFin = document.getElementById("fFin").value;
    cuando = document.getElementById("cuando").value;
    quien = document.getElementById("quien").value;

    if (tipTerritorio.trim() === "" || territorio.trim() === "" || fInicio.trim() === "" || fFin.trim() === "" || cuando.trim() === "" || quien.trim() === "") {
      alert("Todos los campos son obligatorios");
    } else {
      return userRef.update({
          tipTerritorio: document.getElementById("tipTerritorio").value,
          territorio: document.getElementById("territorio").value,
          fInicio: document.getElementById("fInicio").value,
          fFin: document.getElementById("fFin").value,
          cuando: document.getElementById("cuando").value,
          quien: document.getElementById("quien").value
        })
        .then(function () {
          console.log("Gestión actualizada correctamente.");
          document.getElementById("tipTerritorio").value = "";
          document.getElementById("territorio").value = "";
          document.getElementById("fInicio").value = "";
          document.getElementById("fFin").value = "";
          document.getElementById("cuando").value = "";
          document.getElementById("quien").value = "";
          $("#okTipTerritorio").hide();
          $("#okTerritorio").hide();
          $("#okFInicio").hide();
          $("#okfFin").hide();
          $("#okCuando").hide();
          $("#okQuien").hide();
          $("#guardar").css("display", "inline");
          $(".linea").attr("disabled", false);
          $("#act").empty();
        })
        .catch(function (error) {
          // The document probably doesn't exist.
          console.error("Error actualizando gestión: ", error);
        });
    }
  })
}

function valTipTerritorio(tipTerritorio) {
  var expVTipTerritorio = new RegExp("^(?:[1-9]|0[1-9]|10)$");
  if (expVTipTerritorio.test(tipTerritorio.value)) {
    $("#okTipTerritorio").show();
  } else {
    alert(tipTerritorio.value + " Introduzca código de tipo de territorio correctamente.");
    document.getElementById("tipTerritorio").focus();
    return false;
  }
}

function valTerritorio(territorio) {
  var expTerritorio = new RegExp("^(?:[1-9]\d?|[12]\d{2}|300)$");
  if (expTerritorio.test(territorio.value)) {
    $("#okTerritorio").show();
  } else {
    alert(territorio.value + " Introduzca código de territorio correctamente.");
    document.getElementById("territorio").focus();
    return false;
  }
}

function valFInicio(fInicio) {
  if (fInicio.value <= Date()) {
    $("#okfInicio").show();
  } else {
    alert(fInicio.value + " No es correcta.");
    document.getElementById("fInicio").focus();
    return false;
  }
}

function comparaFecha(fInicio, fFin) {
  if (fFin.value < fInicio.value) {
    alert("La no puede ser anterior a la fecha de inicio");
    document.getElementById("fFin").focus();
    return false;
  } else {
    $("#okfFin").show();
  }
}

function valCuando(cuando) {
  var expCuando = new RegExp("^[a-zA-Z0-9,.!? ]*$");
  var compCuando = (cuando.value).trim();
  if (expCuando.test(compCuando)) {
    $("#okCuando").show();
  } else {
    alert(cuando.value + " No es correcto");
    document.getElementById("cuando").focus();
    return false;
  }
}

function valQuien(quien) {
  var expQuien = new RegExp("^(12[0-0]|1[01][0-9]|[1-9]?[0-9])$");
  if (expQuien.test(quien.value)) {
    $("#okQuien").show();
  } else {
    alert(quien.value + " No es correcto. Su identificación(1-120)");
    document.getElementById("quien").focus();
    return false;
  }
}
observador();