// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc,getFirestore, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDtnBXTorV3Q6hyTH-Los-2nkb4mCDe4Uo",
  authDomain: "chat-app-gs-ce7a5.firebaseapp.com",
  projectId: "chat-app-gs-ce7a5",
  storageBucket: "chat-app-gs-ce7a5.appspot.com",
  messagingSenderId: "796268266275",
  appId: "1:796268266275:web:6de9ed992e9960e2840296"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth=getAuth(app);
const db=getFirestore(app);

const signup=async(username,email,password)=>{
    try{
        const res= await createUserWithEmailAndPassword(auth,email,password); //user is created
        const user = res.user  //user created is stored in a variable
        await setDoc(doc(db,"users",user.uid),{   //adding users data in firestore (collection name is users)
            id:user.uid,
            username:username.toLowerCase(),
            email,
            name:"",            //objects
            avatar:"",
            bio: "Hey,There i am usingg chat app",
            lastSeen:Date.now()
        })
         await setDoc(doc(db,"chats",user.uid),{
            chatData:[]
         })

    }catch(error){
        console.error(error)
        toast.error(error.code.split('/')[1].split('-').join(" "));

    }
}

const login= async(email,password)=>{
    try{
        await signInWithEmailAndPassword(auth,email,password);
    }catch(error){
        console.error(error);
        toast.error(error.code.split('/')[1].split('-').join(" "));
         
    }

}
const logout= async()=>{
    try{
       await signOut(auth)

    } catch(error){
        console.error(error);
        toast.error(error.code.split('/')[1].split('-').join(" "));
         
    }
   
}

export {signup,login,logout,auth,db} //to be used in login page


