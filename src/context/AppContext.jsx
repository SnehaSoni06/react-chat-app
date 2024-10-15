import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { createContext, useState } from "react";
import { auth, db } from "../config/firebase";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export const AppContext=createContext();

const AppContextProvider = (props) =>{

    const navigate= useNavigate();
    const [userData,setUserData]=useState(null);
    const [chatData,setChatData]=useState(null);
    const [messagesId,setMessagesId]=useState(null);
    const [messages,setMessages]=useState([]);
    const [chatUser,setChatUser]=useState(null);

    const loadUserData= async(uid)=>{ //using uid we load user data and user's chat data
        try{
             const userRef= doc(db,'users',uid);  //users is the collection name
             const userSnap=await getDoc(userRef);
             const userData= userSnap.data(); //using this method the data from user snap is stored in userData
             setUserData(userData);

             if (userData.avatar && userData.name){
                navigate('/chat');
             }else{
                navigate('/profile')
             }
             await updateDoc(userRef,{
                lastSeen:Date.now()
             })
             setInterval(async()=>{
                if(auth.chatUser){             //if user online update last seen every 1 minute
                    await updateDoc(userRef,{
                        lastSeen:Date.now()
                    })
                }

             },60000);

        } catch(error){

        }
          
    }

    //load chat data
    useEffect(()=>{
        if(userData){
            const chatRef=doc(db,'chats',userData.id);
            const unSub=onSnapshot(chatRef,async(res)=>{
                const chatItems=res.data().chatData;
                //to get other users data
                const tempData=[];
                for(const item of chatItems){
                    const userRef=doc(db,'users',item.rId); //rId displays reciever id
                    const userSnap=await getDoc(userRef);
                    const userData=userSnap.data();
                    //add users data and chat items into one object and add to tempdata
                    tempData.push({...item,userData})
                }
                setChatData(tempData.sort((a,b)=>b.updatedAt-a.updatedAt))
            })
            return ()=>{
                unSub(); 
            }

        }

    },[userData])   //whenever there is chnage in userdata this use effect will be executed






    const value={
        userData,setUserData,
        chatData,setChatData,
        loadUserData,
        messages,setMessages,
        messagesId,setMessagesId,
        chatUser,setChatUser


    }

    return(
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider