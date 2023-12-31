// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBWuVfXqAPq5YfJfx5GmF-VCbnTrx8B9GU",
  authDomain: "dtrack-finder.firebaseapp.com",
  projectId: "dtrack-finder",
  storageBucket: "dtrack-finder.appspot.com",
  messagingSenderId: "842000276102",
  appId: "1:842000276102:web:587eea18f2efbfe2090f07",
  measurementId: "G-0VNXC4FWZ6",
};


// Initialize Firebase if not already initialized
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Create a new instance of the Google provider
var providerGoogle = new firebase.auth.GoogleAuthProvider();
function handleUserAuth(email, password, isLogin) {
  // Hide any existing error message
  showError("");

  // Show the overlay and spinner
  document.getElementById('overlay').style.display = 'flex';
  document.getElementById('loading').style.display = 'block';

  // Disable buttons
  document.getElementById('login-btn').disabled = true;
  document.getElementById('signup-btn').disabled = true;

  var authFunction;
  if (isLogin) {
    authFunction = firebase.auth().signInWithEmailAndPassword.bind(firebase.auth());
  } else {
    authFunction = firebase.auth().createUserWithEmailAndPassword.bind(firebase.auth());
  }

  authFunction(email, password)
    .then((userCredential) => {
      // If action was successful, navigate to your SPA
      window.location.href = "index.html";
    })
    .catch((error) => {
      // Hide the overlay and spinner
      document.getElementById('overlay').style.display = 'none';
      document.getElementById('loading').style.display = 'none';

      // Enable buttons
      document.getElementById('login-btn').disabled = false;
      document.getElementById('signup-btn').disabled = false;

      // Handle errors here.
      showError(error.message);
    });
}


document
  .getElementById("login-btn")
  .addEventListener("click", function (event) {
    event.preventDefault();

    // Get email and password
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;

    handleUserAuth(email, password, true);
  });

document
  .getElementById("signup-btn")
  .addEventListener("click", function (event) {
    event.preventDefault();

    // Get email and password
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;

    handleUserAuth(email, password, false);
  });

document
  .getElementById("forgot-password")
  .addEventListener("click", function (event) {
    event.preventDefault();

    var email = document.getElementById("email").value;

    if (email) {
      // Show the loading animation
      document.getElementById("loading").style.display = "block";

      // Hide any existing error message
      showError("");

      firebase
        .auth()
        .sendPasswordResetEmail(email)
        .then(function () {
          // Email sent.
          showError("Password reset email has been sent to " + email);

          // Hide the loading animation
          document.getElementById("loading").style.display = "none";
        })
        .catch(function (error) {
          // An error happened.
          showError(error.message);

          // Hide the loading animation
          document.getElementById("loading").style.display = "none";
        });
    } else {
      showError("Please enter your email address first.");
    }
  });

document
  .getElementById("toggle-password")
  .addEventListener("click", function () {
    var passwordInput = document.getElementById("password");
    var toggleButton = document.getElementById("toggle-password");
    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      toggleButton.textContent = "Hide";
    } else {
      passwordInput.type = "password";
      toggleButton.textContent = "Show";
    }
  });

document
  .getElementById("google-signin-btn")
  .addEventListener("click", function (event) {
    event.preventDefault();

    firebase
      .auth()
      .signInWithPopup(providerGoogle)
      .then(function (result) {
        // This gives you a Google Access Token.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;

        // If sign in was successful, navigate to your SPA
        window.location.href = "index.html";
      })
      .catch(function (error) {
        // Handle Errors here.
        showError(error.message);
      });
  });

function showError(message) {
  var errorMessage = document.getElementById("error-message");
  errorMessage.textContent = message;
}

function showToast(message) {
  var toast = document.getElementById("toast");
  toast.className = "show";
  toast.textContent = message;

  // After 3 seconds, remove the show class from toast
  setTimeout(function () {
    toast.className = toast.className.replace("show", "");
  }, 3000);
}

document.getElementById("email").addEventListener('blur', function() {
  var emailValidity = document.getElementById("email-validity");
  if (this.checkValidity()) {
    emailValidity.textContent = "✓";
    emailValidity.style.color = "green";
  } else {
    emailValidity.textContent = "✗";
    emailValidity.style.color = "red";
  }
});

//   // Create a new instance of the Facebook provider
//   var providerFacebook = new firebase.auth.FacebookAuthProvider();

//   document.getElementById('facebook-signin-btn').addEventListener('click', function(event) {
//     event.preventDefault();

//     firebase.auth().signInWithPopup(providerFacebook).then(function(result) {
//         // This gives you a Facebook Access Token.
//         var token = result.credential.accessToken;
//         // The signed-in user info.
//         var user = result.user;

//         // If sign in was successful, navigate to your SPA
//         window.location.href = 'index.html';
//     }).catch(function(error) {
//         // Handle Errors here.
//         console.log(error.message);
//     });
//   });
