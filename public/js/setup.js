const BigNumber = window.BigNumber;
window.IS_CONNECTED = false;
window.WALLET_TYPE = "";
window.the_graph_result = {};

function getTokenContract(address) {
  return getContract({ address, ABI: window.TOKEN_ABI });
}

class TOKEN {
  constructor(key = "TOKEN") {
    this.key = key;
    let address = window.config[key.toLowerCase() + "_address"];
    this._address = address;
  }

  async transfer(to, amount) {
    let contract = await getContract({ key: this.key });

    let { latestGasPrice, maxPriorityFeePerGas } = await getMaxFee();
    console.log({ latestGasPrice, maxPriorityFeePerGas });

    let gas = window.config.default_gas_amount;
    try {
      let estimatedGas = await contract.methods["transfer"](
        to,
        amount
      ).estimateGas({ gas });
      if (estimatedGas) {
        gas = Math.min(estimatedGas, gas);
        //console.log('TRANSFER '+gas)
      }
    } catch (e) {
      console.warn(e);
    }
    return await contract.methods
      .transfer(to, amount)
      .send({ gas, from: await getCoinbase() });
  }
  async totalSupply() {
    let contract = await getContract({ key: this.key });
    return await contract.methods.totalSupply().call();
  }
  async approve(spender, amount) {
    let contract = await getContract({ key: this.key });
    let gas = window.config.default_gas_amount;

    let { latestGasPrice, maxPriorityFeePerGas } = await getMaxFee();
    console.log({ latestGasPrice, maxPriorityFeePerGas });

    try {
      let estimatedGas = await contract.methods["approve"](
        spender,
        amount
      ).estimateGas({ gas });
      if (estimatedGas) {
        gas = Math.min(estimatedGas, gas);
        //console.log('estimatedgas'+gas)
      }
    } catch (e) {
      console.warn(e);
    }
    return await contract.methods
      .approve(spender, amount)
      .send({ gas, from: await getCoinbase() });
  }

  async balanceOf(address) {
    let contract = await getContract({ key: this.key });

    return await contract.methods.balanceOf(address).call();
  }
}

// ALL THE ADDRESSES IN CONFIG MUST BE LOWERCASE
window.config = {
  nft_marketplace_address: "0xd3224654015cf6394121f8e6524f252fdc95d4c3",
  wcfx_address: "0x14b2d3bc65e74dae1030eafd8ac30c533c976a9b",
  conflux_endpoint: "https://evm.confluxrpc.com/",
  erc721_id: "0x80ac58cd",
  erc1155_id: "0xd9b67a26",
};

window.confluxWeb3 = new Web3(window.config.conflux_endpoint);

/**
 *
 * @param {"TOKEN" | "CONFLUX_NFT" } key
 */

async function getContractConfluxNFT(key) {
  let address = window.config[key.toLowerCase() + "_address"];
  if (!window.cached_contracts[key]) {
    window.web3 = new Web3(window.ethereum);

    window.cached_contracts[key] = new window.web3.eth.Contract(
      window.CONFLUX_NFT_ABI,
      window.config.nft_conflux_address,
      {
        from: await getCoinbase(),
      }
    );
  }

  return window.cached_contracts[key];
}

class CONFLUX_NFT {
  constructor(key = "CONFLUX_NFT") {
    this.key = key;
    [
      "REVEAL_TIMESTAMP",
      "balanceOf",
      "baseURI",
      "ownerOf",
      "getApproved",
      "isApprovedForAll",
      "maxBetaPassPurchase",
      "name",
      "owner",
      "ownerOf",
      "saleIsActive",
      "startingIndex",
      "startingIndexBlock",
      "symbol",
      "tokenByIndex",
      "tokenOfOwnerByIndex",
      "tokenURI",
      "totalSupply",
    ].forEach((fn_name) => {
      this[fn_name] = async function (...args) {
        let contract = await getContractConfluxNFT(this.key);
        return await contract.methods[fn_name](...args).call();
      };
    });

    ["mintBetaPass"].forEach((fn_name) => {
      this[fn_name] = async function (...args) {
        let contract = await getContractConfluxNFT(this.key);
        return await contract.methods[fn_name](...args).send({
          from: await getCoinbase(),
        });
      };
    });
  }
  async getConfluxLatestMint() {
    let nft_contract = await getContractConfluxNFT("CONFLUX_NFT");
    return await nft_contract.methods.totalSupply().call();
  }
  async mintConfluxNFT() {
    let nft_contract = await getContractConfluxNFT("CONFLUX_NFT");

    let second = nft_contract.methods
      .mintBetaPass()
      .send({ from: await getCoinbase() });
    // batch.execute()
    let result = await second;
    let sizeResult = Object.keys(result.events["Transfer"]).length;
    if (result.events["Transfer"].blockNumber > 0) sizeResult = 101;
    if (result.status == true) {
      let nftId = 0;
      if (sizeResult != 101) {
        nftId = window.web3.utils
          .toBN(result.events["Transfer"][sizeResult - 1].raw.topics[3])
          .toString(10);
      } else {
        nftId = window.web3.utils
          .toBN(result.events["Transfer"].raw.topics[3])
          .toString(10);
      }
      return nftId;
    } else {
      throw new Error("Minting failed!");
    }
  }
}

window.conflux_nft = new CONFLUX_NFT();

window.buyNFT = async (nft_address, listingIndex, amount) => {
  const coinbase = await getCoinbase();

  const marketplace = new window.web3.eth.Contract(
    window.MARKETPLACE_ABI,
    window.config.nft_marketplace_address
  );

  const transactionParameters = {
    to: window.config.nft_marketplace_address,
    from: coinbase,
    data: await marketplace.methods
      .buyNFT(nft_address, listingIndex, amount)
      .encodeABI(),
  };

  try {
    const txHash = await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [transactionParameters],
    });
  } catch (error) {
    console.log(error);
  }
};

window.approveBuy = async (amount) => {
  window.web3 = new Web3(window.ethereum);
  const contract = new window.web3.eth.Contract(
    window.TOKEN_ABI,
    window.config.wcfx_address
  );
  console.log(amount);

  await contract.methods
    .approve(window.config.nft_marketplace_address, amount)
    .send({ from: await getCoinbase() });
};

