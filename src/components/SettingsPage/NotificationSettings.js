import React from "react";
import "./_settingspage.scss";
import { Checkbox, FormControlLabel } from "@mui/material";

const NotificationSettings = () => {
  return (
    <div className="col-12 col-lg-10">
      <div className="row">
        <h6 className="settings-header mb-3">Notification Settings</h6>
        <span className="social-connections-span mt-3">
          Select which notifications you would like to receive via email
        </span>
        <div className="col-12">
          <div className="d-flex flex-column gap-2 mt-4">
            <div className="notification-setting-item px-3 py-2 w-100">
              <div className="d-flex align-items-center">
                <FormControlLabel
                sx={{
                  marginRight: "0",
                }}
                  control={
                    <Checkbox
                      size="small"
                      sx={{
                        color: "white",
                        "&.Mui-checked": {
                          color: "#2F80ED",
                        },
                      }}
                    />
                  }
                />
                <div className="d-flex flex-column gap-2">
                  <h6 className="setting-title mb-0">Item Sold</h6>
                  <span className="setting-desc mb-0">
                    When someone purchased one of your items
                  </span>
                </div>
              </div>
            </div>
            <div className="notification-setting-item px-3 py-2 w-100">
              <div className="d-flex align-items-center">
                <FormControlLabel
                sx={{
                  marginRight: "0",
                }}
                  control={
                    <Checkbox
                      size="small"
                      sx={{
                        color: "white",
                        "&.Mui-checked": {
                          color: "#2F80ED",
                        },
                      }}
                    />
                  }
                />
                <div className="d-flex flex-column gap-2">
                  <h6 className="setting-title mb-0">Deal Offers</h6>
                  <span className="setting-desc mb-0">
                  When someone offers a deal on your items
                  </span>
                </div>
              </div>
            </div>
            <div className="notification-setting-item px-3 py-2 w-100">
              <div className="d-flex align-items-center">
                <FormControlLabel
                sx={{
                  marginRight: "0",
                }}
                  control={
                    <Checkbox
                      size="small"
                      sx={{
                        color: "white",
                        "&.Mui-checked": {
                          color: "#2F80ED",
                        },
                      }}
                    />
                  }
                />
                <div className="d-flex flex-column gap-2">
                  <h6 className="setting-title mb-0">Deals Accepted</h6>
                  <span className="setting-desc mb-0">
                  When someone accepted one of your deals
                  </span>
                </div>
              </div>
            </div>
            <div className="notification-setting-item px-3 py-2 w-100">
              <div className="d-flex align-items-center">
                <FormControlLabel
                sx={{
                  marginRight: "0",
                }}
                  control={
                    <Checkbox
                      size="small"
                      sx={{
                        color: "white",
                        "&.Mui-checked": {
                          color: "#2F80ED",
                        },
                      }}
                    />
                  }
                />
                <div className="d-flex flex-column gap-2">
                  <h6 className="setting-title mb-0">Price Change</h6>
                  <span className="setting-desc mb-0">
                  When an item you made an offer on changes in price
                  </span>
                </div>
              </div>
            </div>
            <div className="notification-setting-item px-3 py-2 w-100">
              <div className="d-flex align-items-center">
                <FormControlLabel
                sx={{
                  marginRight: "0",
                }}
                  control={
                    <Checkbox
                      size="small"
                      sx={{
                        color: "white",
                        "&.Mui-checked": {
                          color: "#2F80ED",
                        },
                      }}
                    />
                  }
                />
                <div className="d-flex flex-column gap-2">
                  <h6 className="setting-title mb-0">Outbid</h6>
                  <span className="setting-desc mb-0">
                  When an offer you placed is exceeded by another user
                  </span>
                </div>
              </div>
            </div>
            <div className="notification-setting-item px-3 py-2 w-100">
              <div className="d-flex align-items-center">
                <FormControlLabel
                sx={{
                  marginRight: "0",
                }}
                  control={
                    <Checkbox
                      size="small"
                      sx={{
                        color: "white",
                        "&.Mui-checked": {
                          color: "#2F80ED",
                        },
                      }}
                    />
                  }
                />
                <div className="d-flex flex-column gap-2">
                  <h6 className="setting-title mb-0">Successful Purchase</h6>
                  <span className="setting-desc mb-0">
                  When you successfully buy an item
                  </span>
                </div>
              </div>
            </div>
            <div className="notification-setting-item px-3 py-2 w-100">
              <div className="d-flex align-items-center">
                <FormControlLabel
                sx={{
                  marginRight: "0",
                }}
                  control={
                    <Checkbox
                      size="small"
                      sx={{
                        color: "white",
                        "&.Mui-checked": {
                          color: "#2F80ED",
                        },
                      }}
                    />
                  }
                />
                <div className="d-flex flex-column gap-2">
                  <h6 className="setting-title mb-0">Successful Mint</h6>
                  <span className="setting-desc mb-0">
                  When you successfully mint an item
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;
