import React from "react";


const PaymentsView = () => {
    return(
        <div className="main-content">
            <div className="row">
                <div className="col-md-12">
                    <div className="panel panel-piluku">
                        <div className="panel-heading">
                            <h3 className="panel-title">
                                <i className="ion-edit"></i>
                                Add Payments History
                                <small>(Fields in red are required)</small>
                            </h3>
                        </div>
                        <div className="panel-body">
                            <div className="panel-content">
                                <form action="http://isaspa.yumpos.co/payments/add_payment_history" id="add_payment_history" className="form-horizontal" method="post" acceptCharset="utf-8" noValidate>
                                    <div className="form-group">
                                        <label for="payment_mode" className="col-sm-3 col-md-3 col-lg-2 control-label">Mode of payment :</label>
                                        <div className="col-sm-9 col-md-9 col-lg-10">
                                            <select name="payment_mode" className="form-control form-inps" id="payment_mode">
                                                <option value="0" selected="selected">Payment Mode</option>
                                                <option value="1" >Cash</option>
                                                <option value="2" >Cheque</option>
                                                <option value="3" >Online Payment</option>
                                                <option value="4">Bank Transfer</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label for="payment_amount" className="col-sm-3 col-md-3 col-lg-2 control-label">Amount Paid :</label>
                                        <div className="col-sm-9 col-md-9 col-lg-10">
                                            <input type="text" name="payment_amount"id="payment_amount" className="form-control" size="8"></input>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label for="payment_date" className="col-sm-3 col-md-3 col-lg-2 control-label">Payment Date :</label> 
                                        <div className="col-sm-9 col-md-9 col-lg-10">
                                            <input type="text" name="payment_date" size="8" className="form-control form-inps e-datepicker" id="payment_date"></input>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label for="subscription_period" className="col-sm-3 col-md-3 col-lg-2 control-label">Subscription Period</label>
                                        <div className="col-sm-9 col-md-9 col-lg-10">
                                            <select name="subscription_period" className="form-control form-inps" id="subscription_period">
                                                <option value="0" selected>Subscription Period</option>
                                                <option value="1">3 Months</option>
                                                <option value="2">6 Months</option>
                                                <option value="3">12 Months</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label for="account_validity" className="col-sm-3 col-md-3 col-lg-2 control-label">Account Validity :</label>
                                        <div className="col-sm-9 col-md-9 col-lg-10">
                                            <input type="text" name="account_validity"  size="8" className="form-control form-inps e-datepicker" id="account_validity"></input> 
                                        </div>
                                    </div>
                                    <div className="form-actions pull-right">
                                        <input type="submit" className="btn btn-primary btn-lg pull-right" id="payment_submit" value="Submit"></input>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PaymentsView;