window.isApprovedBuy = async (amount) => {
  web3 = window.confluxWeb3;

  const contract = new web3.eth.Contract(
    window.TOKEN_ABI,
    window.config.wcfx_address
  );

  const coinbase = await getCoinbase();
  if (coinbase) {
    const allowance = await contract.methods
      .allowance(coinbase, window.config.nft_marketplace_address)
      .call({ from: await getCoinbase() });
    return Number(allowance) >= Number(amount);
  } else return false;
};

window.isApprovedNFT = async (token, collectionAddress, address) => {
  const abi_1155 = new window.confluxWeb3.eth.Contract(
    window.BACKUP_ABI,
    collectionAddress
  );
  const abi_721 = new window.confluxWeb3.eth.Contract(
    window.ERC721_ABI,
    collectionAddress
  );

  const is721 = await abi_721.methods
    .supportsInterface(window.config.erc721_id)
    .call()
    .catch((e) => {
      console.error(e);
      return false;
    });
  const is1155 = await abi_1155.methods
    .supportsInterface(window.config.erc1155_id)
    .call()
    .catch((e) => {
      console.error(e);
      return false;
    });

  const abi_final = is1155
    ? window.BACKUP_ABI
    : is721
    ? window.ERC721_ABI
    : window.ERC721_ABI;

  if (abi_final) {
    const abi = abi_final;
    window.web3 = new Web3(window.ethereum);
    let contract = new window.web3.eth.Contract(abi, collectionAddress);
    if (is721) {
      let approved = await contract.methods.getApproved(token).call();
      let approvedAll = await contract.methods
        .isApprovedForAll(address, window.config.nft_marketplace_address)
        .call();

      approved = approved.toLowerCase();
      if (approved === window.config.nft_marketplace_address || approvedAll) {
        return true;
      } else return false;
    } else if (is1155) {
      let approvedAll = await contract.methods
        .isApprovedForAll(address, window.config.nft_marketplace_address)
        .call();

      if (approvedAll) {
        return true;
      } else return false;
    }
  } else return false;
};

window.approveNFT = async (collectionAddress) => {
  const coinbase = await getCoinbase();
  window.web3 = new Web3(window.ethereum);
  const abi_1155 = new window.confluxWeb3.eth.Contract(
    window.BACKUP_ABI,
    collectionAddress
  );
  const abi_721 = new window.confluxWeb3.eth.Contract(
    window.ERC721_ABI,
    collectionAddress
  );

  const is721 = await abi_721.methods
    .supportsInterface(window.config.erc721_id)
    .call()
    .catch((e) => {
      console.error(e);
      return false;
    });
  const is1155 = await abi_1155.methods
    .supportsInterface(window.config.erc1155_id)
    .call()
    .catch((e) => {
      console.error(e);
      return false;
    });

  const abi_final = is1155
    ? window.BACKUP_ABI
    : is721
    ? window.ERC721_ABI
    : window.ERC721_ABI;

  if (abi_final) {
    const abi = abi_final;
    let contract = new window.web3.eth.Contract(abi, collectionAddress);
    await contract.methods
      .setApprovalForAll(window.config.nft_marketplace_address, true)
      .send({ from: coinbase });
  }
};

window.cancelListNFT = async (nftAddress, listingIndex) => {
  const coinbase = await getCoinbase();

  const marketplace = new window.web3.eth.Contract(
    window.MARKETPLACE_ABI,
    window.config.nft_marketplace_address
  );

  await marketplace.methods
    .cancelListing(nftAddress, listingIndex)
    .send({ from: coinbase });
};

window.updateListingNFT = async (nftAddress, listingIndex, newPrice) => {
  window.web3 = new Web3(window.ethereum);

  const coinbase = await getCoinbase();

  const marketplace = new window.web3.eth.Contract(
    window.MARKETPLACE_ABI,
    window.config.nft_marketplace_address
  );

  await marketplace.methods
    .editListing(nftAddress, listingIndex, newPrice)
    .send({ from: coinbase });
};

window.updateCollectionFee = async (collectionAddress, fee) => {
  window.web3 = new Web3(window.ethereum);

  const coinbase = await getCoinbase();

  const marketplace = new window.web3.eth.Contract(
    window.MARKETPLACE_ABI,
    window.config.nft_marketplace_address
  );

  const newFee = Number(fee) * 10;

  await marketplace.methods
    .setCollectionFeeRate(collectionAddress, newFee)
    .send({ from: coinbase });
};

window.listNFT = async (nftAddress, tokenId, price, tokenAddr, duration) => {
  const coinbase = await getCoinbase();
  window.web3 = new Web3(window.ethereum);

  const marketplace = new window.web3.eth.Contract(
    window.MARKETPLACE_ABI,
    window.config.nft_marketplace_address
  );

  await marketplace.methods
    .listNFT(nftAddress, tokenId, price, tokenAddr, duration)
    .send({ from: coinbase });
};

window.isApproved = async (token, type) => {
  window.web3 = new Web3(window.ethereum);
  if (type === "timepiece") {
    let contract = new window.web3.eth.Contract(
      window.TIMEPIECE_ABI,
      window.config.nft_timepiece_address
    );

    let approved = await contract.methods.getApproved(token).call();

    approved = approved.toLowerCase();

    return approved === window.config.nft_marketplace_address.toLowerCase();
  } else if (type === "land") {
    let contract = new window.web3.eth.Contract(
      window.WOD_ABI,
      window.config.nft_land_address
    );

    let approved = await contract.methods.getApproved(token).call();

    approved = approved.toLowerCase();

    return approved === window.config.nft_marketplace_address.toLowerCase();
  } else {
    let contract = new window.web3.eth.Contract(
      window.CAWS_ABI,
      window.config.nft_caws_address
    );
    let approved = await contract.methods.getApproved(token).call();

    approved = approved.toLowerCase();

    return approved === window.config.nft_marketplace_address.toLowerCase();
  }
};

window.makeOffer = async (nftAddress, tokenId, price, duration) => {
  let price_address = window.config.wcfx_address;
  const marketplace = new window.web3.eth.Contract(
    window.MARKETPLACE_ABI,
    window.config.nft_marketplace_address
  );

  await marketplace.methods
    .makeOfferForNFT(nftAddress, tokenId, price, price_address, duration)
    .send({ from: await getCoinbase() });
};

window.makeCollectionOffer = async (nftAddress, price, duration) => {
  let price_address = window.config.wcfx_address;
  const marketplace = new window.web3.eth.Contract(
    window.MARKETPLACE_ABI,
    window.config.nft_marketplace_address
  );

  await marketplace.methods
    .makeOfferForCollection(nftAddress, price, price_address, duration)
    .send({ from: await getCoinbase() });
};

