import Photo from './photo';

export default interface Profile {
    bio?: string;
    displayName: string;
    followersCount: number;
    following: boolean;
    followingCount: number;
    image?: string;
    photos?: Photo[];
    username: string;
}

const emptyProfile = (): Profile => ({
    displayName: '',
    followersCount: 0,
    following: false,
    followingCount: 0,
    username: ''
});

export const newProfile = <T extends Partial<Profile>>(user: T): Profile => {
    let subset = (({ displayName, username, image, bio }) =>
        ({ displayName, username, image, bio }))(user as Profile);
    return Object.assign(emptyProfile(), subset);
}