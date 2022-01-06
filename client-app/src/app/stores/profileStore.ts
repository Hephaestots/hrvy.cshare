import Profile from '../models/profile';
import { makeAutoObservable, reaction, runInAction } from 'mobx';
import agent from '../api/agent';
import { store } from './store';
import Photo from '../models/photo';
import UserActivity from '../models/userActivity';

export default class ProfileStore {
    activeTab = 0;
    followings: Profile[] = [];
    loading = false;
    loadingActivities = false;
    loadingFollowings = false;
    loadingProfile = false;
    profile: Profile | null = null;
    uploadingPhoto = false;
    userActivities: UserActivity[] = [];

    constructor() {
        makeAutoObservable(this);

        reaction(() => this.activeTab, activeTab => {
            if (activeTab === 3 || activeTab === 4) {
                const predicate = activeTab === 3 ? 'followers' : 'following';
                this.loadFollowings(predicate);
            } else {
                this.followings = [];
            }
        });
    }

    get isCurrentUser() {
        if (store.userStore.user && this.profile)
            return (store.userStore.user.username === this.profile.username);
        return false;
    }

    deletePhoto = async (photo: Photo) => {
        this.loading = true;
        try {
            await agent.Profiles.deletePhoto(photo.id);
            runInAction(() => {
                if (this.profile && this.profile.photos) {
                    this.profile.photos = this.profile.photos.filter(p => p.id !== photo.id);
                }
            })
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => {
                this.loading = false;
            })
        }
    }

    editProfile = async (profile: Partial<Profile>) => {
        this.loading = true;
        try {
            await agent.Profiles.editProfile(profile);
            runInAction(() => {
                if (profile && profile.displayName !== store.userStore.user?.displayName) {
                    store.userStore.setDisplayName(profile.displayName!);
                }
                this.profile = { ...this.profile, ...profile as Profile };
            })
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => {
                this.loading = false;
            })
        }
    }

    loadProfile = async (username: string) => {
        this.loadingProfile = true;
        try {
            var profile = await agent.Profiles.get(username);
            runInAction(() => {
                this.profile = profile;
            })
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => {
                this.loadingProfile = false;
            });
        }
    }

    loadFollowings = async (predicate: string) => {
        this.loadingFollowings = true;
        try {
            const followings = await agent.Profiles.listFollowings(this.profile!.username, predicate);
            runInAction(() => {
                this.followings = followings;
            });
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => {
                this.loadingFollowings = false;
            });
        }
    }

    loadUserActivities = async (predicate: string) => {
        this.loadingActivities = true;
        try {
            const userActivities = await agent.Profiles.listUserActivities(this.profile!.username, predicate);
            runInAction(() => {
                this.userActivities = userActivities;
            });
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => {
                this.loadingActivities = false;
            });
        }
    }

    setActiveTab = (tab: any) => {
        this.activeTab = tab;
    }

    setMainPhoto = async (photo: Photo) => {
        this.loading = true;
        try {
            await agent.Profiles.setMainPhoto(photo.id);
            store.userStore.setImage(photo.url);
            runInAction(() => {
                if (this.profile && this.profile.photos) {
                    this.profile.photos.find(p => p.isMain)!.isMain = false;
                    this.profile.photos.find(p => p.id === photo.id)!.isMain = true;
                    this.profile.image = photo.url;
                }
            })
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => {
                this.loading = false;
            })
        }
    }

    uploadPhoto = async (file: Blob) => {
        this.uploadingPhoto = true;
        try {
            const response = await agent.Profiles.uploadPhoto(file);
            const photo = response.data;
            runInAction(() => {
                if (this.profile) {
                    this.profile.photos?.push(photo);
                    if (photo.isMain && store.userStore.user) {
                        store.userStore.setImage(photo.url);
                        this.profile.image = photo.url;
                    }
                }
            })
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => {
                this.uploadingPhoto = false;
            })
        }
    }

    updateFollowing = async (username: string, following: boolean) => {
        this.loading = true;
        try {
            await agent.Profiles.updateFollowing(username);
            store.activityStore.updateAttendeeFollowing(username);
            runInAction(() => {
                if (this.profile
                    && this.profile.username !== store.userStore.user?.username
                    && this.profile.username === username) {
                    following ? this.profile.followersCount++ : this.profile.followersCount--;
                    this.profile.following = !this.profile.following;
                }
                if (this.profile && this.profile.username === store.userStore.user?.username) {
                    following ? this.profile.followingCount++ : this.profile.followingCount--;
                }
                this.followings.forEach(profile => {
                    if (profile.username === username) {
                        profile.following ? profile.followersCount-- : profile.followersCount++;
                        profile.following = !profile.following;
                    }
                });
            });
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => {
                this.loading = false;
            });
        }
    }
}