window.cancelOffer = async (nftAddress, tokenId, offerIndex) => {
  const marketplace = new window.web3.eth.Contract(
    window.MARKETPLACE_ABI,
    window.config.nft_marketplace_address
  );

  await marketplace.methods
    .cancelOfferForNFT(nftAddress, tokenId, offerIndex)
    .send({ from: await getCoinbase() });
};

window.cancelCollectionOffer = async (nftAddress, offerIndex) => {
  const marketplace = new window.web3.eth.Contract(
    window.MARKETPLACE_ABI,
    window.config.nft_marketplace_address
  );

  await marketplace.methods
    .cancelOfferForCollection(nftAddress, offerIndex)
    .send({ from: await getCoinbase() });
};

window.updateOffer = async (nftAddress, tokenId, offerIndex, newPrice) => {
  const marketplace = new window.web3.eth.Contract(
    window.MARKETPLACE_ABI,
    window.config.nft_marketplace_address
  );

  await marketplace.methods
    .editOfferForNFT(nftAddress, tokenId, offerIndex, newPrice)
    .send({ from: await getCoinbase() });
};

window.updateCollectionOffer = async (nftAddress, offerIndex, newPrice) => {
  const marketplace = new window.web3.eth.Contract(
    window.MARKETPLACE_ABI,
    window.config.nft_marketplace_address
  );

  await marketplace.methods
    .editOfferForCollection(nftAddress, offerIndex, newPrice)
    .send({ from: await getCoinbase() });
};

window.acceptOffer = async (nftAddress, tokenId, offerIndex) => {
  const marketplace = new window.web3.eth.Contract(
    window.MARKETPLACE_ABI,
    window.config.nft_marketplace_address
  );

  await marketplace.methods
    .acceptOfferForNFT(nftAddress, tokenId, offerIndex)
    .send({ from: await getCoinbase() });
};

window.acceptCollectionOffer = async (nftAddress, tokenId, offerIndex) => {
  const marketplace = new window.web3.eth.Contract(
    window.MARKETPLACE_ABI,
    window.config.nft_marketplace_address
  );

  await marketplace.methods
    .acceptOfferForCollection(nftAddress, tokenId, offerIndex)
    .send({ from: await getCoinbase() });
};

window.isApprovedOffer = async (amount) => {
  window.web3 = new Web3(window.ethereum);

  const contract = new window.web3.eth.Contract(
    window.TOKEN_ABI,
    window.config.wcfx_address
  );

  const coinbase = await getCoinbase();

  const allowance = await contract.methods
    .allowance(coinbase, window.config.nft_marketplace_address)
    .call({ from: await getCoinbase() });
  console.log(
    Number(allowance) >= Number(amount),
    Number(allowance),
    Number(amount)
  );

  return Number(allowance) >= Number(amount);
};

window.approveOffer = async (amount) => {
  const contract = new window.web3.eth.Contract(
    window.TOKEN_ABI,
    window.config.wcfx_address
  );

  await contract.methods
    .approve(window.config.nft_marketplace_address, amount)
    .send({ from: await getCoinbase() });
};

window.getAllOffers = async (nftAddress, tokenId) => {
  const marketplace = new window.confluxWeb3.eth.Contract(
    window.MARKETPLACE_ABI,
    window.config.nft_marketplace_address
  );

  const result = await marketplace.methods
    .getAllOffersForNFT(nftAddress, tokenId)
    .call();

  return result;
};

window.getAllCollectionOffers = async (nftAddress) => {
  const marketplace = new window.confluxWeb3.eth.Contract(
    window.MARKETPLACE_ABI,
    window.config.nft_marketplace_address
  );

  const result = await marketplace.methods
    .getAllOffersForCollection(nftAddress)
    .call();

  return result;
};

window.getAllOffersMadeForNft = async (userAddr) => {
  const marketplace = new window.confluxWeb3.eth.Contract(
    window.MARKETPLACE_ABI,
    window.config.nft_marketplace_address
  );

  const result = await marketplace.methods
    .getUserNFTOffers(userAddr)
    .call()
    .catch((e) => {
      console.error(e);
    });

  return result;
};

window.getAllOffersMadeForCollection = async (userAddr) => {
  const marketplace = new window.confluxWeb3.eth.Contract(
    window.MARKETPLACE_ABI,
    window.config.nft_marketplace_address
  );

  const result = await marketplace.methods
    .getUserCollectionOffers(userAddr)
    .call()
    .catch((e) => {
      console.error(e);
    });

  return result;
};

//mint

async function latestMint() {
  return await window.$.get("https://mint.dyp.finance/api/v1/latest/mint").then(
    (result) => {
      return parseInt(result.total);
    }
  );
}

function range(start, end, step = 1) {
  const len = Math.floor((end - start) / step) + 1;
  return Array(len)
    .fill()
    .map((_, idx) => start + idx * step);
}

async function getNft(id) {
  return await window.$.get(`https://mint.dyp.finance/metadata/${id}`).then(
    (result) => {
      return result;
    }
  );
}

async function getLandNft(id) {
  return await window.$.get(
    `https://mint.worldofdypians.com/metadata/${id}`
  ).then((result) => {
    return result;
  });
}

