// also copyright 2017  Michael Padilla mail: save@myTokenWallet.com donation: ETH:0xD78ec516C31A0fcd22D3CC6DC454FB87d686444e
// Aeternity please donate for my work to: ETH0xD78ec516C31A0fcd22D3CC6DC454FB87d686444e
import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue';

import BtcKeyInput from '@/components/btc-key-input';
import EthKeyOutput from '@/components/eth-key-output';

import '@/style/stylesheet.scss';

Vue.use(BootstrapVue);

new Vue({
    selector: 'vue-app',
    components: {
        'btc-key-input': BtcKeyInput,
        'eth-key-output': EthKeyOutput
    },
    el: '#app',
    template: `
        <div class="container">
            <section id="inputSection">
                <h1 class="col-12" >BTC to ETH Address Converter</h1>
                <h2 class="col-6" >never use this tool only at an offline computer</h2>
                <btc-key-input v-on:walletChanged="walletChanged($event)"></btc-key-input>
            </section>
            <section id="outputSection">
                <h2>Derived ETH Addresses</h2>
                <eth-key-output v-if="wallet" :wallet="wallet"></eth-key-output>
            </section>
        </div>
    `,
    methods: {
        walletChanged: function(wallet) {
            this.wallet = wallet;
        }
    },
    data: function() {
        return {
            wallet: null
        }
    }
});
