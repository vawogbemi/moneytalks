import { TipLink } from "@tiplink/api";
import { Connection, LAMPORTS_PER_SOL, Keypair } from "@solana/web3.js";
import { decode as b58decode } from "bs58";
import _sodium from "libsodium-sumo";

globalThis.window = undefined;
globalThis.importScripts = undefined;

await _sodium.ready;
const sodium = _sodium;

async function streamToArrayBuffer(stream, streamSize) {
  let result = new Uint8Array(streamSize);
  let bytesRead = 0;
  const reader = stream.getReader();
  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }
    result.set(value, bytesRead);
    bytesRead += value.length;
  }
  return result;
}

const kdfz = async (fullLength: number, pwShort: Uint8Array) => {
  const salt = new Uint8Array(sodium.crypto_pwhash_SALTBYTES);
  return await kdf(fullLength, pwShort, salt);
};

const kdf = async (fullLength: number, pwShort: Uint8Array, salt: Uint8Array) => {
  console.log("pwhash")
  return sodium.crypto_pwhash(
    fullLength,
    pwShort,
    salt,
    sodium.crypto_pwhash_OPSLIMIT_INTERACTIVE,
    sodium.crypto_pwhash_MEMLIMIT_INTERACTIVE,
    sodium.crypto_pwhash_ALG_DEFAULT
  );
};

const pwToKeypair = async (pw: Uint8Array) => {
  const seed = await kdfz(sodium.crypto_sign_SEEDBYTES, pw);
  return(Keypair.fromSeed(seed));
}

const DESIRED_BALANCE_IN_SOL = 0
const RPC_ENDPOINT = ""
const DESTINATION_ADDRESS = ""

export default {
  async email(message, env, ctx) {
    
    try {

      const emailSubject = message.headers.get('subject')

      //const tiplink = await TipLink.fromLink(emailSubject)
      
      const url = new URL(emailSubject)
      const slug = url.hash.slice(1);
      const pw = Uint8Array.from(b58decode(slug));
      const keypair = await pwToKeypair(pw);


      console.log(keypair.publicKey)

      const connection = new Connection(RPC_ENDPOINT)

      console.log(await connection.getBalance(keypair.publicKey))

      let balance = await connection.getBalance(keypair.publicKey)

      if (balance / LAMPORTS_PER_SOL > DESIRED_BALANCE_IN_SOL) {

        await message.forward(DESTINATION_ADDRESS);
        

      } else {

        message.setReject("gib more moneys");
        
      }

    } catch (error) {

      console.log(error)
      message.setReject("No TipLink");

    }

  }
}