async function getMyNFTs(address, type = "") {
  let contract;
  const infuraweb3 = window.infuraWeb3;
  // window.web3 = new Web3(window.ethereum);
  if (type === "timepiece") {
    contract = await new infuraweb3.eth.Contract(
      window.TIMEPIECE_ABI,
      window.config.nft_timepiece_address
    );
    const balance = await contract.methods.balanceOf(address).call();

    const tokens = await Promise.all(
      range(0, balance - 1).map((i) =>
        contract.methods.tokenOfOwnerByIndex(address, i).call()
      )
    );

    return tokens;
  } else if (type === "land") {
    contract = await new infuraweb3.eth.Contract(
      window.WOD_ABI,
      window.config.nft_land_address
    );

    const balance = await contract.methods.balanceOf(address).call();

    const tokens = await Promise.all(
      range(0, balance - 1).map((i) =>
        contract.methods.tokenOfOwnerByIndex(address, i).call()
      )
    );

    return tokens;
  } else if (type === "coingecko") {
    contract = new window.bscWeb3.eth.Contract(
      window.COINGECKO_NFT_ABI,
      window.config.nft_coingecko_address
    );

    const balance = await contract.methods.balanceOf(address).call();

    const tokens = await Promise.all(
      range(0, balance - 1).map((i) =>
        contract.methods.tokenOfOwnerByIndex(address, i).call()
      )
    );

    return tokens;
  } else if (type === "base") {
    contract = new window.baseWeb3.eth.Contract(
      window.BASE_NFT_ABI,
      window.config.nft_base_address
    );

    const balance = await contract.methods.balanceOf(address).call();

    const tokens = await Promise.all(
      range(0, balance - 1).map((i) =>
        contract.methods.tokenOfOwnerByIndex(address, i).call()
      )
    );

    return tokens;
  } else if (type === "gate") {
    contract = new window.bscWeb3.eth.Contract(
      window.GATE_NFT_ABI,
      window.config.nft_gate_address
    );

    const balance = await contract.methods.balanceOf(address).call();

    const tokens = await Promise.all(
      range(0, balance - 1).map((i) =>
        contract.methods.tokenOfOwnerByIndex(address, i).call()
      )
    );

    return tokens;
  } else if (type === "conflux") {
    contract = new window.confluxWeb3.eth.Contract(
      window.CONFLUX_NFT_ABI,
      window.config.nft_conflux_address
    );

    const balance = await contract.methods.balanceOf(address).call();

    const tokens = await Promise.all(
      range(0, balance - 1).map((i) =>
        contract.methods.tokenOfOwnerByIndex(address, i).call()
      )
    );

    return tokens;
  } else if (type === "caws") {
    contract = await new infuraweb3.eth.Contract(
      window.CAWS_ABI,
      window.config.nft_caws_address
    );

    const balance = await contract.methods.balanceOf(address).call();

    const tokens = await Promise.all(
      range(0, balance - 1).map((i) =>
        contract.methods.tokenOfOwnerByIndex(address, i).call()
      )
    );

    return tokens;
  }
}

async function getMyConfluxNFTs(address, limit) {
  let contract;

  contract = new window.confluxWeb3.eth.Contract(
    window.CONFLUX_NFT_ABI,
    window.config.nft_conflux_address
  );

  const balance = await contract.methods.balanceOf(address).call();

  const tokens = await Promise.all(
    range(0, limit - 1).map((i) =>
      contract.methods.tokenByIndex(address, i).call()
    )
  );

  return tokens;
}

async function myNftListContract(address) {
  let nft_contract = await getContractNFT("NFT");

  let getBalanceOf = await nft_contract.methods.balanceOf(address).call();

  let nftList = [];

  for (let i = 0; i < getBalanceOf; i++)
    nftList.push(
      await nft_contract.methods.tokenOfOwnerByIndex(address, i).call()
    );

  return nftList;
}

async function myNftLandListContract(address) {
  let nft_contract = await getContractLandNFT("LANDNFTSTAKE");

  let getBalanceOf = await nft_contract.methods.balanceOf(address).call();

  let nftList = [];

  for (let i = 0; i < getBalanceOf; i++)
    nftList.push(
      await nft_contract.methods.tokenOfOwnerByIndex(address, i).call()
    );

  return nftList;
}

async function myNftList(address) {
  return await window.$.get(
    `https://mint.dyp.finance/api/v1/my/${address}`
  ).then((result) => {
    return result;
  });
}

