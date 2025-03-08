import { doc } from "firebase/firestore"
import {login, logout, signUp} from "./auth"

const signUpForm = document.querySelector("#signupForm")
signUpForm.addEventListener("submit",(event)=>{
    event.preventDefault()
    const firstname = document.getElementById("firstName").value
    const lastname = document.getElementById("lastName").value
    const email = document.getElementById("email").value
    const password = document.getElementById("password").value

    signUp(firstname,lastname,email,password)

})

const logoutForm = document.querySelector("#logoutForm")
logoutForm.addEventListener("submit",(event)=>{
    event.preventDefault()
    //console.log("in logout listenr")
    logout()
    
})

const loginForm = document.querySelector("#loginForm")
loginForm.addEventListener("submit",(event)=>{
    event.preventDefault()
    const loginEmail = document.getElementById("loginEmail").value
    const loginPassword = document.getElementById("loginPassword").value
    login(loginEmail, loginPassword)
})