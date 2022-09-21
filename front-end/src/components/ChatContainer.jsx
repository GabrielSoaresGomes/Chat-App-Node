import React, {useEffect, useRef, useState} from 'react';
import styled from "styled-components";
import axios from "axios";
import {v4 as uuidv4} from 'uuid'

import ChatInput from "./ChatInput";


import {getAllMessagesRoute, sendMessageRoute} from "../utils/APIRoutes";

const ChatContainer = ({currentChat, currentUser, socket}) => {

    const [messages, setMessages] = useState([])
    const [arrivalMessage, setArrivalMessage] = useState(null)

    const scrollRef = useRef()

    const fetchMessages = async () => {
        const response = await axios.post(getAllMessagesRoute, {
            from: currentUser.id,
            to: currentChat.id,
        })
        setMessages(response.data)
    }

    function padTo2Digits(num) {
        return num.toString().padStart(2, '0');
    }

    function formatDate(date) {
        return [[
            padTo2Digits(date.getDate()),
            padTo2Digits(date.getMonth() + 1),
            date.getFullYear(),
        ].join('/'), [padTo2Digits(date.getHours()),
            padTo2Digits(date.getMinutes())].join(':')].join(' ')
    }

    useEffect(() => {
        if (currentChat && currentUser) {
            fetchMessages()
        }
    }, [currentChat, currentUser])

    const handleSendMessage = async (message) => {
        await axios.post(sendMessageRoute, {
            from: currentUser.id,
            to: currentChat.id,
            message: message
        })
        socket.current.emit('send-msg', {
            to: currentChat.id,
            from: currentUser.id,
            message: message
        })

        const msgs = [...messages]
        const dateNow = Date.now()
        const dateSended = formatDate(new Date(dateNow))
        msgs.push({fromSelf: true, message: message,dateSended })
        setMessages(msgs)
    }

    useEffect(() => {
        if (socket.current) {
            const dateNow = Date.now()
            const dateSended = formatDate(new Date(dateNow))
            socket.current.on("msg-recieve", (msg) => {
                setArrivalMessage({fromSelf:false, message: msg, dateSended})
            })
        }
    }, [])

    useEffect(() => {
        arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
    }, [arrivalMessage]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <>
            {currentChat &&
                <Container>
                    <div className="chat-header">
                        <div className="user-details">
                            <div className="avatar">
                                <img src={`data:image/svg+xml;base64,${currentChat.avatarImage}`} alt="Avatar"/>
                            </div>
                            <div className="username">
                                <h3>{currentChat.username}</h3>
                            </div>
                        </div>
                    </div>
                    <div className="chat-messages">
                        {
                            messages.map(message => {
                                return (
                                    <div ref={scrollRef} key={uuidv4()}>
                                        <div className={`message ${message.fromSelf ? 'sended' : 'recieve' }`}>
                                            <div className="content">
                                                <p>
                                                    {message.message}
                                                </p>
                                                <span>
                                                    {message.dateSended}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )
                        })
                        }
                    </div>
                    <ChatInput handleSendMessage={handleSendMessage} />
                </Container>
            }
        </>
    );
};

const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 80% 10%;
  gap: 0.1rem;
  overflow: hidden;
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    grid-template-rows: 15% 70% 15%;
  }
  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
    .user-details {
      display: flex;
      align-items: center;
      gap: 1rem;
      .avatar {
        img {
          height: 3rem;
        }
      }
      .username {
        h3 {
          color: white;
        }
      }
    }
  }
  .chat-messages {
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .message {
      display: flex;
      align-items: center;
      .content {
        max-width: 40%;
        overflow-wrap: break-word;
        padding: 1rem;
        font-size: 1.1rem;
        border-radius: 1rem;
        color: #d1d1d1;
        @media screen and (min-width: 720px) and (max-width: 1080px) {
          max-width: 70%;
        }
      }
    }
    .sended {
      justify-content: flex-end;
      .content {
        background-color: #4f04ff21;
      }
    }
    .recieve {
      justify-content: flex-start;
      .content {
        background-color: #9900ff20;
      }
    }
    .content {
      span {
        font-size: .6em;
        font-weight: bolder;
        color: green;
        font-family: Arial,serif;
      }
    }
  }
`

export default ChatContainer;