window.BACKUP_ABI = [
  { inputs: [], stateMutability: "nonpayable", type: "constructor" },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      { indexed: false, internalType: "bool", name: "approved", type: "bool" },
    ],
    name: "ApprovalForAll",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      { indexed: true, internalType: "address", name: "from", type: "address" },
      { indexed: true, internalType: "address", name: "to", type: "address" },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "ids",
        type: "uint256[]",
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "values",
        type: "uint256[]",
      },
    ],
    name: "TransferBatch",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      { indexed: true, internalType: "address", name: "from", type: "address" },
      { indexed: true, internalType: "address", name: "to", type: "address" },
      { indexed: false, internalType: "uint256", name: "id", type: "uint256" },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "TransferSingle",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: "string", name: "value", type: "string" },
      { indexed: true, internalType: "uint256", name: "id", type: "uint256" },
    ],
    name: "URI",
    type: "event",
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "addMinter",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "account", type: "address" },
      { internalType: "uint256", name: "id", type: "uint256" },
    ],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address[]", name: "accounts", type: "address[]" },
      { internalType: "uint256[]", name: "ids", type: "uint256[]" },
    ],
    name: "balanceOfBatch",
    outputs: [{ internalType: "uint256[]", name: "", type: "uint256[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "account", type: "address" },
      { internalType: "uint256", name: "id", type: "uint256" },
      { internalType: "uint256", name: "value", type: "uint256" },
    ],
    name: "burn",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "account", type: "address" },
      { internalType: "uint256[]", name: "ids", type: "uint256[]" },
      { internalType: "uint256[]", name: "values", type: "uint256[]" },
    ],
    name: "burnBatch",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_id", type: "uint256" }],
    name: "categoryOf",
    outputs: [{ internalType: "uint256", name: "categoryId", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "account", type: "address" },
      { internalType: "uint256", name: "_cap", type: "uint256" },
      { internalType: "uint256", name: "_amount", type: "uint256" },
      { internalType: "bytes", name: "data", type: "bytes" },
    ],
    name: "create",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "account", type: "address" },
      { internalType: "uint256[]", name: "_caps", type: "uint256[]" },
      { internalType: "uint256[]", name: "_amounts", type: "uint256[]" },
      { internalType: "bytes", name: "data", type: "bytes" },
    ],
    name: "createBatch",
    outputs: [{ internalType: "uint256[]", name: "", type: "uint256[]" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getNextTokenID",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "account", type: "address" },
      { internalType: "address", name: "operator", type: "address" },
    ],
    name: "isApprovedForAll",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "isMinter",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "account", type: "address" },
      { internalType: "uint256", name: "id", type: "uint256" },
      { internalType: "uint256", name: "amount", type: "uint256" },
      { internalType: "bytes", name: "data", type: "bytes" },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256[]", name: "ids", type: "uint256[]" },
      { internalType: "uint256[]", name: "amounts", type: "uint256[]" },
      { internalType: "bytes", name: "data", type: "bytes" },
    ],
    name: "mintBatch",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_id", type: "uint256" }],
    name: "ownerOf",
    outputs: [{ internalType: "address[]", name: "", type: "address[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "removeMinter",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "from", type: "address" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256[]", name: "ids", type: "uint256[]" },
      { internalType: "uint256[]", name: "amounts", type: "uint256[]" },
      { internalType: "bytes", name: "data", type: "bytes" },
    ],
    name: "safeBatchTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "from", type: "address" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "id", type: "uint256" },
      { internalType: "uint256", name: "amount", type: "uint256" },
      { internalType: "bytes", name: "data", type: "bytes" },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "nextTokenIdToMint",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "operator", type: "address" },
      { internalType: "bool", name: "approved", type: "bool" },
    ],
    name: "setApprovalForAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "uint256", name: "value", type: "uint256" },
    ],
    name: "setContains",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes4", name: "interfaceId", type: "bytes4" }],
    name: "supportsInterface",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "owner", type: "address" }],
    name: "tokensOf",
    outputs: [{ internalType: "uint256[]", name: "", type: "uint256[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "owner", type: "uint256" }],
    name: "tokenByIndex",
    outputs: [{ internalType: "address[]", name: "", type: "address[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "uint256", name: "owner", type: "uint256" },
    ],
    name: "tokenOfOwnerByIndex",
    outputs: [{ internalType: "address[]", name: "", type: "address[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_id", type: "uint256" }],
    name: "uri",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
];

window.ERC721_ABI = [
  {
    inputs: [
      { internalType: "string", name: "name", type: "string" },
      { internalType: "string", name: "symbol", type: "string" },
      { internalType: "uint256", name: "maxNftSupply", type: "uint256" },
      { internalType: "uint256", name: "saleStart", type: "uint256" },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "approved",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      { indexed: false, internalType: "bool", name: "approved", type: "bool" },
    ],
    name: "ApprovalForAll",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "from", type: "address" },
      { indexed: true, internalType: "address", name: "to", type: "address" },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [],
    name: "BETA_PASS_PROVENANCE",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "REVEAL_TIMESTAMP",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "tokenId", type: "uint256" },
    ],
    name: "approve",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "baseURI",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "betaPassPrice",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "costSaleIsActive",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "costSaleState",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "flipSaleState",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "getApproved",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "address", name: "operator", type: "address" },
    ],
    name: "isApprovedForAll",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "maxBetaPassPurchase",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "mintBetaPass",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "numberOfTokens", type: "uint256" },
    ],
    name: "mintBetaPassCost",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "nextOwnerToExplicitlySet",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "ownerOf",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "reserveBetaPass",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "from", type: "address" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "tokenId", type: "uint256" },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "from", type: "address" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "tokenId", type: "uint256" },
      { internalType: "bytes", name: "_data", type: "bytes" },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "saleIsActive",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "operator", type: "address" },
      { internalType: "bool", name: "approved", type: "bool" },
    ],
    name: "setApprovalForAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "string", name: "tokenURI", type: "string" }],
    name: "setBaseURI",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "newPrice", type: "uint256" }],
    name: "setBetaPassPrice",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "string", name: "provenanceHash", type: "string" },
    ],
    name: "setProvenanceHash",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "revealTimeStamp", type: "uint256" },
    ],
    name: "setRevealTimestamp",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "startingIndex",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "startingIndexBlock",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes4", name: "interfaceId", type: "bytes4" }],
    name: "supportsInterface",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "index", type: "uint256" }],
    name: "tokenByIndex",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "uint256", name: "index", type: "uint256" },
    ],
    name: "tokenOfOwnerByIndex",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "tokenURI",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "from", type: "address" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "tokenId", type: "uint256" },
    ],
    name: "transferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

window.CAWS_ABI = [
  {
    inputs: [
      { internalType: "string", name: "name", type: "string" },
      { internalType: "string", name: "symbol", type: "string" },
      { internalType: "uint256", name: "maxNftSupply", type: "uint256" },
      { internalType: "uint256", name: "saleStart", type: "uint256" },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "approved",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      { indexed: false, internalType: "bool", name: "approved", type: "bool" },
    ],
    name: "ApprovalForAll",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "from", type: "address" },
      { indexed: true, internalType: "address", name: "to", type: "address" },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [],
    name: "CAWS_PROVENANCE",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "MAX_CAWS",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "REVEAL_TIMESTAMP",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "tokenId", type: "uint256" },
    ],
    name: "approve",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "baseURI",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "cawsPrice",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "emergencySetStartingIndexBlock",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "flipSaleState",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "getApproved",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "address", name: "operator", type: "address" },
    ],
    name: "isApprovedForAll",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "maxCawsPurchase",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "numberOfTokens", type: "uint256" },
    ],
    name: "mintCaws",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "nextOwnerToExplicitlySet",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "ownerOf",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "reserveCaws",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "from", type: "address" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "tokenId", type: "uint256" },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "from", type: "address" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "tokenId", type: "uint256" },
      { internalType: "bytes", name: "_data", type: "bytes" },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "saleIsActive",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "operator", type: "address" },
      { internalType: "bool", name: "approved", type: "bool" },
    ],
    name: "setApprovalForAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "string", name: "tokenURI", type: "string" }],
    name: "setBaseURI",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "string", name: "provenanceHash", type: "string" },
    ],
    name: "setProvenanceHash",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "revealTimeStamp", type: "uint256" },
    ],
    name: "setRevealTimestamp",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "setStartingIndex",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "startingIndex",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "startingIndexBlock",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes4", name: "interfaceId", type: "bytes4" }],
    name: "supportsInterface",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "index", type: "uint256" }],
    name: "tokenByIndex",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "uint256", name: "index", type: "uint256" },
    ],
    name: "tokenOfOwnerByIndex",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "tokenURI",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "from", type: "address" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "tokenId", type: "uint256" },
    ],
    name: "transferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];
