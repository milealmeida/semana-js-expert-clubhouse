import { constants } from '../../_shared/constants.js';
import Attendee from './entities/attendee.js';

export default class RoomController {
    constructor({ roomInfo, socketBuilder, view, peerBuilder }) {
        this.socketBuilder = socketBuilder;
        this.peerBuilder = peerBuilder;
        this.roomInfo = roomInfo;
        this.view = view;
        this.socket = {};
    }

    static async initialize(deps) {
        return new RoomController(deps)._initialize();
    }

    async _initialize() {     
        this._setupViewEvents();

        this.socket = this._setupSocket();
        this.peer = await this._setupWebRTC();
       
        this.socket.emit(constants.events.JOIN_ROOM, this.roomInfo );
    }

    _setupViewEvents() {
        this.view.updateUserImage(this.roomInfo.user);
        this.view.updateRoomTopic(this.roomInfo.room);
    }

    _setupSocket() {
        return this.socketBuilder
            .setOnUserConnected(this.onUserConnected())
            .setOnUserDisconnected(this.onDisconnected())
            .setOnRoomUpdated(this.onRoomUpdated())
            .setOnUserProfileUpgrade(this.onUserProfileUpgrade())
            .build();
    }

    async _setupWebRTC() {
        return this.peerBuilder
            .setOnError(this.onPeerError())
            .setOnConnectionOpened(this.onPeerConnectionOpened())
            .build();
    }

    onPeerError() {
        return error => {
            console.log('deu ruim', error);
        };
    }

    onPeerConnectionOpened() {
        return peer => {
            console.log('peeeer', peer)
        };
    }

    onUserProfileUpgrade() {
        return data => {
            const attendee = new Attendee(data);

            console.log('onUserProfileUpgrade', attendee);

            if(attendee.isSpeaker) {
                this.view.addAttendeeOnGrid(attendee, true);
            }
        }
    }

    onRoomUpdated() {
        return room => {
            this.view.updateAttendeesOnGrid(room);
            console.log('room list!', room);
        }
    }

    onDisconnected() {
        return data => {
            const attendee = new Attendee(data);

            this.view.removeItemFromGrid(attendee.id);
            console.log(`${attendee.username} disconnected!`);
        }
    }

    onUserConnected() {
        return data => {
            const attendee = new Attendee(data);

            console.log('user connected!', attendee);
            this.view.addAttendeeOnGrid(attendee);
        };
    }
}