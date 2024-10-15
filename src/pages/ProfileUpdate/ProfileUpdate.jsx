import React, { useContext, useEffect, useState } from 'react'
import './ProfileUpdate.css'
import assets from '../../assets/assets'
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../../config/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import upload from '../../lib/upload';
import { AppContext } from '../../context/AppContext';

const ProfileUpdate = () => {

  const navigate=useNavigate(); 
  const [image,setImage]= useState(false);
  const [name,setName]= useState("");
  const [bio,setBio]= useState("");
  const [uid,setUid]= useState("");
  const [prevImage,setPrevImage]= useState("");
  const {setUserData}= useContext(AppContext);

  //update profile and name
   const profileUpdate=async(event)=>{
    event.preventDefault();
    try{
      if(!prevImage && !image){  //prev means if photo is not already uploaded
        toast.error('Upload profile picture');
      }
      

      const docRef=doc( db,'users',uid);
      if(image){   //if user has selected any image then upload image on storage container using uplaod in uplaod.js file
        const imgUrl=await upload(image);
        setPrevImage(imgUrl);
        await updateDoc(docRef,{
          avatar:imgUrl,
          bio:bio,
          name:name
      })
      } else{
        await updateDoc(docRef,{
          bio:bio,
          name:name
        })
      }
      //after updating user data in profile we need to update user data state as well
      const snap=await getDoc(docRef);
      setUserData(snap.data());
      navigate('/chat');  //when user save they are navigated to chat page

    }catch(error){
      console.error(error);
      toast.error(error.message);
    }



   }

  useEffect(()=>{
    onAuthStateChanged(auth, async(user)=>{
      if(user){       //if user data is available in that case save the uid of user in one state so we call setUid function
        setUid(user.uid)
        const docRef =doc(db, "users", user.uid);
        const docSnap= await getDoc(docRef);

        if(docSnap.data().name){  //if name property is available in users data
          setName(docSnap.data().name);
        }
        if(docSnap.data().bio){  //if bio property is available in users data
          setBio(docSnap.data().bio);
        }
        if(docSnap.data().avatar){  //if avatar property is available in users data
          setPrevImage(docSnap.data().avatar);
        } 
      }
      else{  //if user logout
           navigate('/')
      }
    });
  },[auth, navigate]);


  return (
    <div className='profile'>
      <div className="profile-container">
        <form onSubmit={profileUpdate}>
          <h3>Profile Details</h3>
          <label htmlFor="avatar">
            <input onChange={(e)=>setImage(e.target.files[0])} type="file" id="avatar" accept=".png, .jpg, .jpeg" hidden/>
            <img src= {image? URL.createObjectURL(image):assets.avatar_icon} alt=""/>
            upload profile image
          </label>
          <input onChange={(e)=>setName(e.target.value)} value={name} type="text" placeholder='Your name' required/>
          <textarea onChange= {(e)=>setBio(e.target.value)} value={bio} placeholder='Write profile bio' required></textarea>
          <button type="submit">Save</button>
        </form>
        <img className="profile-pic" src={image?URL.createObjectURL(image): prevImage?prevImage: assets.logo_icon} alt=""/>
      </div>
      </div>
  )
}

export default ProfileUpdate