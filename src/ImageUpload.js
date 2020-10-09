import { Button } from '@material-ui/core'
import React, { useState } from 'react'
import { storage, db } from './firebase'
import firebase from 'firebase'
import './ImageUpload.css'

function ImageUpload({ username }) {
    const [image, setImage] = useState(null)
    // const [url, setUrl] = useState("")
    const [progress, setProgress] = useState(0) /* progress bar */
    const [caption, setCaption] = useState('')

    const handleChange = (e) => {
        if (e.target.files[0]) { // get the first file selected when picking multiple image files
            setImage(e.target.files[0])
        }
    }

    const handleUpload = () => {
        const uploadTask = storage.ref(`images/${image.name}`).put(image) // access storage => get reference of the image => put it inside the storage

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                // progress function ...
                const progress = Math.round( // exact progress indicator from 0 to 100
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                )
                setProgress(progress)
            },
            (error) => {
                // Error function ...
                console.log(error)
                alert(error.message)
            },
            () => {
                // complete function ...
                storage
                    .ref("images")
                    .child(image.name)
                    .getDownloadURL() // get download link after uploading the image
                    .then(url => {
                        // post image inside db
                        db.collection("posts").add({
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                            caption: caption,
                            imageURL: url,
                            username: username
                        })

                        setProgress(0) // prevent the progress bar from being stuck at 100
                        setCaption("")
                        setImage(null)
                    })
            }
        )
    }

    return (
        <div className="imageupload">
            <progress className="imageupload__progress" value={progress} max="100" />
            {/* 1. Caption input */}
            <input type="text" placeholder='Enter a caption...' onChange={event => setCaption(event.target.value)} value={caption} />
            {/* 2. File picker */}
            <input type="file" onChange={handleChange} />
            {/* 3. Post button */}
            <Button className="imageupload__button" onClick={handleUpload}>
                Upload
            </Button>
        </div>
    )
}

export default ImageUpload
