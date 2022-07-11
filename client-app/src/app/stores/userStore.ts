import { makeAutoObservable, runInAction } from 'mobx';
import agent from '../api/agent';
import { User, UserFormValues } from '../models/User';
import { store } from './store';
import { history } from '../layout/base/history';

export default class UserStore {
    user: User | null = null;
    fbAccessToken: string | null = null;
    fbLoading = false;
    refreshTokenTimeout: any;

    constructor() {
        makeAutoObservable(this);
    }

    get isLoggedIn() {
        return !!this.user;
    }

    login = async (creds: UserFormValues) => {
        try {
            const user = await agent.Account.login(creds);
            store.commonStore.setToken(user.token);
            this.startRefreshTokenTimer(user);
            runInAction(() => this.user = user);
            history.push('/activities');
            store.activityStore.loadActivities();
            store.modalStore.closeModal();
        } catch (error) {
            throw error;
        }
    }

    getFacebookLoginStatus = async () => {
        window.FB.getLoginStatus(response => {
            if (response.status === 'connected') {
                this.fbAccessToken = response.authResponse.accessToken;
            }
        });
    }

    apiLogin = (accessToken: string) => {
        agent.Account.fbLogin(accessToken).then(user => {
            store.commonStore.setToken(user.token);
            this.startRefreshTokenTimer(user);
            runInAction(() => {
                this.user = user;
                this.fbLoading = false;
            });
            history.push('/activities');
        }).catch(error => {
            console.log(error);
            runInAction(() => this.fbLoading = false);
        });
    }

    facebookLogin = () => {
        this.fbLoading = true;
        try {
            if (this.fbAccessToken) {
                this.apiLogin(this.fbAccessToken);
            } else {
                window.FB.login(response => {
                    this.apiLogin(response.authResponse.accessToken);
                }, { scope: 'public_profile,email' });
            }
        } catch (error) {
            throw error;
        }
    }

    logout = () => {
        store.commonStore.setToken(null);
        window.localStorage.removeItem('jwt');
        this.user = null;
        history.push('/');
    }

    register = async (creds: UserFormValues) => {
        try {
            const user = await agent.Account.register(creds);
            store.commonStore.setToken(user.token);
            this.startRefreshTokenTimer(user);
            runInAction(() => this.user = user);
            history.push('/activities');
            store.modalStore.closeModal();
        } catch (error) {
            throw error;
        }
    }

    refreshToken = async () => {
        this.stopRefresTokenTimer();
        try {
            const user = await agent.Account.refreshToken();
            runInAction(() => this.user = user);
            store.commonStore.setToken(user.token);
            this.startRefreshTokenTimer(user);
        } catch (error) {
            console.log(error);
        }
    }

    private startRefreshTokenTimer(user: User) {
        const jwtToken = JSON.parse(atob(user.token.split('.')[1]));
        const expires = new Date(jwtToken.exp * 1000);
        const timeout = expires.getTime() - Date.now() - (60 * 1000);
        this.refreshTokenTimeout = setTimeout(this.refreshToken, timeout);
    }

    private stopRefresTokenTimer() {
        clearTimeout(this.refreshTokenTimeout);
    }

    getUser = async () => {
        try {
            const user = await agent.Account.current();
            store.commonStore.setToken(user.token);
            runInAction(() => this.user = user);
            this.startRefreshTokenTimer(user);
        } catch (error) {
            console.log(error);
        }
    }

    setDisplayName = (name: string) => {
        if (this.user) this.user.displayName = name;
    }

    setImage = (image: string) => {
        if (this.user) this.user.image = image;
    }
}