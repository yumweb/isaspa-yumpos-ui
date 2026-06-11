import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTags } from "@fortawesome/free-solid-svg-icons";

const Tags = () => {
  return (
    <>
      <div id="grid_breadcrumbs"></div>
      <div id="category_item_selection" className="row register-grid">
        <div className="category_item category col-md-2 register-holder categories-holder col-sm-3 col-xs-6">
          <p>
            <FontAwesomeIcon icon={faTags} />
            <br />
            196g
          </p>
        </div>

        <div className="category_item category col-md-2 register-holder categories-holder col-sm-3 col-xs-6">
          <p>
            <FontAwesomeIcon icon={faTags} />
            <br />
            200ml
          </p>
        </div>

        <div className="category_item category col-md-2 register-holder categories-holder col-sm-3 col-xs-6">
          <p>
            <FontAwesomeIcon icon={faTags} />
            <br />
            Cheryl's
          </p>
        </div>

        <div className="category_item category col-md-2 register-holder categories-holder col-sm-3 col-xs-6">
          <p>
            <FontAwesomeIcon icon={faTags} />
            <br />
            Clean Up O3+
          </p>
        </div>

        <div className="category_item category col-md-2 register-holder categories-holder col-sm-3 col-xs-6">
          <p>
            <FontAwesomeIcon icon={faTags} />
            <br />
            Dussehra Combo
          </p>
        </div>

        <div className="category_item category col-md-2 register-holder categories-holder col-sm-3 col-xs-6">
          <p>
            <FontAwesomeIcon icon={faTags} />
            <br />
            Express
          </p>
        </div>

        <div className="category_item category col-md-2 register-holder categories-holder col-sm-3 col-xs-6">
          <p>
            <FontAwesomeIcon icon={faTags} />
            <br />
            Face Wash Ozone
          </p>
        </div>

        <div className="category_item category col-md-2 register-holder categories-holder col-sm-3 col-xs-6">
          <p>
            <FontAwesomeIcon icon={faTags} />
            <br />
            Feet
          </p>
        </div>

        <div className="category_item category col-md-2 register-holder categories-holder col-sm-3 col-xs-6">
          <p>
            <FontAwesomeIcon icon={faTags} />
            <br />
            Hands
          </p>
        </div>

        <div className="category_item category col-md-2 register-holder categories-holder col-sm-3 col-xs-6">
          <p>
            <FontAwesomeIcon icon={faTags} />
            <br />
            Nails
          </p>
        </div>

        <div className="category_item category col-md-2 register-holder categories-holder col-sm-3 col-xs-6">
          <p>
            <FontAwesomeIcon icon={faTags} />
            <br />
            O3+
          </p>
        </div>

        <div className="category_item category col-md-2 register-holder categories-holder col-sm-3 col-xs-6">
          <p>
            <FontAwesomeIcon icon={faTags} />
            <br />
            Rica
          </p>
        </div>
      </div>
      <div className="pagination hidden-print alternate text-center tags"></div>
    </>
  );
};

export default Tags;
