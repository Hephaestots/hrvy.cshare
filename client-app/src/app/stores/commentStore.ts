import { ActivityComment } from '../models/comment';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { makeAutoObservable, runInAction } from 'mobx';
import { store } from '../stores/store';

export default class CommentStore {
    comments: ActivityComment[] = [];
    hubConnection: HubConnection | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    createHubConnection = (activityId: string) => {
        if (store.activityStore.selectedActivity) {
            this.hubConnection = new HubConnectionBuilder()
                .withUrl(process.env.REACT_APP_COMMENT_URL + '?activityId=' + activityId, {
                    accessTokenFactory: () => store.userStore.user!.token
                })
                .withAutomaticReconnect()
                .configureLogging(LogLevel.Information)
                .build();

            this.hubConnection
                .start()
                .catch(error => console.log('Error establishing the connection to the comments: ', error));

            this.hubConnection.on('LoadComments', (comments: ActivityComment[]) => {
                runInAction(() => {
                    this.comments = comments;
                    this.comments.forEach(comment => {
                        comment.createdAt = new Date(comment.createdAt);
                    });
                })
            });

            this.hubConnection.on('ReceiveComment', (comment: ActivityComment) => {
                runInAction(() => {
                    comment.createdAt = new Date(comment.createdAt);
                    this.comments.unshift(comment);
                })
            });
        }
    }

    stopHubConnection = () => {
        if (this.hubConnection)
            this.hubConnection
                .stop()
                .catch(error => console.log('Error stopping the connection to the comments: ', error));
    }

    clearComments = () => {
        this.comments = [];
        this.stopHubConnection();
    }

    addComment = async (values: any) => {
        values.activityId = store.activityStore.selectedActivity?.id;
        try {
            await this.hubConnection?.invoke('SendComment', values);
        } catch (error) {
            console.log(error);
        }
    }
}