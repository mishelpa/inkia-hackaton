import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const firebaseConfig = {
	apiKey: "AIzaSyAKPk_uPxrH7VHv1IZ5vetuNPCGPvVq-3I",
	authDomain: "inkia-hackaton.firebaseapp.com",
	databaseURL: "https://inkia-hackaton.firebaseio.com",
	projectId: "inkia-hackaton",
	storageBucket: "inkia-hackaton.appspot.com",
	messagingSenderId: "654990055875",
	appId: "1:654990055875:web:2129188a6af1c177a94576",
	measurementId: "G-MCXVFK0B8C"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase;