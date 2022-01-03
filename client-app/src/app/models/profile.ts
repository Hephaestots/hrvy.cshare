import Photo from './photo';

export default interface Profile {
    displayName: string;
    username: string;
    bio?: string;
    image?: string;
    photos?: Photo[]
}

const emptyProfile = (): Profile => ({
    displayName: '',
    username: '',
    image: '',
    bio: ''
});

export const newProfile = <T extends Partial<Profile>>(user: T): Profile => {
    let subset = (({ displayName, username, image, bio }) =>
        ({ displayName, username, image, bio }))(user as Profile);
    return Object.assign(emptyProfile(), subset);
}