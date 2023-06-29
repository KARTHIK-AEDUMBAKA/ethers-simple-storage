const ethers = require("ethers");
const fs = require("fs-extra");
require("dotenv").config();
async function main() {
  console.log("😍😍😍Starting😍😍😍");
  // http://172.27.80.1:7545
  const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);

  const encryptedJson = fs.readFileSync("./.encryptedKey.json", "utf-8");
  let wallet = new ethers.Wallet.fromEncryptedJsonSync(
    encryptedJson,
    process.env.PRIVATE_KEY_PASSWORD
  );
  //   const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  wallet = await wallet.connect(provider);
  const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf8");
  const binary = fs.readFileSync(
    "./SimpleStorage_sol_SimpleStorage.bin",
    "utf8"
  );
  const contractFactory = new ethers.ContractFactory(abi, binary, wallet);
  console.log("...Deploying , please wait...");
  const contract = await contractFactory.deploy();
  const deploymentReceipt = await contract.deployTransaction.wait(1);
  // console.log(deploymentReceipt);
  console.log("Using the contract......");
  const currentFavoritesNumber = await contract.retrieve();
  console.log(`current Favorite Number ${currentFavoritesNumber.toString()}`);
  const newFavoritesNumberStore = await contract.store(213);
  const newFavoritesNumber = await contract.retrieve();
  console.log(`new Favorite Number ${newFavoritesNumber}`);
  console.log("ending the contract...");
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