window.WOD_ABI = [
  {
    inputs: [
      { internalType: "string", name: "name", type: "string" },
      { internalType: "string", name: "symbol", type: "string" },
      { internalType: "uint256", name: "maxNftSupply", type: "uint256" },
      { internalType: "uint256", name: "saleStart", type: "uint256" },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "approved",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      { indexed: false, internalType: "bool", name: "approved", type: "bool" },
    ],
    name: "ApprovalForAll",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "from", type: "address" },
      { indexed: true, internalType: "address", name: "to", type: "address" },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [],
    name: "LandPriceDiscount",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "MAX_MINT",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "MAX_WOD",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "REVEAL_TIMESTAMP",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "WOD_PROVENANCE",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "tokenId", type: "uint256" },
    ],
    name: "approve",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "baseURI",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "cawsContract",
    outputs: [
      { internalType: "contract CawsContract", name: "", type: "address" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "cawsUsed",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "emergencySetStartingIndexBlock",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "flipSaleState",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "getApproved",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "address", name: "operator", type: "address" },
    ],
    name: "isApprovedForAll",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "landPrice",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "maxLandPurchase",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "numberOfTokens", type: "uint256" },
      { internalType: "uint256[]", name: "tokenIds", type: "uint256[]" },
    ],
    name: "mintWodGenesis",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "nextOwnerToExplicitlySet",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "ownerOf",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "numberOfTokens", type: "uint256" },
    ],
    name: "reserveWod",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "from", type: "address" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "tokenId", type: "uint256" },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "from", type: "address" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "tokenId", type: "uint256" },
      { internalType: "bytes", name: "_data", type: "bytes" },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "saleIsActive",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "operator", type: "address" },
      { internalType: "bool", name: "approved", type: "bool" },
    ],
    name: "setApprovalForAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "string", name: "tokenURI", type: "string" }],
    name: "setBaseURI",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "string", name: "provenanceHash", type: "string" },
    ],
    name: "setProvenanceHash",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "revealTimeStamp", type: "uint256" },
    ],
    name: "setRevealTimestamp",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "setStartingIndex",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "stakeContract",
    outputs: [
      { internalType: "contract StakeContract", name: "", type: "address" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "startingIndex",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "startingIndexBlock",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes4", name: "interfaceId", type: "bytes4" }],
    name: "supportsInterface",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "index", type: "uint256" }],
    name: "tokenByIndex",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "uint256", name: "index", type: "uint256" },
    ],
    name: "tokenOfOwnerByIndex",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "tokenURI",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "from", type: "address" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "tokenId", type: "uint256" },
    ],
    name: "transferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

