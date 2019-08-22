import React from "react";
import { Route, BrowserRouter } from 'react-router-dom';
import { RegisterForm } from "./RegisterForm";
import { LoginForm } from "./Login";
import { ExchangeForm } from './UserDashboard/ExchangeForm'
import "./App.css"
import { Dashboard } from "./Common/Dashboard";
import { WillOpenModal } from "./WillOpenModal";

function Router(props: any) {
    return <BrowserRouter>
        <Route path="/register/" exact component={RegisterForm} />
        <Route path="/login" exact component={LoginForm} />
        <Route path="/" exact component={Dashboard}/>
        <Route path="/exchange" exact component={ExchangeForm}/>
        <Route path="/aaa" exact component={WillOpenModal}/>

    </BrowserRouter>;
}

export {Router}
