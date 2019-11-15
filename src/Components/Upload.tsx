import * as React from 'react';
import { Download } from "./Download";
import { Statuses } from '../Models/Statuses'

export interface UploadState {
    status: Statuses;
    file: null | File;
    sessionname: string;
    statusInterval: NodeJS.Timer | null
}

export interface UploadProps {

}
const port = 8880
const endpoint = `${window.location.protocol}//${window.location.hostname}:${port}`

export class Upload extends React.Component<UploadProps, UploadState> {
    private statusIntervalTime = 2000;
    constructor(props: UploadProps) {
        super(props)
        this.state ={
            file: null,
            status: Statuses.UNINITIALIZED,
            statusInterval: null,
            sessionname: ''
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
                status: Statuses.UPLOADING
            })
            const form = new FormData()
            form.append('file', this.state.file)
            fetch(`${endpoint}/upload`,{
                method: 'POST',
                body: form
            }).then((res) => {
                if (res.ok) {
                    return res.json()
                }
            }).then((res) => {
                this.setState({
                    ...this.state,
                    status: Statuses.UPLOADED,
                    sessionname: res.name
                })
                this.startStatusCheck(res.name)
            }).catch((err) => {
                console.log(err)
            })
        }
    }
    async getStatus (name: string): Promise<String> {
        const response = await fetch(`${endpoint}/checkstatus`, {
            method: 'POST',
            body: JSON.stringify({name}),
            headers: {
                'Content-Type': 'application/json'
            },
        })
        const responseObj = await response.json()
        if (response.ok) {
            return responseObj.status
        } else {
            throw new Error(responseObj.message)
        }
    }
    startStatusCheck = (name: string) => {
        this.setState({
            ...this.state,
            statusInterval: setInterval(() => {
                this.getStatus(name).then((status) => {
                    this.setState({
                        ...this.state,
                        status
                    })
                    if (status === Statuses.COMPLETE || status === Statuses.ERRORRED) {
                        this.stopStatusCheck()
                    }
                }).catch(err => console.log)
            }, this.statusIntervalTime)
        })
    }
    stopStatusCheck = () => {
        if (this.state.statusInterval) {
            clearInterval(this.state.statusInterval)
        }
        this.setState({
            ...this.state,
            statusInterval: null
        })
    }
    render() {
        return (
            <div className="uploadContainer">
                <div className="fileDisplay">{this.state.file && this.state.file.name}</div>
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
                <div className="statusDisplay">
                    {this.state.status !== Statuses.UNINITIALIZED ? `Status: ${this.state.status}` : ''}
                </div>
                <Download name={this.state.sessionname} endpoint={endpoint} status={this.state.status} />
            </div>
        )
    }
}