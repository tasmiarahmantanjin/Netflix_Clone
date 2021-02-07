import firebase from 'firebase'



const firebaseConfig = {
	apiKey: "AIzaSyDqmTn-ziKmNSUFhoi1h3dfNME2Ixl-ad4",
	authDomain: "netflix-clone-12de9.firebaseapp.com",
	projectId: "netflix-clone-12de9",
	storageBucket: "netflix-clone-12de9.appspot.com",
	messagingSenderId: "223763366143",
	appId: "1:223763366143:web:8e8f8bf9d7eaa9f6ffccca"
  };

  const firebaseApp = firebase.initializeApp(firebaseConfig);

  const db = firebaseApp.firestore();
  const auth = firebase.auth();

  export { auth };
  export default db;