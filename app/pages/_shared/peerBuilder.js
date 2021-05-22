export default class PeerBuilder {
    constructor({ peerConfig }) {
        this.peerConfig = peerConfig;
        this.onError = () => {};
        this.onConnectionOpened = () => {};
    }

    setOnError(fn) {
        this.onError = fn;

        return this;
    }

    setOnConnectionOpened(fn) {
        this.onConnectionOpened = fn;

        return this;
    }

    async build() {
        const peer = new globalThis.Peer(...this.peerConfig);
        peer.on('error', this.onError);

        return new Promise(resolve => peer.on('open', () => {
            this.setOnConnectionOpened(peer);
            return resolve(peer);
        }))
    }
}