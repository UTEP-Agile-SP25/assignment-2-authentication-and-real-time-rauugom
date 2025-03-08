import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "./config";
import {db} from "./config";
import { doc, setDoc, Timestamp } from "firebase/firestore";

export async function signUp(firstName, lastName, email,password) {
     try{
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        console.log("User signed up", userCredential.user.email)
        console.log("User ID", userCredential.user.uid)
        const userRef = doc(db,"users", userCredential.user.uid) // put in user collection using the user ir 
        
        await setDoc(userRef, {
            firstname: firstName,
            lastname: lastName,
            email: email,
            timestamp: new Date()
        })

     }catch(error){
        console.error("error fetching user data: ", error)
     } 
}

export async function login(email, password) {
    try{
        const response = await signInWithEmailAndPassword(auth,email,password)
        setTimeout(() =>{
            window.location.href = './user_songMenu.html'
        },2000);
    }catch(error){
        console.error("error signing user in",error)
    }
}

export async function logout(param) {
    try{
        await signOut(auth)
        setTimeout(()=>{
            window.location.href = './index.html';
        }, 2000);
        console.log("User logged out")
    }catch(error){
        console.error("Logout err", error)
    }
}