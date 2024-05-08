import bs58 from 'bs58'
import * as prompt from 'prompt-sync'

function secretsToUintArray(secrets: string) {
  return bs58.decode(secrets);
}

function uintArrayToSecrets(array: Uint8Array | number[]) {
  const secrets = bs58.encode(array).toString();
  return secrets;
}

function promptForUintArray() {
  const prompter = prompt.default();
  const array = prompter('Enter uint array:')
  const secret = uintArrayToSecrets(JSON.parse(array))
  console.log('Your wallet secret is:', secret);
}

function promptForSecrets() {
  const prompter = prompt.default();
  const secret = prompter('Enter wallet secret:')
  const array = secretsToUintArray(secret)
  console.log('Your wallet private key is:', array);
}

function main() {
  promptForUintArray();
  // promptForSecrets();
}

main()

// import {Keypair} from '@solana/web3.js';

// const devPrivateKey = require('./dev-wallet.json');
// console.log('length', devPrivateKey.length)
// const keypair = Keypair.fromSecretKey(Uint8Array.from(devPrivateKey).slice(0, 32));


// console.log('wallet', {
//   publicKey: keypair.publicKey.toBase58(),
//   secretKey: keypair.secretKey
// })