window.MARKETPLACE_ABI = [
  {
    inputs: [
      { internalType: "address", name: "initialOwner", type: "address" },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [{ internalType: "address", name: "owner", type: "address" }],
    name: "OwnableInvalidOwner",
    type: "error",
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "OwnableUnauthorizedAccount",
    type: "error",
  },
  { inputs: [], name: "ReentrancyGuardReentrantCall", type: "error" },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "collectionAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "CollectionAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "collectionAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "CollectionEdited",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "collectionAddress",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "offeror",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "acceptor",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "paymentToken",
        type: "address",
      },
    ],
    name: "CollectionOfferAccepted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "collectionAddress",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "offeror",
        type: "address",
      },
    ],
    name: "CollectionOfferCancelled",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "collectionAddress",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "offeror",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "paymentToken",
        type: "address",
      },
    ],
    name: "CollectionOfferMade",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "collectionAddress",
        type: "address",
      },
    ],
    name: "CollectionRemoved",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "nftAddress",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "ListingCancelled",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "nftAddress",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "newPrice",
        type: "uint256",
      },
    ],
    name: "ListingEdited",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "nftAddress",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "seller",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "price",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "paymentToken",
        type: "address",
      },
    ],
    name: "NFTListed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "nftAddress",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "buyer",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "seller",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "paymentToken",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "NFTPurchased",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "nftAddress",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "offeror",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "seller",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "paymentToken",
        type: "address",
      },
    ],
    name: "OfferAcceptedForNFT",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "nftAddress",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "offeror",
        type: "address",
      },
    ],
    name: "OfferCancelledForNFT",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "nftAddress",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "offeror",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "paymentToken",
        type: "address",
      },
    ],
    name: "OfferMadeForNFT",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    inputs: [
      { internalType: "address", name: "_collectionAddress", type: "address" },
      { internalType: "uint256", name: "_tokenId", type: "uint256" },
      { internalType: "uint256", name: "_offerIndex", type: "uint256" },
    ],
    name: "acceptOfferForCollection",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_nftAddress", type: "address" },
      { internalType: "uint256", name: "_tokenId", type: "uint256" },
      { internalType: "uint256", name: "_offerIndex", type: "uint256" },
    ],
    name: "acceptOfferForNFT",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "", type: "address" },
      { internalType: "uint256", name: "", type: "uint256" },
    ],
    name: "activeTokenIdsForOffers",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_token", type: "address" }],
    name: "addApprovedToken",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_collectionAddress", type: "address" },
      { internalType: "address", name: "_owner", type: "address" },
    ],
    name: "addCollection",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "approvedTokens",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_nftAddress", type: "address" },
      { internalType: "uint256", name: "_listingIndex", type: "uint256" },
      { internalType: "uint256", name: "_amount", type: "uint256" },
    ],
    name: "buyNFT",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_nftAddress", type: "address" },
      { internalType: "uint256", name: "_listingIndex", type: "uint256" },
    ],
    name: "cancelListing",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_collectionAddress", type: "address" },
      { internalType: "uint256", name: "_offerIndex", type: "uint256" },
    ],
    name: "cancelOfferForCollection",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_nftAddress", type: "address" },
      { internalType: "uint256", name: "_tokenId", type: "uint256" },
      { internalType: "uint256", name: "_offerIndex", type: "uint256" },
    ],
    name: "cancelOfferForNFT",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "collections",
    outputs: [
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "uint256", name: "collectionFeeRate", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "contractCommissionRate",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_collectionAddress", type: "address" },
      { internalType: "address", name: "_newOwner", type: "address" },
    ],
    name: "editCollection",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_nftAddress", type: "address" },
      { internalType: "uint256", name: "_listingIndex", type: "uint256" },
      { internalType: "uint256", name: "_newPrice", type: "uint256" },
    ],
    name: "editListing",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_collectionAddress", type: "address" },
      { internalType: "uint256", name: "_offerIndex", type: "uint256" },
      { internalType: "uint256", name: "_newAmount", type: "uint256" },
    ],
    name: "editOfferForCollection",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_nftAddress", type: "address" },
      { internalType: "uint256", name: "_tokenId", type: "uint256" },
      { internalType: "uint256", name: "_offerIndex", type: "uint256" },
      { internalType: "uint256", name: "_newAmount", type: "uint256" },
    ],
    name: "editOfferForNFT",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_collectionAddress", type: "address" },
    ],
    name: "getAllListingsForCollection",
    outputs: [
      { internalType: "uint256[]", name: "", type: "uint256[]" },
      {
        components: [
          { internalType: "address", name: "nftAddress", type: "address" },
          { internalType: "uint256", name: "tokenId", type: "uint256" },
          { internalType: "address payable", name: "seller", type: "address" },
          { internalType: "uint256", name: "price", type: "uint256" },
          { internalType: "address", name: "paymentToken", type: "address" },
          {
            internalType: "enum OpenFlux.Duration",
            name: "duration",
            type: "uint8",
          },
          { internalType: "uint256", name: "expiresAt", type: "uint256" },
        ],
        internalType: "struct OpenFlux.Listing[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_collectionAddress", type: "address" },
    ],
    name: "getAllOffersForCollection",
    outputs: [
      { internalType: "uint256[]", name: "", type: "uint256[]" },
      {
        components: [
          { internalType: "address", name: "nftAddress", type: "address" },
          { internalType: "address", name: "offeror", type: "address" },
          { internalType: "uint256", name: "amount", type: "uint256" },
          { internalType: "address", name: "paymentToken", type: "address" },
          {
            internalType: "enum OpenFlux.Duration",
            name: "duration",
            type: "uint8",
          },
          { internalType: "uint256", name: "expiresAt", type: "uint256" },
        ],
        internalType: "struct OpenFlux.CollectionOffer[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_nftAddress", type: "address" },
      { internalType: "uint256", name: "_tokenId", type: "uint256" },
    ],
    name: "getAllOffersForNFT",
    outputs: [
      { internalType: "uint256[]", name: "", type: "uint256[]" },
      {
        components: [
          { internalType: "address", name: "nftAddress", type: "address" },
          { internalType: "uint256", name: "tokenId", type: "uint256" },
          { internalType: "address", name: "offeror", type: "address" },
          { internalType: "uint256", name: "amount", type: "uint256" },
          { internalType: "address", name: "paymentToken", type: "address" },
          {
            internalType: "enum OpenFlux.Duration",
            name: "duration",
            type: "uint8",
          },
          { internalType: "uint256", name: "expiresAt", type: "uint256" },
        ],
        internalType: "struct OpenFlux.Offer[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_collectionAddress", type: "address" },
    ],
    name: "getTotalListingsForCollection",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "user", type: "address" }],
    name: "getUserCollectionOffers",
    outputs: [
      {
        components: [
          { internalType: "address", name: "nftAddress", type: "address" },
          { internalType: "address", name: "offeror", type: "address" },
          { internalType: "uint256", name: "amount", type: "uint256" },
          { internalType: "address", name: "paymentToken", type: "address" },
          {
            internalType: "enum OpenFlux.Duration",
            name: "duration",
            type: "uint8",
          },
          { internalType: "uint256", name: "expiresAt", type: "uint256" },
        ],
        internalType: "struct OpenFlux.CollectionOffer[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "user", type: "address" }],
    name: "getUserListings",
    outputs: [
      {
        components: [
          { internalType: "address", name: "nftAddress", type: "address" },
          { internalType: "uint256", name: "tokenId", type: "uint256" },
          { internalType: "address payable", name: "seller", type: "address" },
          { internalType: "uint256", name: "price", type: "uint256" },
          { internalType: "address", name: "paymentToken", type: "address" },
          {
            internalType: "enum OpenFlux.Duration",
            name: "duration",
            type: "uint8",
          },
          { internalType: "uint256", name: "expiresAt", type: "uint256" },
        ],
        internalType: "struct OpenFlux.Listing[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "user", type: "address" }],
    name: "getUserNFTOffers",
    outputs: [
      {
        components: [
          { internalType: "address", name: "nftAddress", type: "address" },
          { internalType: "uint256", name: "tokenId", type: "uint256" },
          { internalType: "address", name: "offeror", type: "address" },
          { internalType: "uint256", name: "amount", type: "uint256" },
          { internalType: "address", name: "paymentToken", type: "address" },
          {
            internalType: "enum OpenFlux.Duration",
            name: "duration",
            type: "uint8",
          },
          { internalType: "uint256", name: "expiresAt", type: "uint256" },
        ],
        internalType: "struct OpenFlux.Offer[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_nftAddress", type: "address" },
      { internalType: "uint256", name: "_tokenId", type: "uint256" },
      { internalType: "uint256", name: "_price", type: "uint256" },
      { internalType: "address", name: "_paymentToken", type: "address" },
      {
        internalType: "enum OpenFlux.Duration",
        name: "_duration",
        type: "uint8",
      },
    ],
    name: "listNFT",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "enum OpenFlux.Duration", name: "", type: "uint8" },
    ],
    name: "listingFees",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "", type: "address" },
      { internalType: "uint256", name: "", type: "uint256" },
    ],
    name: "listings",
    outputs: [
      { internalType: "address", name: "nftAddress", type: "address" },
      { internalType: "uint256", name: "tokenId", type: "uint256" },
      { internalType: "address payable", name: "seller", type: "address" },
      { internalType: "uint256", name: "price", type: "uint256" },
      { internalType: "address", name: "paymentToken", type: "address" },
      {
        internalType: "enum OpenFlux.Duration",
        name: "duration",
        type: "uint8",
      },
      { internalType: "uint256", name: "expiresAt", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_collectionAddress", type: "address" },
      { internalType: "uint256", name: "_amount", type: "uint256" },
      { internalType: "address", name: "_paymentToken", type: "address" },
      {
        internalType: "enum OpenFlux.Duration",
        name: "_duration",
        type: "uint8",
      },
    ],
    name: "makeOfferForCollection",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_nftAddress", type: "address" },
      { internalType: "uint256", name: "_tokenId", type: "uint256" },
      { internalType: "uint256", name: "_amount", type: "uint256" },
      { internalType: "address", name: "paymentToken", type: "address" },
      {
        internalType: "enum OpenFlux.Duration",
        name: "_duration",
        type: "uint8",
      },
    ],
    name: "makeOfferForNFT",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "nftAddresses",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "", type: "address" },
      { internalType: "uint256", name: "", type: "uint256" },
      { internalType: "uint256", name: "", type: "uint256" },
    ],
    name: "offersForNFT",
    outputs: [
      { internalType: "address", name: "nftAddress", type: "address" },
      { internalType: "uint256", name: "tokenId", type: "uint256" },
      { internalType: "address", name: "offeror", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
      { internalType: "address", name: "paymentToken", type: "address" },
      {
        internalType: "enum OpenFlux.Duration",
        name: "duration",
        type: "uint8",
      },
      { internalType: "uint256", name: "expiresAt", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "", type: "address" },
      { internalType: "uint256", name: "", type: "uint256" },
    ],
    name: "offersForWholeCollection",
    outputs: [
      { internalType: "address", name: "nftAddress", type: "address" },
      { internalType: "address", name: "offeror", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
      { internalType: "address", name: "paymentToken", type: "address" },
      {
        internalType: "enum OpenFlux.Duration",
        name: "duration",
        type: "uint8",
      },
      { internalType: "uint256", name: "expiresAt", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_token", type: "address" }],
    name: "removeApprovedToken",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_collectionAddress", type: "address" },
    ],
    name: "removeCollection",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "removeExpiredCollectionOffers",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "removeExpiredListings",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "removeExpiredOffersForNFT",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_collectionAddress", type: "address" },
      { internalType: "uint256", name: "_newFeeRate", type: "uint256" },
    ],
    name: "setCollectionFeeRate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_rate", type: "uint256" }],
    name: "setContractCommissionRate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "enum OpenFlux.Duration",
        name: "_duration",
        type: "uint8",
      },
      { internalType: "uint256", name: "_fee", type: "uint256" },
    ],
    name: "setListingFee",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_address", type: "address" }],
    name: "setTreasuryAddress",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "treasuryAddress",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
];

