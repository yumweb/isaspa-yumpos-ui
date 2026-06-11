import React from "react";

const SalesReceipt = () => {
  return (
    <>
      <div className="main-content">
        <div className="row manage-table receipt_small" id="receipt_wrapper">
          <div className="col-md-12" id="receipt_wrapper_inner">
            <div className="panel panel-piluku">
              <div className="panel-body panel-pad">
                <div className="row">
                  <div className="col-md-4 col-sm-4 col-xs-12">
                    <ul className="list-unstyled invoice-address">
                      <li className="invoice-logo">
                        <img src="" alt></img>
                      </li>
                      <li>Isa Spa Master Location</li>
                      <li>Prabha Plaza, Yumweb, Begumpet</li>
                      <li>1800 102 3373</li>
                      <li>GSTIN: THISISGSTNUMBER</li>
                      <li className="title">
                        <span className="pull-left">Tax Invoice</span>
                        <span className="pull-right">06-05-2022 04:24 pm</span>
                      </li>
                    </ul>
                  </div>
                  <div className="col-md-4 col-sm-4 col-xs-12">
                    <ul className="list-unstyled invoice-detail">
                      <li className="big-screen-title">
                        Tax Invoice
                        <br></br>
                        <strong>06-05-2022 04:24 pm</strong>
                      </li>
                      <li>
                        <span>Sale ID: </span>
                        S11-22-41994
                      </li>
                      <li>
                        <span>Employee:</span>
                        Sameer Joshi
                      </li>
                    </ul>
                  </div>
                  <div className="col-md-4 col-sm-4 col-xs-12">
                    <ul className="list-unstyled invoice-address invoiceto">
                      <li className="invoice-to">Invoice to:</li>
                      <li>Customer: Sameer</li>
                      <li>Phone Number : 9989311400</li>
                    </ul>
                  </div>
                </div>
                <div className="invoice-table">
                  <div className="row">
                    <div className="col-md-3 col-sm-3 col-xs-3 little-padding-print">
                      <div className="invoice-head">Item Name</div>
                    </div>
                    <div className="col-md-2 col-sm-2 col-xs-2 little-padding-print">
                      <div className="invoice-head">Service Technician</div>
                    </div>
                    <div className="col-md-2 col-sm-2 col-xs-2 little-padding-print gift_receipt_element">
                      <div className="invoice-head">Price</div>
                    </div>
                    <div className="col-md-2 col-sm-2 col-xs-2 little-padding-print">
                      <div className="invoice-head">Qty.</div>
                    </div>
                    <div className="col-md-2 col-sm-2 col-xs-2 little-padding-print gift_receipt_element">
                      <div className="invoice-head">Disc %</div>
                    </div>
                    <div className="col-md-1 col-sm-2 col-xs-1 pull-right">
                      <div className="invoice-head pull-right gift_receipt_element">
                        Total
                      </div>
                    </div>
                  </div>
                </div>
                <div className="invoice-table-content">
                  <div className="row">
                    <div className="col-md-3 col-sm-3 col-xs-3 little-padding-print">
                      <div className="invoice-content invoice-con">
                        <div className="invoice-content">
                          <strong>Keratin hair below shoulder</strong>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-2 col-sm-2 col-xs-2 little-padding-print">
                      <div className="invoice-content invoice-con">
                        <div className="invoice-content">
                          Isa Spa Hebbal Banglore
                        </div>
                      </div>
                    </div>
                    <div className="col-md-2 col-sm-2 col-xs-2 gift_receipt_element little-padding-right">
                      <div className="invoice-content">Rs.6,200.00</div>
                    </div>
                    <div className="col-md-2 col-sm-2 col-xs-2 little-padding-print">
                      <div className="invoice-content">1</div>
                    </div>
                    <div className="col-md-2 col-sm-2 col-xs-2 gift_receipt_element little-padding-print">
                      <div className="invoice-content">20</div>
                    </div>
                    <div className="col-md-1 col-sm-2 col-xs-1 gift_receipt_element pull-right">
                      <div className="invoice-content pull-right">
                        Rs.4,960.00
                      </div>
                    </div>
                  </div>
                </div>
                <div className="invoice-footer gift_receipt_element">
                  <div className="row">
                    <div className="col-md-offset-4 col-sm-offset-4 col-md-6 col-sm-6 col-xs-8">
                      <div className="invoice-footer-heading">Sub Total</div>
                    </div>
                    <div className="col-md-2 col-sm-2 col-xs-4">
                      <div className="invoice-footer-value">Rs.4,203.39</div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-offset-4 col-sm-offset-4 col-md-6 col-sm-6 col-xs-8">
                      <div className="invoice-footer-heading">9% CGST</div>
                    </div>
                    <div className="col-md-2 col-sm-2 col-xs-4">
                      <div className="invoice-footer-value">Rs.378.31</div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-offset-4 col-sm-offset-4 col-md-6 col-sm-6 col-xs-8">
                      <div className="invoice-fooetr-heading">9% SGST</div>
                    </div>
                    <div className="col-md-2 col-sm-2 col-xs-4">
                      <div className="invoice-footer-value">Rs.378.31</div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-offset-4 col-sm-offset-4 col-md-6 col-sm-6 col-xs-8">
                      <div className="invoice-footer-heading">Round</div>
                    </div>
                    <div className="col-md-2 col-sm-2 col-xs-4">
                      <div className="invoice-footer-value">Rs.0.00</div>
                    </div>
                    <div className="col-md-offset-4 col-sm-offset-4 col-md-6 col-sm-6 col-xs-8">
                      <div className="invoice-footer-heading">Total</div>
                    </div>
                    <div className="col-md-2 col-sm-2 col-xs-4">
                      <div className="invoice-footer-value invoice-total">
                        Rs.4,960.00
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-offset-4 col-sm-offset-4 col-md-6 col-sm-6 col-xs-8">
                      <div className="invoice-footer-heading">
                        Number of items sold
                      </div>
                    </div>
                    <div className="col-md-2 col-sm-2 col-xs-4">
                      <div className="invoice-footer-value invoice-total">
                        1
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-offset-6 col-sm-offset-6 col-md-2 col-sm-2 col-xs-4">
                      <div className="invoice-footer-heading">
                        06-05-2022 04:05 pm
                      </div>
                    </div>
                    <div className="col-md-2 col-sm-4 col-xs-4">
                      <div className="invoice-footer-value">Cash</div>
                    </div>
                    <div className="col-md-2 col-sm-2 col-xs-4">
                      <div className="invoice-footer-for-value">
                        Rs.4,960.00
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-offset-8 col-sm-offset-8 col-xs-offset-2 col-md-2 col-sm-2 col-xs-6">
                      <div className="invoice-footer-heading">Change Due</div>
                    </div>
                    <div className="col-md-2 col-sm-2 col-xs-4">
                      <div className="invoice-footer-value invoice-total">
                        Rs.0.00
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-offset-8 col-sm-offset-8 col-md-2 col-sm-2 col-xs-8">
                      <div className="invoice-footer-heading">Points</div>
                    </div>
                    <div className="col-md-2 col-sm-2 col-xs-4">
                      <div className="invoice-footer-value invoice-total">
                        373
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12 col-sm-12 col-xs-12">
                      <div className="text-center"></div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12 col-sm-12">
                    <div className="invoice-policy">
                      For Franchisee Enquiry Call - +18001023373
                      <br></br>
                    </div>
                    <div
                      id="receipt_type_label"
                      className="receipt_type_label invoice-policy"
                    >
                      Merchant Copy
                    </div>
                    <div id="announcement" className="invoice-policy"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SalesReceipt;
