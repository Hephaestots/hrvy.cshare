import React, { SyntheticEvent, useState } from 'react';
import { Button, Card, Grid, Header, Image, Tab } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import Profile from '../../app/models/profile';
import { useStore } from '../../app/stores/store';
import PhotoUploadWidget from '../../app/common/imageUpload/PhotoUploadWidget';
import Photo from '../../app/models/photo';

interface Props {
    profile: Profile;
}

export default observer(function ProfilePhotos({ profile }: Props) {

    const { profileStore } = useStore();
    const {
        isCurrentUser,
        loading,
        deletePhoto,
        setMainPhoto,
        uploadingPhoto,
        uploadPhoto } = profileStore;

    // Local state.
    const [addPhotoMode, setAddPhotoMode] = useState(false);
    const [target, setTarget] = useState('');

    function handlePhotoUpload(file: Blob) {
        uploadPhoto(file).then(() => setAddPhotoMode(false));
    }

    function handleSetMainPhoto(photo: Photo, e: SyntheticEvent<HTMLButtonElement>) {
        setTarget(e.currentTarget.name);
        setMainPhoto(photo);
    }

    function handleDeletePhoto(photo: Photo, e: SyntheticEvent<HTMLButtonElement>) {
        setTarget(e.currentTarget.name);
        deletePhoto(photo);
    }

    return (
        <Tab.Pane>
            <Grid>
                <Grid.Column width={16}>
                    <Header icon='image' floated='left' content='Photos' />
                    {isCurrentUser && (
                        <Button
                            floated='right'
                            basic
                            content={addPhotoMode ? 'Cancel' : 'Add Photo'}
                            onClick={() => setAddPhotoMode(!addPhotoMode)}
                            color={addPhotoMode ? 'red' : 'teal'}
                        />
                    )}
                </Grid.Column>
                <Grid.Column width={16}>
                    {addPhotoMode ? (
                        <PhotoUploadWidget loading={uploadingPhoto} uploadPhoto={handlePhotoUpload} />
                    ) : (
                        <Card.Group>
                            {profile.photos?.map((photo) => (
                                <Card key={photo.id}>
                                    <Card.Content>
                                        <Image size='small' src={photo.url || '/assets/user.png'} />
                                        {isCurrentUser && (
                                            <Button.Group fluid widths={2}>
                                                <Button
                                                    basic
                                                    color='green'
                                                    content='Main'
                                                    disabled={photo.isMain}
                                                    loading={target === (photo.id + '_m') && loading}
                                                    name={photo.id + '_m'}
                                                    onClick={e => handleSetMainPhoto(photo, e)}
                                                />
                                                <Button
                                                    basic
                                                    color='red'
                                                    icon='trash'
                                                    disabled={photo.isMain}
                                                    loading={target === (photo.id + '_d') && loading}
                                                    name={photo.id + '_d'}
                                                    onClick={e => handleDeletePhoto(photo, e)}
                                                />
                                            </Button.Group>
                                        )}
                                    </Card.Content>
                                </Card>
                            ))}
                        </Card.Group>
                    )}
                </Grid.Column>
            </Grid>
        </Tab.Pane>
    );
});