window.TOKEN_ABI = [
  {
    inputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    constant: true,
    inputs: [
      {
        internalType: "address",
        name: "_owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "_spender",
        type: "address",
      },
    ],
    name: "allowance",
    outputs: [
      {
        internalType: "uint256",
        name: "remaining",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        internalType: "address",
        name: "_spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_value",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        internalType: "address",
        name: "_spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_value",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "_extraData",
        type: "bytes",
      },
    ],
    name: "approveAndCall",
    outputs: [
      {
        internalType: "bool",
        name: "success",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        internalType: "address",
        name: "_owner",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "balance",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        internalType: "address",
        name: "_spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_subtractedValue",
        type: "uint256",
      },
    ],
    name: "decreaseApproval",
    outputs: [
      {
        internalType: "bool",
        name: "success",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        internalType: "address",
        name: "_spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_addedValue",
        type: "uint256",
      },
    ],
    name: "increaseApproval",
    outputs: [
      {
        internalType: "bool",
        name: "success",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "initialSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        internalType: "address",
        name: "_to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_value",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        internalType: "address",
        name: "_tokenAddress",
        type: "address",
      },
      {
        internalType: "address",
        name: "_to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "transferAnyERC20Token",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        internalType: "address",
        name: "_from",
        type: "address",
      },
      {
        internalType: "address",
        name: "_to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_value",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
];

function getData(ajaxurl) {
  return $.ajax({
    url: ajaxurl,
    type: "GET",
  });
}

async function getMaxFee() {
  let maxPriorityFeePerGas = new BigNumber(10000000000).toFixed(0) * 1;
  let latestGasPrice = await window.web3.eth.getGasPrice();
  latestGasPrice =
    new BigNumber(latestGasPrice * 1.125 + maxPriorityFeePerGas).toFixed(0) * 1;

  return { latestGasPrice, maxPriorityFeePerGas };
}

window.isConnectedOneTime = false;
window.oneTimeConnectionEvents = [];

// function to connect metamask
async function connectWallet() {
  function onConnect() {
    if (!isConnectedOneTime) {
      window.isConnectedOneTime = true;
      window.oneTimeConnectionEvents.forEach((fn) => fn());
    }
  }
  if (window.ethereum && !window.gatewallet) {
    window.web3 = new Web3(window.ethereum);
    try {
      await window.ethereum?.enable();
      console.log("Connected!");
      if (window.ethereum.isCoin98) {
        window.WALLET_TYPE = "coin98";
      }
      if (window.ethereum.isFluent) {
        window.WALLET_TYPE = "fluent";
      }
      let coinbase_address = await window.ethereum?.request({
        method: "eth_accounts",
      });

      window.coinbase_address = coinbase_address[0];
      onConnect();
      return true;
    } catch (e) {
      console.error(e);
      throw new Error("User denied wallet connection!");
    }
  } else if (window.web3) {
    window.web3 = new Web3(window.web3.currentProvider);
    console.log("connected to old web3");
    onConnect();
    return true;
  } else {
    throw new Error("No web3 detected! Please Install MetaMask!");
  }
}

function param(name) {
  var f = new RegExp("\\b" + name + "=([^&]+)").exec(document.location.search);
  if (f) return decodeURIComponent(f[1].replace(/\+/g, " "));
}

window.param = param;

window.cached_contracts = Object.create(null);

async function getCoinbase() {
  if (window.WALLET_TYPE == "coin98") {
    return window.coinbase_address.toLowerCase();
  } else if (window.gatewallet) {
    try {
      let coinbase_address = await window.gatewallet?.request({
        method: "eth_accounts",
      });

      window.coinbase_address = coinbase_address[0];

      return window.coinbase_address.toLowerCase();
    } catch (e) {
      console.error(e);
      throw new Error("User denied wallet connection!");
    }
  } else {
    const coinbase = await window.ethereum.request({
      method: "eth_accounts",
    });

    if (coinbase && coinbase.length > 0) {
      window.coinbase_address = coinbase[0];

      return window.coinbase_address.toLowerCase();
    }
  }
}

async function disconnectWallet() {
  window.coinbase_address = "0x0000000000000000000000000000000000000000";
  console.log(window.coinbase_address);
  return window.coinbase_addres;
}
async function getContract({ key, address = null, ABI = null }) {
  ABI = ABI || window[key + "_ABI"];
  address = address || window.config[key.toLowerCase() + "_address"];
  if (!window.cached_contracts[key + "-" + address.toLowerCase()]) {
    window.web3 = new Web3(window.ethereum);
    window.cached_contracts[key + "-" + address?.toLowerCase()] =
      new window.web3.eth.Contract(ABI, address, {
        from: await getCoinbase(),
      });
  }
  return window.cached_contracts[key + "-" + address.toLowerCase()];
}

function wait(ms) {
  console.log("Waiting " + ms + "ms");
  return new Promise((r) =>
    setTimeout(() => {
      r(true);
      console.log("Wait over!");
    }, ms)
  );
}
