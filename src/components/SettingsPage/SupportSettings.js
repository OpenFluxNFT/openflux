import React, { useState } from "react";
import "./_settingspage.scss";
import xMark from "./assets/xMark.svg";
import popupSuccess from "./assets/popupSuccess.svg";
import OutsideClickHandler from "react-outside-click-handler";

const SupportSettings = ({ coinbase }) => {
  const [success, setSuccess] = useState(false);
  const [images, setImages] = useState([]);

  const isImage = async (file) => {
    const acceptedImageTypes = ["image/png"];
    return acceptedImageTypes.includes(file.type);
  };

  const uploadImages = (e) => {
    const files = e.target.files;
    console.log(files, "Files");
    if (files.length > 0) {
      const file = files[0];
      console.log(file.name);
      setImages((prevArr) => [...prevArr, file.name]);
    }
    console.log(images, "images");
  };

  return (
    <>
      <div className="col-12 col-lg-10">
        <div className="row">
          <h6 className="settings-header mb-3">Account Support</h6>
          <div className="col-6 mb-4">
            <div className="d-flex flex-column gap-2">
              <h6 className="input-label mb-0">Email</h6>
              <input
                type="email"
                placeholder="Email"
                className="settings-input w-100"
              />
            </div>
          </div>
          <div className="col-6 mb-4">
            <div className="d-flex flex-column gap-2">
              <h6 className="input-label mb-0">Wallet Address</h6>
              <input
                value={coinbase}
                disabled
                type="text"
                placeholder="Wallet Address..."
                className="settings-input w-100"
              />
            </div>
          </div>
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
          {/* <div className="col-2">
            <label htmlFor="upload" className="mt-4">
              <button
                className="connect-social-btn px-3 py-1"
                style={{
                  fontSize: "16px",
                  pointerEvents: "none",
                  cursor: "pointer",
                }}
                aria-hidden="true"
                // onClick={() => setSuccess(true)}
              >
                Upload Image
              </button>
              <input
                type="file"
                id="upload"
                accept=".png"
                onChange={uploadImages}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  opacity: 0,
                  cursor: "pointer",
                }}
              />
            </label>
          </div>
          <div className="col-8">
            <div className="d-flex flex-column gap-2 flex-wrap mt-3">
            {images.map((item, index) => (
              <span className="image-name" key={index}>{item}</span>
            ))}
            </div>
          </div> */}
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
                <p className="popup-paragraph " style={{ textAlign: "center" }}>
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
