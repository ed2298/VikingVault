import * as React from "react";
import { render } from "react-dom";
import './ProfilePage.css';
import { ProfilePicture } from './ProfilePicture';
import { ProfileData } from './ProfileData';

class ProfilePage extends React.Component<any, any>
{
      
    constructor(props: any)
    {
        super(props);
    }

    render ()
    {
        
        return (
            
            <div className = "ProfilePage">
                <ProfilePicture />
                <ProfileData />
            </div>       
        );
    }
}

export { ProfilePage }