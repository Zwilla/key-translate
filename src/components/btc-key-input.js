// also copyright 2017 Michael Padilla mail: save@myTokenWallet.com donation: ETH:0xD78ec516C31A0fcd22D3CC6DC454FB87d686444e
// Aeternity please donate for my work to: ETH0xD78ec516C31A0fcd22D3CC6DC454FB87d686444e
import bitcoinjs from 'bitcoinjs-lib';
import ethereumjsWallet from 'ethereumjs-wallet';
import bs58 from 'bs58';

var Worker = require('worker-loader!./../utils/key-derivator-worker.js');
const worker = new Worker();

export default {
    name: 'BtcKeyInput',
    template: `
<div>
         <h6>optimized by Zwilla from MyTokenWallet.com</h6>
            <div class="row">
           
                <div class="col-4">
                    <h2>BIP44/BIP32 or custom path prefix</h2>
                    <label >{{bipCustomPathPrefix}}</label>
                    <input id="bipCustomPathPrefix" required type="text" v-bind:value="bipCustomPathPrefix" v-model="bipCustomPathPrefix" class="form-control" value="m/44'/0'/0'/0/" placeholder="m/44'/0'/0'/0/"/>
                </div>
                
                <div class="col-4">
                    <h2>derivation Tries</h2>
                    <input id="derivationTries" required type="text" v-bind:value="derivationTries" v-model="derivationTries" class="form-control" value="1000" placeholder="100"/>
                </div>
                
                <div class="col-4">
                    <h2>set testing data</h2>
                    <button id="addTestData" onclick="addTestData()" >fill</button>
                </div>
                
                
                <div class="col-12">
                    <h2>your BTC WIF secret or mnemonic phrase</h2>
                    <input id="secret" v-bind:value="secret" v-model="secret" class="form-control" type="text" placeholder="correct horse battery staple ..."/>
                </div>
                <div class="col-12">
                    <h2>your BTC Sender Address</h2>
                    <input id="address" v-bind:value="address" v-model="address" class="form-control" type="text" placeholder="BTC-Address you have contributed from"/>
                </div>
            </div>

            <div class="row pt-5 pb-5">
                <div class="col text-center">
                
                    <button class="btn btn-primary" @click="translateKey(secret, address, bipCustomPathPrefix ,derivationTries)" :disabled="isRunning || (!secret || !address)">
                        <i class="fa fa-spinner fa-spin" v-show="isRunning"></i> Generate ETH Public/Private KeyPair
                    </button>
                    
                    <button class="btn btn-primary" @click="translateKey(secret, address, bipCustomPathPrefix ,derivationTries)" :disabled="!isRunning">
                        <i class="fa fa-spinner fa-spin" v-show="isRunning"></i> STOP
                        </button>
                    
                    <p class="pt-3">
                        <small v-if="status.path">
                        Current Derivation Path: 
                        <br>{{ status.path }}
                        <br><br>
                        Type:
                        <br>{{ status.type }}
                        </small>
                    </p>
                </div>
            </div>

            <p class="alert alert-warning" v-if="error">
                {{ error }}
            </p>

            <hr>

            <p class="alert alert-success" v-if="type && path">
                Type: {{ type }}<br>
                Path: {{ path }}
            </p>

        </div>
    `,
    methods: {
        translateKey: function (secret, address, bipCustomPathPrefix ,derivationTries) {

            worker.onmessage = (e) => {
                if (e.data.status) {
                    this.status = e.data.status;
                    return;
                }

                if (e.data.isRunning) {
                    this.isRunning = e.data.isRunning;
                    return;
                }

                if (e.data.error) {
                    this.isRunning = false;
                    this.error = e.data.error;
                    return;
                }

                if (e.data.wif) {
                    this.isRunning = false;

                    let keyPair;

                    try {
                        keyPair = bitcoinjs.ECPair.fromWIF(e.data.wif);

                        if (keyPair.getAddress() === address) {
                            // strip network byte and checksum bytes in the end
                            let wallet = ethereumjsWallet.fromPrivateKey(bs58.decode(keyPair.toWIF()).slice(1, 33));
                            this.$emit('walletChanged', wallet);
                        }
                    } catch (err) {
                        this.error = 'This is not a valid secret.';
                        console.warn(err);
                    }


                }
            };

            worker.postMessage({
                msg: {
                    secret: secret,
                    address: address,
                    bipCustomPathPrefix: bipCustomPathPrefix,
                    derivationTries: derivationTries
                }
            });

        }
    },
    data: function () {
        return {
            isRunning: false,
            derivationTries: 100,
            bipCustomPathPrefix: null,
            path: null,
            type: null,
            secret: null,
            address: null,
            error: null,
            status: {
                try: 0,
                max: 10000
            }
        }
    }
}
