import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider 
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import {
  getFirestore,
  setDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";



const firebaseConfig = {
  apiKey: "AIzaSyA5boG5GKWah3MZqPNbHCxkzsi-XCbm6Pc",
  authDomain: "login-form-71b7f.firebaseapp.com",
  projectId: "login-form-71b7f",
  storageBucket: "login-form-71b7f.firebasestorage.app",
  messagingSenderId: "590536831412",
  appId: "1:590536831412:web:bbd8715a05b30f866d42e1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);



function showMessage(message, divId) {
  var messageDiv = document.getElementById(divId);
  messageDiv.style.display = "block";
  messageDiv.innerHTML = message;
  messageDiv.style.opacity = 1;
  setTimeout(function () {
    messageDiv.style.opacity = 0;
  }, 5000);
}


const signUp = document.getElementById("submitSignUp");
signUp.addEventListener("click", (e) => {
  e.preventDefault();
  const email = document.getElementById("rEmail").value;
  const password = document.getElementById("rPassword").value;
  const firstname = document.getElementById("fName").value;
  const lastname = document.getElementById("lName").value;

  const auth = getAuth();
  const db = getFirestore();

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      const userData = {
        email: email,
        firstName: firstname,
        lastName: lastname,
      };
      showMessage("¡Usuario registrado exitosamente!", "signUpMessage");
      const docRef = doc(db, "users", user.uid);
      setDoc(docRef, userData)
        .then(() => {
          window.location.href = "index.html";
        })
        .catch((error) => {
          console.error("Error al escribir el documento: ", error);
        });
    })
    .catch((error) => {
      const errorCode = error.code;
      if (errorCode === "auth/email-already-in-use") {
        showMessage("El correo electrónico ya está en uso.", "signUpMessage");
      } else {
        showMessage(
          "Error al registrar el usuario: " + error.message,
          "signUpMessage"
        );
      }
    });
});



const signIn = document.getElementById("submitSignIn");
signIn.addEventListener("click", (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const auth = getAuth();
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      showMessage("¡Inicio de sesión exitoso!", "signInMessage");
      const user = userCredential.user;
      localStorage.setItem("loggedInUserId", user.uid);
      window.location.href = "homepage.html";
    })
    .catch((error) => {
      const errorCode = error.code;
      if (
        errorCode === "auth/user-not-found" ||
        errorCode === "auth/wrong-password"
      ) {
        showMessage(
          "Correo o contraseña incorrectos. Inténtelo de nuevo.",
          "signInMessage"
        );
      } else {
        showMessage(
          "Error al iniciar sesión: " + error.message,
          "signInMessage"
        );
      }
    });
});



const googleButtons = document.querySelectorAll(".google-login");
googleButtons.forEach((button) => {
  button.addEventListener("click", async () => {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    signInWithPopup(auth, provider)
      .then((userCredential) => {
        const user = userCredential.user;
        const db = getFirestore();
        const userData = {
          email: user.email,
          firstName: user.displayName ? user.displayName.split(" ")[0] : "Usuario",
          lastName: user.displayName ? user.displayName.split(" ")[1] || "" : "",
        };

        const docRef = doc(db, "users", user.uid);
        setDoc(docRef, userData)
          .then(() => {
            localStorage.setItem("loggedInUserId", user.uid);
            window.location.href = "homepage.html";
          })
          .catch((error) => {
            console.error("Error al escribir el documento: ", error);
            showMessage("Error al guardar los datos del usuario.", "signInMessage");
          });
      });
  });
});


const githubbuttons = document.querySelectorAll(".github-login");
githubbuttons.forEach((button) => {
  button.addEventListener("click", async () => {
    const provider = new GithubAuthProvider();
    const auth = getAuth();
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        const db = getFirestore();
        const userData = {
          email: user.email,
          firstName: user.displayName ? user.displayName.split(" ")[0] : "Usuario",
          lastName: user.displayName ? user.displayName.split(" ")[1] || "" : "",
        };

        const docRef = doc(db, "users", user.uid);
        setDoc(docRef, userData)
          .then(() => {
            localStorage.setItem("loggedInUserId", user.uid);
            window.location.href = "homepage.html";
          })
          .catch((error) => {
            console.error("Error al escribir el documento: ", error);
            showMessage("Error al guardar los datos del usuario.", "signInMessage");
          });
      });
  });
});
