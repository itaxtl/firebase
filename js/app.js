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
      <p class="col-sm-8 col-xl-4">Conéctate para ver los contenidos exclusivos para usuarios registrados.</p>
      `;
    }
  });
}
// revisar los pattern
function contenidosUsuarioRegistrado(usuario) {
  var contenido = document.getElementById("contenido");
  if (usuario.emailVerified) {
    contenido.innerHTML = `
      <div class="alert alert-warning alert-dismissible fade show mt-3" role="alert">
        <h4 class="alert-heading">¡Bienvenido ${usuario.email}!</h4>
        <hr>
        <p class="mb-0">Contenidos exclusivos solo para comerciales registrados.</p>
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>

      <h2>Gestión comercial: ${usuario.email}</h2>
        <div class="form-inline">
          <label for="tipTerritorio" class="col-sm-2 col-form-label">Tipo Territorio: </label>
          <input type="number" id="tipTerritorio" placeholder="Introduce código territorio" class="form-control my-3 col-sm-4" maxlength="10" minlength="1">
        </div>
        <div class="form-inline">
          <label for="territorio" class="col-sm-2 col-form-label">Territorio: </label>
          <input type="number" id="territorio" placeholder="Introduce un territorio" class="form-control my-3 col-sm-4" maxlenght="50" maxlength="300" minlength="1">
        </div>
        <div class="form-inline">
          <label for="fInicio" class="col-sm-2 col-form-label">Fecha de inicio: </label>
          <input type="date" id="fInicio" placeholder="Introduce fecha de inicio" class="form-control my-3 col-sm-2" pattern="">
        </div>
        <div class="form-inline">
          <label for="fFin" class="col-sm-2 col-form-label">Fecha de fin: </label>
          <input type="date" id="fFin" placeholder="Introduce fecha de fin" class="form-control my-3 col-sm-2" pattern="">
        </div>
        <div class="form-inline">
          <label for="cuando" class="col-sm-2 col-form-label">Cuándo: </label>
          <textarea id="cuando" rows="4" cols="50" placeholder="Introduce cuando" class="form-control my-3 col-sm-4" maxlenght="50"></textarea>
          </div>
        <div class="form-inline">
          <label for="quien" class="col-sm-2 col-form-label">Quién: </label>
          <input type="number" id="quien" placeholder="Introduce tus datos" class="form-control my-3 col-sm-4" minlength="1" maxlenght="120">
        </div>
      <button class="btn btn-secondary my-3" id="guardar">Guardar</button>
      <div id="act"></div>

      <table class="table">
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
      $("#salir").empty();
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
      /* var a = "15/06/2019"
var fecha = a.split("/").reversr().join("/")
var j = new Date(fecha)

new Date().getFullYear() + "/" + new Date().getMonth() + "/" + new Date().getDate()
*/
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

observador();