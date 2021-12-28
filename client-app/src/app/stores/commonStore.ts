import { ServerError } from '../models/ServerError';
import { makeAutoObservable, reaction } from 'mobx';

export default class CommonStore {
    appLoaded = false;
    error: ServerError | null = null;
    token: string | null = window.localStorage.getItem('jwt');

    constructor() {
        makeAutoObservable(this);

        reaction(
            () => this.token,
            token => {
                if (token)
                    window.localStorage.setItem('jwt', token);
                else
                    window.localStorage.removeItem('jwt');
            }
        )
    }

    setServerError = (error: ServerError) => {
        this.error = error;
    }

    setToken = (token: string | null) => {
        this.token = token;
    }

    setAppLoaded = () => {
        this.appLoaded = true;
    }
}