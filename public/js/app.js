// Your web app's Firebase configuration
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
      <p>Conéctate para ver los contenidos exclusivos para usuarios registrados.</p>
      `;
    }
  });
}

function contenidosUsuarioRegistrado(usuario) {
  var contenido = document.getElementById("contenido");
  if (usuario.emailVerified) {
    contenido.innerHTML = `
      <div class="alert alert-warning alert-dismissible fade show mt-3" role="alert">
        <h4 class="alert-heading">¡Bienvenido ${usuario.email}!</h4>
        <p>Siéntete a gusto en nuestro portal.</p>
        <hr>
        <p class="mb-0">Tenemos muchos contenidos exclusivos solo para usuarios registrados como tú.</p>
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>

      <h2>Agregar usuarios</h2>

      <div class="form-inline">
        <label for="nombre" class="col-sm-2 col-form-label">Nombre: </label>
        <input type="text" id="nombre" placeholder="Introduce un nombre" class="form-control my-3 col-sm-4" >
      </div>
      <div class="form-inline">
        <label for="apellido" class="col-sm-2 col-form-label">Apellido: </label>
        <input type="text" id="apellido" placeholder="Introduce un apellido" class="form-control my-3 col-sm-4" maxlenght="50" pattern="[A-Za-zÑñÁÉÍÓúáéíóúÇç\s]">
      </div>
      <div class="form-inline">
        <label for="nacimiento" class="col-sm-2 col-form-label">Nacimiento: </label>
        <input type="text" id="nacimiento" placeholder="Introduce año de nacimiento" class="form-control my-3 col-sm-1" maxlenght="4" pattern="\d{4}">
      </div>
      <button class="btn btn-info my-3" id="guardar">Guardar</button>

      <table class="table">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Nombre</th>
            <th scope="col">Apellido</th>
            <th scope="col">Nacimiento</th>
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
      $("#botones").css("visibility", "visible");
      $("#cerrarconexion").css("display", "none");
      contenido.innerHTML = `
      <div class="alert alert-warning alert-dismissible fade show mt-3" role="alert">
        <strong>¡Cáspitas!</strong> Esperamos verte pronto otra vez por nuestro portal.
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      `;
      cerrarconexion.innerHTML = "";
    })
    .catch(function (error) {
      console.log(error);
    });
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
  var usuario = {
    nombre: document.getElementById("nombre").value,
    apellido: document.getElementById("apellido").value,
    nacimiento: document.getElementById("nacimiento").value
  };

  db.collection("usuarios").add(usuario)
    .then(function (docRef) {
      console.log("Documento escrito con ID: ", docRef.id);
      document.getElementById("nombre").value = "";
      document.getElementById("apellido").value = "";
      document.getElementById("nacimiento").value = "";
    })
    .catch(function (error) {
      console.error("Error añadiendo el documento: ", error);
    });
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
          <td>${doc.data().nombre}</td>
          <td>${doc.data().apellido}</td>
          <td>${doc.data().nacimiento}</td>
          <td><button class="btn btn-success" onclick="editarDatos('${doc.id}', '${doc.data().nombre}', '${doc.data().apellido}', '${doc.data().nacimiento}');">Editar</button></td>
          <td><button class="btn btn-danger" onclick="borrarDatos('${doc.id}');">Eliminar</button></td>
        </tr>
      `;
    });
  });
}

// Borrar datos de documentos
function borrarDatos(parId) {
  db.collection("usuarios").doc(parId).delete()
    .then(function () {
      console.log("Usuario borrado correctamente.");
    }).catch(function (error) {
      console.error("Error borrando el usuario: ", error);
    });
}

// Editar datos de documentos
function editarDatos(parId, parNombre, parApellido, parNacimiento) {
  document.getElementById("nombre").value = parNombre;
  document.getElementById("apellido").value = parApellido;
  document.getElementById("nacimiento").value = parNacimiento;
  var bot = document.getElementById("actualizar");
  $("#guardar").attr("id", "actualizar");

  bot.removeEventListener('click', guardar, false);

  bot.addEventListener("click", function () {
    var userRef = db.collection("usuarios").doc(parId);

    return userRef.update({
        nombre: document.getElementById("nombre").value,
        apellido: document.getElementById("apellido").value,
        nacimiento: document.getElementById("nacimiento").value
      })
      .then(function () {
        console.log("Usuario actualizado correctamente.");
        $("#actualizar").attr("id", "guardar");
        bot.addEventListener('click', guardar, false);
      })
      .catch(function (error) {
        // The document probably doesn't exist.
        console.error("Error actualizando usuario: ", error);
      });
  }, false);
}

observador();
