import React, { useState } from "react";
import "./_signmodal.scss";
import OutsideClickHandler from "react-outside-click-handler";
import Modal from "../Modal/Modal";
import arrow from "../WalletModal/assets/rightWhiteArrow.svg";
import arrowActive from "../WalletModal/assets/rightBlueArrow.svg";

const SignModal = ({
  handleClose,
  show,
  onHandleConfirm,
  onHandleReject,
  signStatus,
}) => {
  const [btnState, setBtnState] = useState("");
  return (
    <Modal visible={show} onModalClose={handleClose} maxWidth={500} top={"25%"}>
      <OutsideClickHandler onOutsideClick={handleClose}>
        <div className="walletmodal-wrapper">
          <div className="sc-jwKygS bFQpTL">
            <h3 style={{ fontSize: 20, color: "#fff" }}>Confirm sign in</h3>
          </div>
          <div className="d-flex flex-column gap-4 mt-4">
            <span className="confirm-text">
              By confirming signin in, you confirm to create a user account in
              Conflux Marketplace.
            </span>
            <div className="d-flex gap-3">
              <button
                id="connect-METAMASK"
                className="btn buy-nft-btn w-100"
                onMouseEnter={() => {
                  setBtnState("metamask");
                }}
                onMouseLeave={() => {
                  setBtnState("");
                }}
                onClick={onHandleConfirm}
              >
                {signStatus === "initial" ? (
                  "Confirm"
                ) : signStatus === "error" ? (
                  "Failed"
                ): signStatus === "success" ? (
                    "Confirmed"
                  ) : (
                  <>
                    Confirming{" "}
                    <div
                      className="spinner-border spinner-border-sm text-light"
                      role="status"
                    ></div>
                  </>
                )}
                
              </button>

              <button
                onClick={onHandleReject}
                id="connect-COIN98"
                className="make-offer-btn btn w-100"
                onMouseEnter={() => {
                  setBtnState("trust");
                }}
                onMouseLeave={() => {
                  setBtnState("");
                }}
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      </OutsideClickHandler>
    </Modal>
  );
};

export default SignModal;
