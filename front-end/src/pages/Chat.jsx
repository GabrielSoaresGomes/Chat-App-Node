import React, {useState, useEffect, useRef} from 'react';
import styled from 'styled-components'
import {redirect, useNavigate} from "react-router-dom";
import {ToastContainer, toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import axios from "axios";
import {Buffer} from "buffer";
import { io } from 'socket.io-client'

import Loader from '../assets/loader.gif'
import {allUsersRoute, setAvatarRoute, host} from "../utils/APIRoutes";
import Contacts from "../components/Contacts";
import Welcome from "../components/Welcome";
import ChatContainer from "../components/ChatContainer";
const Chat = (props) => {

    const socket = useRef()

    const navigate = useNavigate()

    const [contacts, setContacts] = useState([])
    const [currentUser, setCurrentUser] = useState(undefined)
    const [currentChat, setCurrentChat] = useState(undefined)
    const [isLoaded, setIsLoaded] = useState(false)

    const getCurrentUser = () => {
        if (!localStorage.getItem('chat-app-user')) {
            navigate('/login')
        } else {
            const user = JSON.parse(localStorage.getItem('chat-app-user'))
            setCurrentUser(user)
            setIsLoaded(true)
        }
    }

    const getContacts = async () => {
        if (currentUser) {
            if (currentUser.isAvatarImageSet) {
                const data = await axios.get(`${allUsersRoute}/${currentUser.id}`)
                setContacts(data.data)
            } else {
                navigate('/setAvatar')
            }
        }
    }

    const handleChangeChat = (chat) => {
        setCurrentChat(chat)
    }

    useEffect(() => {
        getCurrentUser()
    }, [])

    useEffect(() => {
        if (currentUser) {
            socket.current = io(host)
            socket.current.emit('add-user', currentUser.id)
        }
    }, [currentUser])

    useEffect(() => {
        getContacts()
    }, [currentUser])

    return (
        <Container>
            <div className="container">
                <Contacts contacts={contacts} currentUser={currentUser} changeChat={handleChangeChat} />
                {isLoaded && currentChat === undefined ? <Welcome currentUser={currentUser}/>
                    : currentUser &&
                    <ChatContainer currentChat={currentChat} currentUser={currentUser} socket={socket}/>
                }
            </div>
        </Container>
    )
};

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .container {
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`

export default Chat;