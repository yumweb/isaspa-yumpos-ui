import React from "react";


const SalesReceipt = () => {
    return(
        <>
        <div className="main-content">
            <div className="site-notice" id="notice-center"> </div>
            <div className="manage_buttons hidden-print">
                <div className="row">
                    <div className="col-md-6">
                        <div className="hidden-print search no-left-border">
                            <ul className="list-inline print-buttons">
                                <li></li>
                                <li>
                                    <form action="" id="sales_change_form" method="post" acceptCharset="utf-8">
                                        <button className="btn btn-primary btn-lg hidden-print" id="edit_sale">Edit</button>
                                    </form>
                                </li>
                                <li>
                                <button class="btn btn-primary btn-lg hidden-print" id="fufillment_sheet_button" onclick="window.open('http://isaspa.yumpos.co/sales/fulfillment/1205628', 'blank');"> Fulfillment Sheet</button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}

export default SalesReceipt;