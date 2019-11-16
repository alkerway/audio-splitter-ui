import * as React from 'react';
import { Download } from "./Download";
import { Options }from './Options'
import { Statuses } from '../Models/Statuses'
import {SpleeterOptions} from "../Models/Stems";

export interface UploadState {
    status: Statuses;
    file: null | File;
    sessionname: string;
    statusInterval: NodeJS.Timer | null,
    options: SpleeterOptions
}

export interface UploadProps {

}
const port = 8880
const endpoint = `${window.location.protocol}//${window.location.hostname}:${port}`

export class Upload extends React.Component<UploadProps, UploadState> {
    private statusIntervalTime = 500;
    constructor(props: UploadProps) {
        super(props)
        this.state ={
            file: null,
            status: Statuses.UNINITIALIZED,
            statusInterval: null,
            sessionname: '',
            options: {
                stems: 2,
                isolate: new Set(),
                remove: new Set()
            }
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
            if (this.state.options.isolate.size || this.state.options.remove.size) {
                this.setState({
                    ...this.state,
                    status: Statuses.UPLOADING
                })
                const form = new FormData()
                form.append('file', this.state.file)
                form.append('stems', String(this.state.options.stems))
                form.append('isolate', JSON.stringify(Array.from(this.state.options.isolate)))
                form.append('remove', JSON.stringify(Array.from(this.state.options.remove)))
                fetch(`${endpoint}/upload`, {
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
                    if (status === Statuses.COMPLETE || status === Statuses.ERRORED) {
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
    onOptionsChange = (options: SpleeterOptions) => {
        this.setState({
            ...this.state,
            options
        })
    }
    render() {
        return (
            <div className="uploadContainer">
                <div className="fileDisplay">{this.state.file && this.state.file.name}</div>
                <Options sendState={this.onOptionsChange}/>
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