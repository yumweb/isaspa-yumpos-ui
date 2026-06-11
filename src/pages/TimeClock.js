import React from "react";
import { faClock } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ClockingOut from "./components/ClockingOut";

const TimeClock = () => {
  return (
    <>
      <div className="main-content">
        <div className="site-notice" id="notice-center"></div>
        <div className="row">
          <div className="col-md-12">
            <div className="panel">
              <div className="panel-body">
                <div className="form-group">
                  Comments:
                  <textarea
                    name="comment"
                    cols={20}
                    rows={3}
                    id="comment"
                    className="form-control text-area"
                  ></textarea>
                </div>
                <div
                  className="timeclocks justify-content-between w-100 flex-column"
                  id="clock_out_actions"
                >
                  <ul className="d-flex w-100 justify-content-between">
                    <li>
                      <a href="" id="clock_out" className="btn btn-primary">
                        <FontAwesomeIcon icon={faClock} className="clock" />
                        Clock out
                      </a>
                      <br />
                      <small className="help-block">
                        (Click here at the time of store closing)
                      </small>
                    </li>
                    <li className="pull-right">
                      <ClockingOut />
                      <br />
                      <small className="help-block">
                        (Click here only if you are switching login accounts.
                        <br />
                        Please DO NOT use this option for store closing)
                      </small>
                    </li>
                  </ul>
                </div>
                <p className="timeclock-para">
                  Please complete daily Opening & Closing checklist based on
                  status of the tasks. The checklist completion scores will be
                  sent with daily report notifications.
                </p>
                <div className="row">
                  <div className="col-md-6">
                    <div className="panels panel-info">
                      <div className="panel-heading">
                        <h3 className="panel-title">Opening Checklist</h3>
                      </div>
                      <div className="checklist">
                        <form id="checkinlist">
                          <div className="row">
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                value=""
                                id="flexCheckDefault"
                              />
                              <label
                                className="form-check-label"
                                for="flexCheckDefault"
                              >
                                <h6 className="font">
                                  Check All The Water Outlets And Check For The
                                  Hot Water And Any Faulty Taps
                                </h6>
                              </label>
                            </div>
                            <hr />
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                value=""
                                id="flexCheckDefault"
                              />
                              <label
                                className="form-check-label"
                                for="flexCheckDefault"
                              >
                                <h6 className="font">
                                  Check All The Salon Equipment / Towel Warmers
                                  / Sterlizers
                                </h6>
                              </label>
                            </div>
                            <hr />
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                value=""
                                id="flexCheckDefault"
                              />
                              <label
                                className="form-check-label"
                                for="flexCheckDefault"
                              >
                                <h6 className="font">
                                  Check The Business Cards / Feedback Forms /
                                  Guest Info Cards Availability
                                </h6>
                              </label>
                            </div>
                            <hr />
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                value=""
                                id="flexCheckDefault"
                              />
                              <label
                                className="form-check-label"
                                for="flexCheckDefault"
                              >
                                <h6 className="font">
                                  Complete The Salon Sanitation Checklist With
                                  The Help Of House Keeping Staff
                                </h6>
                              </label>
                            </div>
                            <hr />
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                value=""
                                id="flexCheckDefault"
                              />
                              <label
                                className="form-check-label"
                                for="flexCheckDefault"
                              >
                                <h6 className="font">
                                  Check For Client Appointments And Check For
                                  The Service Provider Availability And Act
                                  Accordingly
                                </h6>
                              </label>
                            </div>
                            <hr />
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                value=""
                                id="flexCheckDefault"
                              />
                              <label
                                className="form-check-label"
                                for="flexCheckDefault"
                              >
                                <h6 className="font">
                                  Check For The Adequacy Of Towels And Call The
                                  Laundry Services For Either Pick-Up Or
                                  Delivery
                                </h6>
                              </label>
                            </div>
                            <hr />
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                value=""
                                id="flexCheckDefault"
                              />
                              <label
                                className="form-check-label"
                                for="flexCheckDefault"
                              >
                                <h6 className="font">
                                  Organize All Work Places As Per The Specified
                                  Display Standards And Remove Any Unclassified
                                  Items From The Eyesight
                                </h6>
                              </label>
                            </div>
                            <hr />
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                value=""
                                id="flexCheckDefault"
                              />
                              <label
                                className="form-check-label"
                                for="flexCheckDefault"
                              >
                                <h6 className="font">
                                  Check For Pantry Provisions And Order Supplies
                                  If Any Items Are Missing
                                </h6>
                              </label>
                            </div>
                            <hr />
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                value=""
                                id="flexCheckDefault"
                              />
                              <label
                                className="form-check-label"
                                for="flexCheckDefault"
                              >
                                <h6 className="font">
                                  Open The Windows Or Blinds To Allow Enough
                                  Light While House Keeping Is Under Progress
                                </h6>
                              </label>
                            </div>
                            <hr />
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                value=""
                                id="flexCheckDefault"
                              />
                              <label
                                className="form-check-label"
                                for="flexCheckDefault"
                              >
                                <h6 className="font">
                                  Keep All The House Keeping Items In The
                                  Janitor Closet And Lock The Closet As Soon As
                                  The Cleaning Gets Over{" "}
                                </h6>
                              </label>
                            </div>
                            <hr />
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                value=""
                                id="flexCheckDefault"
                              />
                              <label
                                className="form-check-label"
                                for="flexCheckDefault"
                              >
                                <h6 className="font">
                                  Check Staff Uniforms Buffer Stock And Send
                                  Soiled Uniforms For Laundry
                                </h6>
                              </label>
                            </div>
                            <hr />
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                value=""
                                id="flexCheckDefault"
                              />
                              <label
                                className="form-check-label"
                                for="flexCheckDefault"
                              >
                                <h6 className="font">
                                  Clean The Oil Diffusers And Keep Light Them Up
                                  With Frangance Oil - Check The Automatic Air
                                  Freshner Level And Functioning
                                </h6>
                              </label>
                            </div>
                            <hr />
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                value=""
                                id="flexCheckDefault"
                              />
                              <label
                                className="form-check-label"
                                for="flexCheckDefault"
                              >
                                <h6 className="font">
                                  Check The Freshness Of The Flowers In The
                                  Wurli And The Flower Boquet In The Reception
                                </h6>
                              </label>
                            </div>
                            <hr />
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                value=""
                                id="flexCheckDefault"
                              />
                              <label
                                className="form-check-label"
                                for="flexCheckDefault"
                              >
                                <h6 className="font">
                                  Keep Fresh Towels In Hot And Cold Towel
                                  Gadgets
                                </h6>
                              </label>
                            </div>
                            <hr />
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                value=""
                                id="flexCheckDefault"
                              />
                              <label
                                className="form-check-label"
                                for="flexCheckDefault"
                              >
                                <h6 className="font">
                                  Check For Isa Spa Branded Dry Tissue Boxes
                                  And Wet Tissues Stock Levels And In Display
                                </h6>
                              </label>
                            </div>
                            <hr />
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                value=""
                                id="flexCheckDefault"
                              />
                              <label
                                className="form-check-label"
                                for="flexCheckDefault"
                              >
                                <h6 className="font">
                                  Replinish The Hand Wash Body Wash And Shampoo
                                  In The Dispensers.
                                </h6>
                              </label>
                            </div>
                            <hr />
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                value=""
                                id="flexCheckDefault"
                              />
                              <label
                                className="form-check-label"
                                for="flexCheckDefault"
                              >
                                <h6 className="font">
                                  Check The Toilet Paper Rolls And Paper Towels
                                  In The Dispenser.
                                </h6>
                              </label>
                            </div>
                            <hr />
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                value=""
                                id="flexCheckDefault"
                              />
                              <label
                                className="form-check-label"
                                for="flexCheckDefault"
                              >
                                <h6 className="font">
                                  Check For The Fragnace Levels From POT POURRI
                                </h6>
                              </label>
                            </div>
                            <hr />
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                value=""
                                id="flexCheckDefault"
                              />
                              <label
                                className="form-check-label"
                                for="flexCheckDefault"
                              >
                                <h6 className="font">
                                  Ensure Salon Is Free From Bad Odour
                                </h6>
                              </label>
                            </div>
                            <hr />
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                value=""
                                id="flexCheckDefault"
                              />
                              <label
                                className="form-check-label"
                                for="flexCheckDefault"
                              >
                                <h6 className="font">
                                  Ensure Proper Power Supply Throughout The
                                  Salon
                                </h6>
                              </label>
                            </div>
                            <hr />
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                value=""
                                id="flexCheckDefault"
                              />
                              <label
                                className="form-check-label"
                                for="flexCheckDefault"
                              >
                                <h6 className="font">
                                  Note The Meter Readings At The Start Of The
                                  Business Hours
                                </h6>
                              </label>
                            </div>
                            <hr />
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                value=""
                                id="flexCheckDefault"
                              />
                              <label
                                className="form-check-label"
                                for="flexCheckDefault"
                              >
                                <h6 className="font">
                                  Update The Management About The Store Opening
                                  By Calling From The Fixed Land Line
                                </h6>
                              </label>
                            </div>
                            <hr />
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                value=""
                                id="flexCheckDefault"
                              />
                              <label
                                className="form-check-label"
                                for="flexCheckDefault"
                              >
                                <h6 className="font">
                                  Turn On On The Desktop, Billing Printer ,
                                  Credit Card Machine, Video And Music Player
                                </h6>
                              </label>
                            </div>
                            <hr />
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                value=""
                                id="flexCheckDefault"
                              />
                              <label
                                className="form-check-label"
                                for="flexCheckDefault"
                              >
                                <h6 className="font">
                                  Look For Any Missed Calls Or Voice Messages
                                </h6>
                              </label>
                            </div>
                            <hr />
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                value=""
                                id="flexCheckDefault"
                              />
                              <label
                                className="form-check-label"
                                for="flexCheckDefault"
                              >
                                <h6 className="font">
                                  Look After Cleanlisness Of The Floor , Sinks ,
                                  Bowls ,Styling Station Areas , Trolleys ,
                                  Trays , Wash Rooms And Trash Bins
                                </h6>
                              </label>
                            </div>
                            <hr />
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                value=""
                                id="flexCheckDefault"
                              />
                              <label
                                className="form-check-label"
                                for="flexCheckDefault"
                              >
                                <h6 className="font">
                                  Ensure Staff Attendance Register And Or
                                  Biometric Attendance System Is Available
                                  Before They Arrive
                                </h6>
                              </label>
                            </div>
                            <hr />
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                value=""
                                id="flexCheckDefault"
                              />
                              <label
                                className="form-check-label"
                                for="flexCheckDefault"
                              >
                                <h6 className="font">
                                  Keep Check On The Personal Grooming Of The
                                  Staff
                                </h6>
                              </label>
                            </div>
                            <hr />
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                value=""
                                id="flexCheckDefault"
                              />
                              <label
                                className="form-check-label"
                                for="flexCheckDefault"
                              >
                                <h6 className="font">
                                  Ensure Chairs And Sofas In The Waiting Areas
                                  Are Cleaned And Properly Arranged
                                </h6>
                              </label>
                            </div>
                            <hr />
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                value=""
                                id="flexCheckDefault"
                              />
                              <label
                                className="form-check-label"
                                for="flexCheckDefault"
                              >
                                <h6 className="font">
                                  Check For Proper Collection Of Magazines At
                                  The Reception And Organize Them Into Proper
                                  Display
                                </h6>
                              </label>
                            </div>
                            <hr />
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                value=""
                                id="flexCheckDefault"
                              />
                              <label
                                className="form-check-label"
                                for="flexCheckDefault"
                              >
                                <h6 className="font">
                                  Check For Stock (In Salon Inventory And
                                  Retail) Availability And Update Accordingly
                                </h6>
                              </label>
                            </div>
                            <hr />
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                value=""
                                id="flexCheckDefault"
                              />
                              <label
                                className="form-check-label"
                                for="flexCheckDefault"
                              >
                                <h6 className="font">
                                  Turn On Vending Machine, Bubble Top Water
                                  Dispenser And Fridge
                                </h6>
                              </label>
                            </div>
                            <hr />
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                value=""
                                id="flexCheckDefault"
                              />
                              <label
                                className="form-check-label"
                                for="flexCheckDefault"
                              >
                                <h6 className="font">
                                  Ensure That The Store Is Ready To Start Up
                                  With Services For Today
                                </h6>
                              </label>
                            </div>
                            <hr />
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                value=""
                                id="flexCheckDefault"
                              />
                              <label
                                className="form-check-label"
                                for="flexCheckDefault"
                              >
                                <h6 className="font">
                                  Check For The Availability Of Valet Parking
                                  Slips At The Valet Desk
                                </h6>
                              </label>
                            </div>
                            <hr />
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                value=""
                                id="flexCheckDefault"
                              />
                              <label
                                className="form-check-label"
                                for="flexCheckDefault"
                              >
                                <h6 className="font">
                                  Check The Overhead Tank Water Level
                                </h6>
                              </label>
                            </div>
                            <hr />
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                value=""
                                id="flexCheckDefault"
                              />
                              <label
                                className="form-check-label"
                                for="flexCheckDefault"
                              >
                                <h6 className="font">
                                  Check For The Availability Of All Registers At
                                  The Security Desk
                                </h6>
                              </label>
                            </div>
                            <hr />
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                value=""
                                id="flexCheckDefault"
                              />
                              <label
                                className="form-check-label"
                                for="flexCheckDefault"
                              >
                                <h6 className="font">
                                  Switch On All The Lights And Check For Any
                                  Faulty Lights
                                </h6>
                              </label>
                            </div>
                            <hr />
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                value=""
                                id="flexCheckDefault"
                              />
                              <label
                                className="form-check-label"
                                for="flexCheckDefault"
                              >
                                <h6 className="font">
                                  Switch On The Geiser And Water Pressure Pump
                                </h6>
                              </label>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="paneled panel-success">
                      <div className="panel-heading">
                        <h3 className="panel-title">Closing Checklist</h3>
                      </div>
                      <div>
                        <div className="checklists">
                          <form id="checkoutlist">
                            <div className="row">
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  value=""
                                  id="flexCheckDefault"
                                />
                                <label
                                  className="form-check-label"
                                  for="flexCheckDefault"
                                >
                                  <h6 className="font">
                                    Make Sure All Appointments For The Next Day
                                    Are Confirmed
                                  </h6>
                                </label>
                              </div>
                              <hr />
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  value=""
                                  id="flexCheckDefault"
                                />
                                <label
                                  className="form-check-label"
                                  for="flexCheckDefault"
                                >
                                  <h6 className="font">
                                    Ensure All The Used Equipment And
                                    Instruments Are Cleaned With Hot Water Using
                                    A Soap Or Disinfectant
                                  </h6>
                                </label>
                              </div>
                              <hr />
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  value=""
                                  id="flexCheckDefault"
                                />
                                <label
                                  className="form-check-label"
                                  for="flexCheckDefault"
                                >
                                  <h6 className="font">
                                    All The Used Lenin To Be Dropped In The Bin
                                    Trolleys Without Fail
                                  </h6>
                                </label>
                              </div>
                              <hr />
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  value=""
                                  id="flexCheckDefault"
                                />
                                <label
                                  className="form-check-label"
                                  for="flexCheckDefault"
                                >
                                  <h6 className="font">
                                    Ensure No Equipment Or Instrument Is Left On
                                    The Work Station After The Service
                                  </h6>
                                </label>
                              </div>
                              <hr />
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  value=""
                                  id="flexCheckDefault"
                                />
                                <label
                                  className="form-check-label"
                                  for="flexCheckDefault"
                                >
                                  <h6 className="font">
                                    Make Sure All Equipment , Instruments Used
                                    Are Cleaned , Disinfected And Placed In
                                    Proper Place
                                  </h6>
                                </label>
                              </div>
                              <hr />
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  value=""
                                  id="flexCheckDefault"
                                />
                                <label
                                  className="form-check-label"
                                  for="flexCheckDefault"
                                >
                                  <h6 className="font">
                                    Clean All The Used Trolley, Trays And Bowls
                                    And Place Them In Appropriate Places
                                  </h6>
                                </label>
                              </div>
                              <hr />
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  value=""
                                  id="flexCheckDefault"
                                />
                                <label
                                  className="form-check-label"
                                  for="flexCheckDefault"
                                >
                                  <h6 className="font">
                                    Clean Off The Floor Around The Work Stations
                                    To Ensure It Is Free Of Any Hair , Wax Or
                                    Water
                                  </h6>
                                </label>
                              </div>
                              <hr />
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  value=""
                                  id="flexCheckDefault"
                                />
                                <label
                                  className="form-check-label"
                                  for="flexCheckDefault"
                                >
                                  <h6 className="font">
                                    Vacum The Entire Salon And Make A Note Of
                                    Any Individual Work Station Not Cleaned
                                  </h6>
                                </label>
                              </div>
                              <hr />
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  value=""
                                  id="flexCheckDefault"
                                />
                                <label
                                  className="form-check-label"
                                  for="flexCheckDefault"
                                >
                                  <h6 className="font">
                                    Prepare The Daily Sales And Service Report
                                    And Send It To Salon Manager/ Owner And HO
                                    Before Signing-Off
                                  </h6>
                                </label>
                              </div>
                              <hr />
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  value=""
                                  id="flexCheckDefault"
                                />
                                <label
                                  className="form-check-label"
                                  for="flexCheckDefault"
                                >
                                  <h6 className="font">
                                    Send The Attendance Report Of The Day To
                                    Salon Manager / Owner And HO Before Signing
                                    - Off
                                  </h6>
                                </label>
                              </div>
                              <hr />
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  value=""
                                  id="flexCheckDefault"
                                />
                                <label
                                  className="form-check-label"
                                  for="flexCheckDefault"
                                >
                                  <h6 className="font">
                                    Update The Cash Book For Closing Cash And
                                    Checkout The Settlement In Swipe Machine
                                  </h6>
                                </label>
                              </div>
                              <hr />
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  value=""
                                  id="flexCheckDefault"
                                />
                                <label
                                  className="form-check-label"
                                  for="flexCheckDefault"
                                >
                                  <h6 className="font">
                                    Turn Off The Credit Card Machine , Desktops
                                    , Stereo , Video , Vending Machine , Bubble
                                    Top Dispenser And Any Other Equipment
                                  </h6>
                                </label>
                              </div>
                              <hr />
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  value=""
                                  id="flexCheckDefault"
                                />
                                <label
                                  className="form-check-label"
                                  for="flexCheckDefault"
                                >
                                  <h6 className="font">
                                    Ensure All Equipment And Instruments Are
                                    Organized At Their Respective Places As Per
                                    The Display Standard And All Machines Turned
                                    Off
                                  </h6>
                                </label>
                              </div>
                              <hr />
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  value=""
                                  id="flexCheckDefault"
                                />
                                <label
                                  className="form-check-label"
                                  for="flexCheckDefault"
                                >
                                  <h6 className="font">
                                    Ensure All The Used Equipment And
                                    Instruments Are Cleaned With Hot Water Using
                                    A Soap Or Disinfectant
                                  </h6>
                                </label>
                              </div>
                              <hr />
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  value=""
                                  id="flexCheckDefault"
                                />
                                <label
                                  className="form-check-label"
                                  for="flexCheckDefault"
                                >
                                  <h6 className="font">
                                    Blow Off The Diffusers If You Are Using Oil
                                    Ones Or Switch Off The Electric Ones Too
                                  </h6>
                                </label>
                              </div>
                              <hr />
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  value=""
                                  id="flexCheckDefault"
                                />
                                <label
                                  className="form-check-label"
                                  for="flexCheckDefault"
                                >
                                  <h6 className="font">
                                    Note Meter Reading , Turn Off All Lights And
                                    Switch Off The Mains.
                                  </h6>
                                </label>
                              </div>
                              <hr />
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  value=""
                                  id="flexCheckDefault"
                                />
                                <label
                                  className="form-check-label"
                                  for="flexCheckDefault"
                                >
                                  <h6 className="font">
                                    Ensure The Glow Signage Is Left On With
                                    Timer Switch
                                  </h6>
                                </label>
                              </div>
                              <hr />
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  value=""
                                  id="flexCheckDefault"
                                />
                                <label
                                  className="form-check-label"
                                  for="flexCheckDefault"
                                >
                                  <h6 className="font">
                                    Ensure The Salon Is Closed Properly And
                                    Update The Management About The Salon
                                    Closure
                                  </h6>
                                </label>
                              </div>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
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

export default TimeClock;
