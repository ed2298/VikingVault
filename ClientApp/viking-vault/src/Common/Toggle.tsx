import * as React from "react";
import './Toggle.css';
import { constants } from "../Resources/Constants";

interface IToggleState{
    toggleSwitch: any
}

function Toggle (props: IToggleState){
    return (
        <label className="common-toggle">
            <input type="checkbox" onClick = {props.toggleSwitch}/>
            <span className="slider round"> </span>
        </label>
    );
}

export default Toggle;