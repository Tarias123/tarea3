import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import {
  getFirestore,
  getDoc,
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

const app = initializeApp(firebaseConfig);

const auth = getAuth();
const db = getFirestore();

onAuthStateChanged(auth, (user) => {
  const loggedInUserId = localStorage.getItem("loggedInUserId");
  if (loggedInUserId) {
    console.log("Usuario autenticado:", user);
    const docRef = doc(db, "users", loggedInUserId);
    getDoc(docRef)
      .then((docSnap) => {
        if (docSnap.exists()) {
          const userData = docSnap.data();
          document.getElementById("loggedUserFName").innerText =
            userData.firstName;
          document.getElementById("loggedUserEmail").innerText = userData.email;
          document.getElementById("loggedUserLName").innerText =
            userData.lastName;
        } else {
          console.log(
            "No se encontró ningún documento que coincida con el ID."
          );
        }
      })
      .catch((error) => {
        console.log("Error al obtener el documento:", error);
      });
  } else {
    console.log("ID de usuario no encontrado en el almacenamiento local.");
  }
});

const logoutButton = document.getElementById("logout");

logoutButton.addEventListener("click", () => {
  localStorage.removeItem("loggedInUserId");
  signOut(auth)
    .then(() => {
      window.location.href = "index.html";
    })
    .catch((error) => {
      console.error("Error al cerrar sesión:", error);
    });
});
