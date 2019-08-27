import  React  from 'react';
import './ViewAutomaticPayments.css'
import {EditAutomaticPaymentForm} from "./EditAutomaticPaymentModal"
import { IAutomaticPayment } from './AutomaticPaymentList';
import editPaymentImg from "../Resources/images/edit_payment.png";
import "./EditAutomaticPaymentButton.css";

interface IProps {
    automaticPayment: IAutomaticPayment,
}

interface IEditAutomaticPaymentModal {
    openEditAutomaticPaymentModal: boolean,
}

class EditAutomaticPaymentButton extends React.Component<IProps, IEditAutomaticPaymentModal> {
    constructor(props: any) {
        super(props);
        this.state = {
            openEditAutomaticPaymentModal: false,
        };
    }

    handleEditAutomaticPayment = () => {
        this.setState({
                openEditAutomaticPaymentModal: true,
        });
    }

    closeEditAutomaticPaymentModal = () => {
        this.setState({
                openEditAutomaticPaymentModal: false,
        });
    }

    render() {
        return (
            <div>
                <EditAutomaticPaymentForm open={this.state.openEditAutomaticPaymentModal} onModalClose={this.closeEditAutomaticPaymentModal} automaticPayment={this.props.automaticPayment} />
                <button className = "btn edit-payment-button" onClick={ this.handleEditAutomaticPayment}>
                    <img title="Edit Automatic Payment" className="edit-payment-icon" src={editPaymentImg} alt="Edit Payment Button"></img>
                </button>
            </div>
        )
    }
}

export {EditAutomaticPaymentButton}