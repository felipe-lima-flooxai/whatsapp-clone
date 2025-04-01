const firebase = require("firebase");
require("firebase/firestore");

export class Firebase {
    constructor(){
        this._config = {
            apiKey: "AIzaSyDl4-vfjM38Jm44DXl2W7xNHj1Qar0FVBM",
            authDomain: "whatsapp-clone-c9ba9.firebaseapp.com",
            projectId: "whatsapp-clone-c9ba9",
            storageBucket: "whatsapp-clone-c9ba9.firebasestorage.app",
            messagingSenderId: "904632101054",
            appId: "1:904632101054:web:b9ad29966b052045ac56ef",
            measurementId: "G-B6ZFVW1Y2Y"
          };
        this.init();
    }

    init(){
          // Initialize Firebase

          if(!this._initialized){
            firebase.initializeApp(this._config);

            firebase.firestore().settings({
                timestampsInSnapshots: true
            })
            this._initialized = true;
          }
          
    }

    static db(){
        return firebase.firestore();
    }

    static hd(){
        return firebase.storage();
    }

    initAuth(){
        return new Promise((s, f)=>{

            let provider = new firebase.auth.GoogleAuthProvider();

            firebase.auth().signInWithPopup(provider)
            .then(result =>{
                let token = result.credential.accessToken;
                let user = result.user;

                s(user, token);
            })
            .catch(err=>{
                console.log(err);
            });
        })
    }
}