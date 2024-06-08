import React from "react";
import "./_faq.scss";

const FAQ = () => {
  const faqs = [
    {
      title: "What is OpenFlux Marketplace?",
      content: `OpenFlux Marketplace is a decentralized NFT marketplace built on Conflux eSpace, designed to empower artists, creators, and collectors by providing a platform for trading NFTs securely and efficiently.`,
      id: "One",
    },
    {
      title: "How do I get started on OpenFlux Marketplace?",
      content: `To get started, connect your crypto wallet (such as MetaMask) to the OpenFlux Marketplace. An account will be automatically created for you. You can then start exploring the marketplace, view your own NFTs, or browse and purchase from a variety of digital artworks and collectibles.`,
      id: "Two",
    },
    {
      title: "What is Conflux eSpace?",
      content: `Conflux eSpace is a fully EVM-compatible space(chain) of Conflux with much lower gas fee and higher TPS than Ethereum, it is independent from Core space. OpenFlux Marketplace leverages Conflux eSpace to provide a seamless and cost-effective experience for users.`,
      id: "Three",
    },
    {
      title: "What fees are associated with using OpenFlux Marketplace?",
      content: `OpenFlux Marketplace does not charge any fees for trading NFTs. Our platform is designed to be cost-effective, covering only the necessary network transaction costs. Enjoy a fee-free experience while creating and trading your digital assets on OpenFlux.`,
      id: "Four",
    },
    {
      title: "How can I buy an NFT on OpenFlux?",
      content: `To buy an NFT, browse the marketplace, select the NFT you wish to purchase, and click the "Buy" button. Confirm the transaction in your connected wallet, and the NFT will be transferred to your account upon successful payment.`,
      id: "Five",
    },
    {
      title: "Is there a way to resell my NFTs on OpenFlux?",
      content: `Yes, you can resell your NFTs on OpenFlux. Simply navigate to your account, select the NFT you wish to sell, set a price, and list it on the marketplace. Other users can then browse and purchase your listed NFTs.`,
      id: "Six",
    },
    {
      title: "How do I ensure the authenticity of NFTs on OpenFlux?",
      content: `OpenFlux Marketplace provides tools for verifying the authenticity of NFTs, including creator verification and metadata transparency. Always check the creator's profile and the NFT details before making a purchase.`,
      id: "Seven",
    },
    {
      title: "What types of NFTs can I find on OpenFlux?",
      content: `OpenFlux offers a wide range of NFTs, including digital art, collectibles, music, virtual real estate, and more. Our marketplace caters to diverse interests and creative expressions.`,
      id: "Eight",
    },
    {
      title:
        "How can I participate in OpenFlux community events and campaigns?",
      content: `Stay updated with OpenFlux news and events by following our social media channels and subscribing to our newsletter. We regularly host community events, campaigns, and contests to engage and reward our users.`,
      id: "Nine",
    },
    {
      title: "Are there any security measures in place for OpenFlux users?",
      content: `OpenFlux employs robust security measures to protect users' assets and data. We utilize blockchain technology to ensure transaction transparency and security.`,
      id: "Ten",
    },
    {
      title: "How do I bridge assets to Conflux eSpace?",
      content: `
      To bridge assets to Conflux eSpace, follow these steps:
      <br />
      <br />
      - Add Conflux eSpace to your MetaMask using the Conflux RPC: 
      <br />
      <a href="https://chainlist.org/?search=conflux" target="__blank">Conflux RPC</a>
      <br />
      - Use the Butter Bridge for transferring assets from other networks: 
      <br />
      <a href="https://docs.swappi.io/swappi/transferring-assets-to-conflux-espace/from-other-networks/bridging-assets-with-butter-bridge" target="__blank">Bridge Info</a>
      <br />
      - Check out the latest art pieces on Mintpad: <a href="https://x.com/mintpadco" target="__blank">Mintpad Art Piece</a>
      <br />
      - View your assets on <a href="https://t.co/Bx03G6KFlv" target="__blank">ConfluxScan</a> under NFT Assets.
      `,
      id: "Eleven",
    },
    {
      title: "How can I contact OpenFlux support?",
      content: `
      If you need assistance, you can reach out to our support team via the "Contact Us" page on our website or email us directly at  <a href="mailto:contact@openflux.com" target="__blank">contact@openflux.com</a> or join our Discord community at  <a href="https://discord.gg/openflux" target="__blank">https://discord.gg/openflux</a> https://discord.gg/openflux and raise a ticket. We also have a comprehensive help center with guides and FAQs to address common questions and issues.
      `,
      id: "Twelve",
    },
  ];

  return (
    <div className="container-lg py-5">
      <div className="row">
        <h6 className="info-title my-4">
          Frequently Asked <span style={{ color: "#2F80ED" }}>Questions</span>
        </h6>
        <div class="accordion" id="accordionExample">
          {faqs.map((faq, index) => (
            <div key={index} class="accordion-item">
              <h2 class="accordion-header" id="headingOne">
                <button
                  class="accordion-button faq-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target={`#collapse${faq.id}`}
                  aria-expanded="true"
                  aria-controls={`collapse${faq.id}`}
                >
                  {faq.title}
                </button>
              </h2>
              <div
                id={`collapse${faq.id}`}
                class="accordion-collapse collapse"
                aria-labelledby={`heading${faq.id}`}
                data-bs-parent="#accordionExample"
              >
                <div
                  class="accordion-body"
                  dangerouslySetInnerHTML={{ __html: faq.content }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
