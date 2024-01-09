import React, { useState } from "react";
import "./_settingspage.scss";
import infoIcon from "./assets/infoIcon.svg";
import twitterIcon from "./assets/twitterIcon.svg";
import instagramIcon from "./assets/instagramIcon.svg";
import confluxScanIcon from "./assets/confluxScanIcon.svg";
import discordIcon from "./assets/discordIcon.svg";
import telegramIcon from "./assets/telegramIcon.svg";
import penIcon from "./assets/penIcon.svg";
import editIcon from './assets/editIcon.svg'
import collectionSettingsIcon from "./assets/collectionSettingsIcon.svg";

const CollectionSettings = () => {
  const dummyCollections = [
    {
      title: "Cats And Watches Society",
      image: "favoritesPlaceholder1",
    },
    {
      title: "CAWS Timepiece",
      image: "favoritesPlaceholder2",
    },
    {
      title: "World of Dypians Land",
      image: "favoritesPlaceholder3",
    },
    {
      title: "Cats And Watches Society",
      image: "favoritesPlaceholder4",
    },
  ];

  const [collection, setCollection] = useState(null);

  return (
    <div className="col-12 col-lg-10">
      <div className="row">
        <h6 className="settings-header mb-3">
          {collection ? collection.title : "NFT Collections"}
        </h6>
        {collection ? (
          <>
            <div className="col-12 col-lg-6">
              <div className="d-flex flex-column gap-4">
                <div className="d-flex flex-column gap-2">
                  <div className="d-flex align-items-center gap-2">
                    <h6 className="input-label mb-0">Name</h6>
                    <img src={infoIcon} width={16} height={16} alt="" />
                  </div>
                  <input
                    type="text"
                    placeholder="Username"
                    className="settings-input w-100"
                  />
                </div>
                <div className="d-flex flex-column gap-2">
                  <div className="d-flex align-items-center gap-2">
                    <h6 className="input-label mb-0">Blockchain</h6>
                    <img src={infoIcon} width={16} height={16} alt="" />
                  </div>
                  <input
                    type="text"
                    placeholder="Email"
                    className="settings-input w-100"
                  />
                </div>
              </div>
            </div>
            <div className="col-12 col-lg-6">
              <div className="d-flex flex-column gap-4">
                <div className="d-flex flex-column gap-2">
                  <h6 className="input-label mb-0">Content Creator</h6>
                  <input
                    type="text"
                    placeholder="0xc...3453"
                    className="settings-input w-100"
                  />
                </div>
                <div className="d-flex flex-column gap-2">
                  <div className="d-flex align-items-center gap-2">
                    <h6 className="input-label mb-0">Website</h6>
                    <img src={infoIcon} width={16} height={16} alt="" />
                  </div>
                  <input
                    type="text"
                    placeholder="https://opensea.io/"
                    className="settings-input w-100"
                  />
                </div>
              </div>
            </div>
            <div className="col-12 mt-4">
              <div className="d-flex flex-column gap-4">
                <div className="d-flex flex-column gap-2">
                  <h6 className="input-label mb-0">Tags</h6>
                  <input
                    type="text"
                    placeholder="0xc...3453"
                    className="settings-input w-100"
                  />
                </div>
              </div>
            </div>
            <div className="row">
            <div className="col-12 col-lg-6 mt-4">
              <div className="d-flex flex-column justify-content-between mt-4 mt-lg-0 h-100">
                <div className="d-flex align-items-center">
                  <div className="col-4">
                    <div className="d-flex flex-column gap-2">
                      <div className="d-flex align-items-center gap-2">
                        <h6 className="input-label mb-0">Profile Image</h6>
                        <img src={infoIcon} width={16} height={16} alt="" />
                      </div>
                      <div className="profile-image-placeholder">
                      <img src={editIcon} alt="" className="edit-image" />

                      </div>
                    </div>
                  </div>
                  <div className="col-8">
                    <div className="d-flex flex-column gap-2">
                      <div className="d-flex align-items-center gap-2">
                        <h6 className="input-label mb-0">Profile Banner</h6>
                        <img src={infoIcon} width={16} height={16} alt="" />
                      </div>
                      <div className="profile-banner-placeholder">
                        <img src={editIcon} alt="" className="edit-image" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12 col-lg-6 mt-4">
              <div className="d-flex flex-column justify-content-between mt-4 mt-lg-0 h-100">
                <div className="d-flex align-items-center justify-content-between">
                  <div className="col-6">
                    <div className="d-flex flex-column gap-2">
                      <div className="d-flex align-items-center gap-2">
                        <h6 className="input-label mb-0">Featured Banner</h6>
                        <img src={infoIcon} width={16} height={16} alt="" />
                      </div>
                      <div className="featured-banner-placeholder">
                      <img src={editIcon} alt="" className="edit-image" />

                      </div>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="d-flex flex-column gap-2">
                      <div className="d-flex align-items-center gap-2">
                        <h6 className="input-label mb-0">Collection Banner</h6>
                        <img src={infoIcon} width={16} height={16} alt="" />
                      </div>
                      <div className="collection-banner-placeholder">
                      <img src={editIcon} alt="" className="edit-image" />

                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            </div>
            <div className="col-12 mt-4">
              <div className="d-flex flex-column gap-2 mt-4 mt-lg-0">
                <h6 className="input-label mb-0">Description</h6>
                <textarea
                  type="text"
                  placeholder="Description"
                  className="settings-input w-100"
                  style={{ height: "100%" }}
                  rows={5}
                />
              </div>
              <div className="row">
                <div className="col-12 col-lg-6 mt-4">
                  <div className="d-flex flex-column gap-4">
                    <div className="d-flex flex-column gap-2">
                      <div className="d-flex align-items-center gap-2">
                        <img src={twitterIcon} alt="" />
                        <h6 className="input-label mb-0">Twitter</h6>
                      </div>
                      <div className="social-connection-item p-2 d-flex align-items-center justify-content-between gap-5 w-100">
                        <div className="d-flex align-items-center gap-2">
                          <h6 className="mb-0 input-label">Twitter</h6>
                        </div>
                        <button className="connect-social-btn">Connect</button>
                      </div>
                    </div>
                    <div className="d-flex flex-column gap-2">
                      <div className="d-flex align-items-center gap-2">
                        <img src={telegramIcon} alt="" />
                        <h6 className="input-label mb-0">Telegram</h6>
                      </div>
                      <input
                        type="text"
                        placeholder="Telegram"
                        className="settings-input w-100"
                      />
                    </div>
                    <div className="d-flex flex-column gap-2">
                      <div className="d-flex align-items-center gap-2">
                        <img src={confluxScanIcon} alt="" />
                        <h6 className="input-label mb-0">Conflux Scan</h6>
                      </div>
                      <input
                        type="text"
                        placeholder="Conflux Scan"
                        className="settings-input w-100"
                      />
                    </div>
                  </div>
                </div>
                <div className="col-12 col-lg-6 mt-4">
                  <div className="d-flex flex-column gap-4">
                    <div className="d-flex flex-column gap-2">
                      <div className="d-flex align-items-center gap-2">
                        <img src={instagramIcon} alt="" />
                        <h6 className="input-label mb-0">Instagram</h6>
                      </div>
                      <div className="social-connection-item p-2 d-flex align-items-center justify-content-between gap-5 w-100">
                        <div className="d-flex align-items-center gap-2">
                          <h6 className="mb-0 input-label">Instagram</h6>
                        </div>
                        <button className="connect-social-btn">Connect</button>
                      </div>
                    </div>
                    <div className="d-flex flex-column gap-2">
                      <div className="d-flex align-items-center gap-2">
                        <img src={discordIcon} alt="" />
                        <h6 className="input-label mb-0">Discord</h6>
                      </div>
                      <input
                        type="text"
                        placeholder="Discord"
                        className="settings-input w-100"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 d-flex flex-column flex-lg-row align-items-start align-items-lg-center justify-content-between">
                <div className="d-flex flex-column gap-2">
                  <h6 className="input-label mb-0">Creator Earnings</h6>
                  <span className="social-connections-span">
                    A fee for earning on each NFT transaction happening for this
                    collection in marketplace.
                  </span>
                </div>
                <div className="col-12 col-lg-3">
                  <input
                    type="text"
                    placeholder="Enter creator earning fee (e.g. 2%)"
                    className="settings-input w-100"
                  />
                </div>
              </div>
              <div className="d-flex align-items-center justify-content-center mt-4">
                <button
                  className="connect-social-btn px-3 py-1"
                  style={{ fontSize: "16px" }}
                >
                  Save
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="col-12">
            <h6 className="input-label">My Collections</h6>
            <div className="small-cards-grid">
              {dummyCollections.map((item, index) => (
                <div className="collection-card d-flex flex-column" key={index}>
                  <img
                    src={require(`../Profile/assets/${item.image}.png`)}
                    className="w-100"
                    alt=""
                  />
                  <div className="p-3 collection-lower d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center gap-2">
                      <h6 className="mb-0">{item.title}</h6>
                    </div>
                    {/* <img src={star} alt="" /> */}
                    <button
                      className="edit-collection-btn d-flex align-items-center gap-1"
                      onClick={() => setCollection(item)}
                    >
                      <img src={penIcon} alt="" />
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="d-flex flex-column mt-4 gap-2">
              <div className="no-collections-wrap p-2 w-100 d-flex align-items-center gap-2">
                <img src={collectionSettingsIcon} alt="" />
                <span className="no-collections-text">
                  You haven’t created any collections yet.
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectionSettings;
