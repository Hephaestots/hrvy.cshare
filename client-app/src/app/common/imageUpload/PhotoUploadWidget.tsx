import React, { Fragment, useEffect, useState } from 'react';
import { Cropper } from 'react-cropper';
import { Button, Grid, Header } from 'semantic-ui-react';
import PhotoWidgetCropper from './PhotoWidgetCropper';
import PhotoWidgetDropzone from './PhotoWidgetDropzone';
import { observer } from 'mobx-react-lite';

interface Props {
    loading: boolean;
    uploadPhoto: (file: Blob) => void;
}

export default observer(function PhotoUploadWidget({ loading, uploadPhoto }: Props) {

    const [files, setFiles] = useState<any>([]);
    const [cropper, setCropper] = useState<Cropper>();

    function onCrop() {
        if (cropper) {
            cropper.getCroppedCanvas().toBlob(blob => uploadPhoto(blob!));
        }
    }

    //Cleaning up after ourselves from the createObject.
    useEffect(() => {
        return () => {
            files.forEach((file: any) => URL.revokeObjectURL(file.preview));
        }
    }, [files]);

    return (
        <Grid>
            <Grid.Column width={4}>
                <Header color='teal' content='Step 1 - Add' />
                <PhotoWidgetDropzone setFiles={setFiles} />
            </Grid.Column>
            <Grid.Column width={2} />
            <Grid.Column width={4}>
                <Header color='teal' content='Step 2 - Resize' />
                {files && (files.length > 0) && (
                    <PhotoWidgetCropper
                        imagePreview={files[0].preview}
                        setCropper={setCropper}
                    />
                )}
            </Grid.Column>
            <Grid.Column width={2} />
            <Grid.Column width={4}>
                <Header color='teal' content='Step 3 - Upload' />
                {files && (files.length > 0) && (
                    <Fragment>
                        <div className='img-preview' style={{ minHeight: 200, overflow: 'hidden' }} />
                        <Button.Group widths={2}>
                            <Button loading={loading} onClick={onCrop} positive icon='check' />
                            <Button disabled={loading} onClick={() => setFiles([])} icon='close' />
                        </Button.Group>
                    </Fragment>
                )}
            </Grid.Column>
        </Grid>
    );
});