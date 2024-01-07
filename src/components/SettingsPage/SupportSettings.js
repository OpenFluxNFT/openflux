import React, { useState } from "react";
import "./_settingspage.scss";
import xMark from "./assets/xMark.svg";
import popupSuccess from "./assets/popupSuccess.svg";
import OutsideClickHandler from "react-outside-click-handler";

const SupportSettings = () => {
  const [success, setSuccess] = useState(false);

  return (
    <>
      <div className="col-12 col-lg-10">
        <div className="row">
          <h6 className="settings-header mb-3">Account Support</h6>
          <div className="col-12">
            <div className="d-flex flex-column gap-4">
              <div className="d-flex flex-column gap-2">
                <h6 className="input-label mb-0">Subject</h6>
                <input
                  type="text"
                  placeholder="Enter the topic of the support you need..."
                  className="settings-input w-100"
                />
              </div>
              <div className="d-flex flex-column gap-2">
                <h6 className="input-label mb-0">Description</h6>
                <textarea
                  type="text"
                  placeholder="Describe your issue..."
                  className="settings-input w-100"
                  style={{ height: "100%" }}
                  rows={5}
                />
              </div>
            </div>
          </div>
          <div className="d-flex align-items-center justify-content-center mt-4">
            <button
              className="connect-social-btn px-3 py-1"
              style={{ fontSize: "16px" }}
              onClick={() => setSuccess(true)}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
      {success === true && (
        <>
          <OutsideClickHandler onOutsideClick={() => setSuccess(false)}>
          <div
            className="popup-wrapper popup-active p-3"
            style={{ width: "30%", pointerEvents: "auto" }}
          >
            <div className="d-flex align-items-center justify-content-end w-100 mb-4">
              <img
                src={xMark}
                style={{ cursor: "pointer" }}
                onClick={() => setSuccess(false)}
                alt=""
              />
            </div>

            <div className="d-flex w-100 justify-content-center mb-4">
              <img src={popupSuccess} alt="" />
            </div>
            <div className="d-flex flex-column gap-2 w-100 justify-content-center">
              <h6 className="popup-title">Thank You</h6>
              <p
                className="popup-paragraph "
                style={{ textAlign: "center" }}
              >
             Your submission has been received successfully
              </p>
            </div>
          </div>
          </OutsideClickHandler>
        </>
      )}
    </>
  );
};

export default SupportSettings;
