import { constants } from '../../_shared/constants.js';
import LobbyController from './controller.js';
import LobbySocketBuilder from './util/lobbySocketBuilder.js';
import View from './view.js';

const user = {
    img: 'https://cdn4.iconfinder.com/data/icons/avatars-xmas-giveaway/128/suicide_squad_woman_avatar_joker-256.png',
    username: 'Milena ' + Date.now()
}

const socketBuilder= new LobbySocketBuilder({
    socketUrl: constants.socketUrl,
    namespace: constants.socketNamespaces.lobby,
});

const dependencies = {
    socketBuilder,
    user,
    view: View
}

await LobbyController.initialize(dependencies);