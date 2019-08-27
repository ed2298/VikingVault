import React from 'react'
import {constants, currencyEnum} from "../Resources/Constants";
import { Redirect } from 'react-router-dom';
import SideBar from '../Common/SideBar';
import TopBar from '../Common/TopBar';
import UserIcon from '../Common/UserIcon';
import './TransferFunds.css';
import '../UserDashboard/ExchangeForm.css';
import TransferFundsModal from './TransferFundsModal';
import Toggle from '../Common/Toggle';
import TransferRequests from '../UserDashboard/TransferRequests';

const transferUrl = `${constants.baseUrl}transferFunds`;
const requestUrl = `${constants.baseUrl}transferRequests`;
const currencyMap = {
  [currencyEnum.ron]: 0,
  [currencyEnum.eur]: 1,
  [currencyEnum.usd]: 2,
  [currencyEnum.yen]: 3
};

interface ITransferFundsState{
    transferedAmount: number;
    currency: string;
    cardNumber: string;
    transferDetails: string;
    modalMessage: string;
    totalBalance: number;
    openModal: boolean;
    requestTransfer: boolean;
    isButtonDisabled: boolean;
    isTransferRequested: boolean;
    requestId: number;
}

interface ITransferDataDTO{
    amount: number;
    cardNumberReciever: string;
    transferDetails: string;
    currency: string;
}

class TransferFundsPage extends React.Component<any, ITransferFundsState>{
    constructor(props:any){
        super(props);
        this.state = {
          transferedAmount: 0,
          currency: "EUR",
          cardNumber: "Card Number",
          transferDetails: "Trasnfer Details",
          modalMessage: "",
          totalBalance: 0,
          openModal: false,
          requestTransfer: false,
          isButtonDisabled: false,
          isTransferRequested: false,
          requestId: -1
        }
    }

    componentDidMount(){
      this.getTotalBalance();      
    }

    componentDidUpdate() {
      this.getTotalBalance();
    }

    setAmountToBeTransfered = (e : any) => {
        if(Number (e.target.value) <= this.state.totalBalance) {
          this.setState({
            transferedAmount: e.target.value
          });
        }
    }

    handleChangedCardNumber = (e : any) => {
        this.setState({
            cardNumber: e.target.value
        })
    }

    handleChangedTransferDetails = (e : any) => {
        this.setState({
            transferDetails: e.target.value
        })
    }

    private setCurrency = (e: any) => {
      this.setState({
        currency: e.target.value
      });
      this.getTotalBalance();
    }

    handleChangeRequestTransferState = () => {
      this.setState((oldState: ITransferFundsState) => ({
        requestTransfer: !oldState.requestTransfer
      }));
        
    }

    handleIsButtonDisabled = () => {
        this.setState((oldState: ITransferFundsState) => ({
          isButtonDisabled: !oldState.isButtonDisabled
        }));
    }

