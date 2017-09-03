// also copyright 2017  Michael Padilla mail: save@myTokenWallet.com donation: ETH:0xD78ec516C31A0fcd22D3CC6DC454FB87d686444e
// Aeternity please donate for my work to: ETH0xD78ec516C31A0fcd22D3CC6DC454FB87d686444e
import bip39 from 'bip39';
import bs58 from 'bs58';
import bitcoinjs from 'bitcoinjs-lib';
import hdkey from 'ethereumjs-wallet/hdkey';
import ethereumjsWallet from 'ethereumjs-wallet';

const bip32pathPrefix = "m/0'/0/";
const bip44pathPrefix = "m/44'/0'/0'/0/";
let bipCustomPathPrefix = "m/44'/0'/0'/0/";
let derivationTries = 100;

self.onmessage = function(e) {
    if (e.data.msg === undefined) return;

    postMessage({ isRunning: true });

    let address = e.data.msg.address;
    let secret = e.data.msg.secret;
    let bipCustomPathPrefix = e.data.msg.bipCustomPathPrefix;
    let derivationTries = e.data.msg.derivationTries;

    let wif;
    let hdRoot;

    // check if we deal with a mnenomic phrase
    if (bip39.validateMnemonic(secret) && bitcoinjs.address) {
        hdRoot = bitcoinjs.HDNode.fromSeedBuffer(bip39.mnemonicToSeed(secret));

        // search for used address
        for (var i = 0; i < derivationTries; i++) {

            console.log('Zwilla-Try-No:' + i);
            // check if its a bip32 key
            postMessage({ status: { path: bip32pathPrefix + i, type: 'BIP32' }});

            if (hdRoot.derivePath(bip32pathPrefix + i).getAddress() === address) {
                wif = hdRoot.derivePath(bip32pathPrefix + i).keyPair.toWIF();
                break;
            }

            // check if its a bip44 key
            postMessage({ status: { path: bip44pathPrefix + i, type: 'BIP44' }});

            if (hdRoot.derivePath(bip44pathPrefix + i).getAddress() === address) {
                wif = hdRoot.derivePath(bip44pathPrefix + i).keyPair.toWIF();
                break;
            }

            // check if its a custom path key
            // by miguel padilla 2017
//            postMessage({ status: { path: bipCustomPathPrefix + i, type: 'BIP44' }});
//            if (hdRoot.derivePath(bipCustomPathPrefix + i).getAddress() === address) {
//                wif = hdRoot.derivePath(bipCustomPathPrefix + i).keyPair.toWIF();
//                break;
//            }


            if (i + 1 >= derivationTries) {
                postMessage({ error: 'We couldn\'t match your address to your key.' });
            }

        }

    }
    else {
        wif = secret;
    }

    postMessage({ wif: wif });
    postMessage({ isRunning: false });

};

