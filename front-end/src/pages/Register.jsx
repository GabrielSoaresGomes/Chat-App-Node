import React, {useState, useEffect} from 'react';
import styled from 'styled-components'
import {Link, useNavigate} from "react-router-dom";
import {ToastContainer, toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import axios from "axios";

import Logo from '../assets/logo.svg'
import {registerRoute} from "../utils/APIRoutes";

const Register = (props) => {
    const navigate = useNavigate()
    const [values, setValues] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    })

    const toastOptions = {
        position: "bottom-right",
        autoClose: 8000,
        pauseOnHover: true,
        draggable: true,
        theme: "dark"
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (handleValidation()) {
            const {password, username, email} = values
            const {data} = await axios.post(registerRoute, {
                username, email, password
            })
            if (data.status === false) {
                toast.error(data.msg, toastOptions)
            }
            if (data.status === true) {
                localStorage.setItem('chat-app-user', JSON.stringify(data.user))
            }
            navigate('/')
        }
    }

    const handleValidation = () => {
        const {password, confirmPassword, username, email} = values //values do useState()
        if (password !== confirmPassword) {
            toast.error('Password and Confirm Password have to been the same!', toastOptions)
            return false
        } else if (username.length < 3) {
            toast.error('Username should be greater than 3 characters', toastOptions)
            return false
        } else if (password.length < 3) {
            toast.error('Password should be equal or greater than 8 characters', toastOptions)
            return false
        } else if (email === '') {
            toast.error('Email is required!', toastOptions)
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
                    <input type="text" name="username" id="username" placeholder={'Enter a username'} onChange={e => handleChange(e)}/>
                    <input type="email" name="email" id="email" placeholder={'Enter a email'} onChange={e => handleChange(e)}/>
                    <input type="password" name="password" id="password" placeholder={'Enter a password'} onChange={e => handleChange(e)}/>
                    <input type="password" name="confirmPassword" id="confirmPassword" placeholder={'Confirm a password'} onChange={e => handleChange(e)}/>
                    <input type="submit" value="Submit"/>
                    <span>Already have a account? <Link to={'/login'}>Login</Link> </span>
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

export default Register;