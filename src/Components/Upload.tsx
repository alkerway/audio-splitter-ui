import * as React from 'react';
import { Download } from "./Download";
import {FileInput} from "./FileInput";
import { Options }from './Options'
import { Statuses } from '../Models/Statuses'
import {SpleeterOptions} from "../Models/Stems";
import HttpService from "../Services/http.service"
import './Upload.css'

export interface UploadState {
    status: Statuses;
    file: null | File;
    sessionname: string;
    statusInterval: NodeJS.Timer | null,
    options: SpleeterOptions
}

export interface UploadProps {}

export class Upload extends React.Component<UploadProps, UploadState> {
    private statusIntervalTime = 1000;
    constructor(props: UploadProps) {
        super(props)
        this.state ={
            file: null,
            status: Statuses.UNINITIALIZED,
            statusInterval: null,
            sessionname: '',
            options: {
                stems: 2,
                tracks: []
            }
        }
    }
    onFileAdded = (file: File) => {
            this.setState({...this.state, file })
            this.startUpload()
    }
    startUpload = () => {
        if (this.state.file && this.state.options.tracks.length) {
                this.setState({
                    ...this.state,
                    status: Statuses.UPLOADING
                })
                const reqBody = JSON.stringify({
                    'filename': this.state.file.name,
                    'contentType': this.state.file.type,
                    'stems': this.state.options.stems,
                    'tracks': this.state.options.tracks
                })
                HttpService.post(`generatepresignedurl`, reqBody)
                    .then((res) => {
                        if (res && res.message && res.name && this.state.file) {
                            this.setState({
                                ...this.state,
                                sessionname: res.name,
                                file: this.state.file
                            })
                            return fetch(res.message, {
                                method: 'PUT',
                                headers: {
                                    'Content-Type': this.state.file && this.state.file.type || '',
                                },
                                body: this.state.file
                            })
                        }
                    })
                    .then((body) => {
                        // this.startStatusCheck(this.state.sessionname)
                })
                    .catch((err) => {
                        console.log('upload err', err)
                    })
            }
    }
    async getStatus (name: string): Promise<Statuses | null> {
        const response = await HttpService.get(`checkstatus?name=${name}`)
        if (response && response.message) {
            return response.message
        }
        return null;
    }
    startStatusCheck = (name: string) => {
        this.setState({
            ...this.state,
            statusInterval: setInterval(() => {
                this.getStatus(name).then((status) => {
                    if (status) {
                        this.setState({
                            ...this.state,
                            status
                        })
                        if (status === Statuses.COMPLETE || status === Statuses.ERRORED) {
                            this.stopStatusCheck()
                        }
                    } else {
                        this.setState({
                            ...this.state,
                            status: Statuses.ERRORED
                        })
                        this.stopStatusCheck()
                    }
                })
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
        this.setState({...this.state, options })
    }
    render() {
        return (
            <div className="uploadContainer">
                <Options sendState={this.onOptionsChange}/>
                <FileInput onFileAdded={this.onFileAdded}/>
                <button className="startButton" onClick={this.startUpload}>Start</button>
                <div className="statusDisplay">
                    {this.state.status !== Statuses.UNINITIALIZED ? `Status: ${this.state.status}` : ''}
                </div>
                <Download name={this.state.sessionname} status={this.state.status} />
            </div>
        )
    }
}
