import React,{useContext, useEffect} from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import Login from './pages/Login/Login'
import Chat from './pages/Chat/Chat'
import ProfileUpdate from './pages/ProfileUpdate/ProfileUpdate'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './config/firebase'
import { AppContext } from './context/AppContext'

const App = () => {

  const navigate= useNavigate();
  const {loadUserData} =useContext(AppContext)


  useEffect(()=>{
    onAuthStateChanged(auth ,async(user)=>{  ////on login and logout this method is executed

      if(user){   //if user available load the user's data
        navigate('/chat')  //if we authenticate and have the user it will be directed to chat page
        // console.log(user);
        await loadUserData(user.uid)
      }else{     //navigate the user on login page
        navigate('/')        

      }

    })  

  },[])

  return (
    <>
    <ToastContainer/>
    
      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path='/chat' element={<Chat/>}/>
        <Route path='/profile' element={<ProfileUpdate/>}/>
      </Routes>
      
      </>
  )
}

export default App