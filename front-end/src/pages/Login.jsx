import React, {useState, useEffect} from 'react';
import styled from 'styled-components'
import {Link, useNavigate} from "react-router-dom";
import {ToastContainer, toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import axios from "axios";

import Logo from '../assets/logo.svg'
import {loginRoute} from "../utils/APIRoutes";

const Login = (props) => {
    const navigate = useNavigate()
    const [values, setValues] = useState({ username: '', password: '' })

    const toastOptions = {
        position: "bottom-right",
        autoClose: 8000,
        pauseOnHover: true,
        draggable: true,
        theme: "dark"
    }

    useEffect(() => {
        if (localStorage.getItem('chat-app-user')) {
            navigate('/')
        }
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (handleValidation()) {
            const {password, username} = values
            const {data} = await axios.post(loginRoute, { username, password })
            if (data.status === false) {
                toast.error(data.msg, toastOptions)
            }
            if (data.status === true) {
                localStorage.setItem('chat-app-user', JSON.stringify(data.user))
                navigate('/')
            }

        }
    }

    const handleValidation = () => {
        const {password, username} = values //values do useState()
        if (username.length == 0 || password.length == 0) {
            toast.error('Username and Password are required!', toastOptions)
            return false
        }

        return true
    }

    const handleChange = (e) => {
        //Na linha de baixo faz o seguinte, faz o setValues em um objeto para alterar o valor do state,
        // o [e.target.name] pega o valor do campo para usar como key de um dos objetos e o e.target.value pega o valor
        // do campo, assim formando um objeto com key : value, por exemplo: username : 'gabriel', já o ...values, faz
        // com que os dados que estavam antes no values(password, email, etc) não sejam perdidos, pois esses 3 pontos é
        // como se dissesse para usar o que sobrou também neste objeto, pois se não tiver eles, ia apagar o valor deles
        // com o do novo valor
        setValues({...values, [e.target.name] : e.target.value})
        e.preventDefault()
        // alert('Change')
    }

    return (
        <>
            <FormContainer>
                <form onSubmit={(e) => handleSubmit(e)}>
                    <div className="brand">
                        <img src={Logo} alt="Logo" className={'logo-form'}/>
                        <h1>Chatty</h1>
                    </div>
                    <input type="text" name="username" id="username" placeholder={'Enter a username'}
                           onChange={e => handleChange(e)} min={3}/>
                    <input type="password" name="password" id="password" placeholder={'Enter a password'} onChange={e => handleChange(e)}/>
                    <input type="submit" value="Login"/>
                    <span>don't have a account? <Link to={'/register'}>Register</Link> </span>
                </form>
                <ToastContainer />
            </FormContainer>
        </>

    )
};

const FormContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;

    img {
      height: 5rem;
    }

    h1 {
      color: white;
      text-transform: uppercase;
    }
  }
  form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    background-color: #00000075;
    border-radius: 2rem;
    padding: 3rem 5rem;
    input {
      background-color: transparent;
      padding: 1rem;
      border: 0.1rem solid #4e0eff;
      border-radius: 0.4em;
      color: white;
      width: 100%;
      font-size: 1rem;
      &:focus {
        border: 0.1rem solid #00000075;
        outline: none;
      }
    }
    input[type=submit] {
      background-color: #997af0;
      color: white;
      padding: 1rem 2rem;
      border: none;
      font-weight: bold;
      cursor: pointer;
      border-radius: 0.4rem;
      font-size: 1rem;
      text-transform: uppercase;
      transition: 0.5s ease-in-out;
      &:hover {
        background-color: #4e0eff;
      }
    }
    span {
      color: white;
      text-transform: uppercase;
      a {
        color: #4e0eff;
        text-decoration: none;
        font-weight: bold;
      }
    }
  }
`

export default Login;