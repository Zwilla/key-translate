// also copyright 2017  Michael Padilla mail: save@myTokenWallet.com donation: ETH:0xD78ec516C31A0fcd22D3CC6DC454FB87d686444e
// Aeternity please donate for my work to: ETH0xD78ec516C31A0fcd22D3CC6DC454FB87d686444e
export default {
    name: 'EthKeyOutput',
    props: ['wallet'],
    template: `
        <div>
            your ETH Private-Key:
            <textarea class="form-control" :value="privateKey"></textarea>

            your translate ETH Address:
            <textarea class="form-control" :value="address"></textarea>
        </div>
`,
    computed: {
        address: function() {
            if (!this.wallet) return '';
            return "0x" + this.wallet.getAddress().toString('hex');
        },
        privateKey: function() {
            if (!this.wallet) return '';
            return this.wallet.getPrivateKey().toString('hex');
        }
    }
}
