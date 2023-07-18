// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBWuVfXqAPq5YfJfx5GmF-VCbnTrx8B9GU",
    authDomain: "dtrack-finder.firebaseapp.com",
    projectId: "dtrack-finder",
    storageBucket: "dtrack-finder.appspot.com",
    messagingSenderId: "842000276102",
    appId: "1:842000276102:web:587eea18f2efbfe2090f07",
    measurementId: "G-0VNXC4FWZ6"
  };
  
  // Initialize Firebase if not already initialized
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
  
  // Create a new instance of the Google provider
  var providerGoogle = new firebase.auth.GoogleAuthProvider();
  

  
  document.getElementById('google-signin-btn').addEventListener('click', function(event) {
    event.preventDefault();
  
    firebase.auth().signInWithPopup(providerGoogle).then(function(result) {
        // This gives you a Google Access Token.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
  
        // If sign in was successful, navigate to your SPA
        window.location.href = 'index.html';
    }).catch(function(error) {
        // Handle Errors here.
        console.log(error.message);
    });
  });


  document.getElementById('signup-btn').addEventListener('click', function(event) {
    event.preventDefault();
  
    // Get email and password
    var email = document.getElementById('username').value;
    var password = document.getElementById('password').value;
  
    // Sign up the user
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // If sign up was successful, navigate to your SPA
        window.location.href = 'index.html';
      })
      .catch((error) => {
        // Handle errors here.
        console.log(error.message);
      });
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










