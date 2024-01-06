import React from "react";
import "./_settingspage.scss";

const SupportSettings = () => {
  return (
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
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default SupportSettings;
