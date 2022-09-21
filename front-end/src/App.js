import React from 'react';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Chat from "./pages/Chat";
import SetAvatar from "./pages/SetAvatar";

function App(props) {
    return (
        <BrowserRouter>
            <Routes>
                <Route exact path={'/register/'} element={<Register/>} />
                <Route exact path={'/login/'} element={<Login/>} />
                <Route exact path={'/setAvatar/'} element={<SetAvatar/> } />
                <Route exact path={'/'} element={<Chat/>} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;