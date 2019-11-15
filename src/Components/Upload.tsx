import * as React from 'react';

export interface UploadState {
    uploading: boolean;
    file: null | File;
    uploaded: boolean;
}

export interface UploadProps {

}
const port = 8880
const uploadEndpoint = `${window.location.protocol}//${window.location.hostname}:${port}/upload`

export class Upload extends React.Component<UploadProps, UploadState> {
    constructor(props: UploadProps) {
        super(props)
        this.state ={
            file: null,
            uploading: false,
            uploaded: false
        }
    }
    onFileAdded = (fileList: FileList | null) => {
        if (fileList) {
            this.setState({
                ...this.state,
                file: fileList[0]
            })
            this.startUpload()
        }
    }
    startUpload = () => {
        if (this.state.file) {
            this.setState({
                ...this.state,
                uploaded: false,
                uploading: true
            })
            const form = new FormData()
            form.append('file', this.state.file)
            fetch(uploadEndpoint,{
                method: 'POST',
                body: form
            }).then((res) => {
                return res.text()
            }).then((text) => {
                console.log(text)
            })
        }
    }
    render() {
        return (
            <div className="uploadContainer">
                {/*<div className="fileDisplay">{this.state.file && this.state.file.name}</div>*/}
                <div className="fileInputWrapper">
                    <input
                        id="file-input"
                        type="file"
                        name="fileInput"
                        accept="audio/*"
                        onChange={(e) => this.onFileAdded(e.target.files)}/>
                </div>
                <button
                    onClick={this.startUpload}
                >upload</button>
            </div>
        )
    }
}