    getTotalBalance = () => {
      let token = sessionStorage.getItem('Authentication-Token');
        if(token != null) {
            fetch(constants.baseUrl+"bankAccount", {
                method: "GET",
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                  'x-access-token': token.toString()
                }
            })
            .then(response => response.json())
            .then(result => {
              this.setState({
                totalBalance: result[currencyMap[this.state.currency]].balance
              });
            });
        }
    }

    autoFillTransferRequest = (transferData: any) => {
      this.setState({
        transferedAmount: transferData.amount,
        currency: transferData.currency,
        cardNumber: transferData.cardNumberRequester,
        transferDetails: "Responding to your request to transfer money.",
        requestTransfer: false,
        isTransferRequested: true,
        requestId: transferData.id
      })
  }

    private getTransferDataFromUI = ():ITransferDataDTO => {
        return {
          amount: this.state.transferedAmount,
          cardNumberReciever: this.state.cardNumber,
          transferDetails: this.state.transferDetails,
          currency: this.state.currency
        };  
    }

    private isValidAmount = (data: ITransferDataDTO) => {
      if(data.amount == 0){
          this.setState({
            openModal: true,
            modalMessage: "Insert a proper amount to be sent!"
          })

          return false;
      }

      return true;
    }

    private getDataForTransfer = () => {
          return {
              ...this.getTransferDataFromUI(),
              isTransferRequested: this.state.isTransferRequested,
              requestId: this.state.requestId
          }
    }

    transferMoney = () => {
      
        let data = this.getDataForTransfer();

        if(this.isValidAmount(data)) {

          let token = sessionStorage.getItem('Authentication-Token');

          if(token !== null) {

            this.handleIsButtonDisabled();

            fetch(transferUrl, {
              method: "POST",
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': token.toString()
              },
              body: JSON.stringify(data)
              })
              .then(response => response.json())
              .then( response => {
                
                  this.setState({
                    openModal: true,
                    modalMessage: response
                  }); 
                  
                  this.handleIsButtonDisabled(); 
              });
          }
        }
    }

    requestTransfer = () =>
    {
      let data = this.getTransferDataFromUI();

      if(this.isValidAmount(data)) {

        let token = sessionStorage.getItem('Authentication-Token');

         if(token !== null)
        {
          this.handleIsButtonDisabled();
          console.log("Started the shit");
          fetch(requestUrl, {
            method: "POST",
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'x-access-token': token.toString()
            },
            body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then( response => {
              console.log("continued the shit");
                this.setState({
                  openModal: true,
                  modalMessage: response
                });

                this.handleIsButtonDisabled();
            });
        } 
      }
    }

    closeModal = () =>
    {
        this.setState({
          openModal: false,
          modalMessage: "",
          transferedAmount: 0
        }); 
    }

    render(){
        
        return(
            <div className = "transfer-funds-page">  
                <SideBar userType = "admin"/>
                <TopBar/>
                <UserIcon/>
                <TransferFundsModal open={this.state.openModal} closeModal={this.closeModal} message={this.state.modalMessage} />
                <div className = "transfer-funds-container">
                    <div className = "transfer-funds-left-container"> 

                            <div className = "transfer-request-toggle-container">
                                <span  className ="toggle-positioning"><Toggle toggleSwitch = {this.handleChangeRequestTransferState}/></span> 
                                <p className= {"toggle-text-container text-decoration " + (this.state.requestTransfer == true ? "toggle-deactivated-text-decoration" : "toggle-activated-text-decoration") }>Transfer</p>
                                <p className= {"toggle-text-container text-decoration " + (this.state.requestTransfer == true ? "toggle-activated-text-decoration" : "toggle-deactivated-text-decoration")}>Request</p>
                            </div>

                            <div className="transfer-data-left-container">
                               <div>
                                  <select className="form-control form-control-currency input-field" onChange={this.setCurrency}>
                                        <option selected = {this.state.currency === "EUR"} value="EUR">EUR</option>
                                        <option selected = {this.state.currency === "RON"} value="RON">RON</option>
                                        <option selected = {this.state.currency === "YEN"} value="YEN">YEN</option>
                                        <option selected = {this.state.currency === "USD"} value="USD">USD</option>
                                    </select>
                                    <div>
                                        <p className="total-balance">{this.state.totalBalance}</p>
                                    </div>
                               
                                    <div className = "amount-container-position">
                                        <p className="text-decoration">Amount</p>
                                        <input
                                                className="form-control form-control-currency input-shadow underlineIt amount-input-field"
                                                placeholder=""
                                                type="number"
                                                min="1"
                                                pattern="^[0-9]"
                                                max= {this.state.totalBalance}
                                                step="0.001"
                                                onChange={this.setAmountToBeTransfered}
                                                value={this.state.transferedAmount}
                                        />
                                   </div>
                               </div>
                            </div>
                      
                            <div className="transfer-details-container">
                                <form>
                                    <br/>
                                    <input 
                                    className="form-control form-group text-center"
                                    type="text"
                                    placeholder= {this.state.cardNumber}
                                    onChange={this.handleChangedCardNumber}/> 
                                    <input 
                                     className="form-control form-group text-center"
                                     type="cardnumber"
                                     placeholder= {this.state.transferDetails}
                                     onChange={this.handleChangedTransferDetails}/>
                                </form>

                                <button className="btn button-login transfer-request-button" disabled = {this.state.isButtonDisabled} onClick = {this.state.requestTransfer === true? this.requestTransfer : this.transferMoney}>
                                    {this.state.requestTransfer == true ? "Request Now" : "Transfer Now"}
                                </button>   
                            </div>
                    </div>
                    <div className = "transfer-funds-right-container">
                      <span className="transfer-requests-text-decoration">Transfer Requests</span>
                      <span className="transfer-requests-table-container"><TransferRequests autoFillTransferRequest = {this.autoFillTransferRequest}/></span>
                    </div> 
                </div>
            </div>         
        )
    }
}

export {TransferFundsPage}