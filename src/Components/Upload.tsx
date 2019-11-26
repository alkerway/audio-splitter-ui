import * as React from 'react';
import { Download } from "./Download";
import {FileInput} from "./FileInput";
import { Options }from './Options'
import { Statuses } from '../Models/Statuses'
import {SpleeterOptions} from "../Models/Stems";
import HttpService from "../Services/http.service"

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
                isolate: new Set(),
                remove: new Set()
            }
        }
    }
    onFileAdded = (file: File) => {
            this.setState({...this.state, file })
            this.startUpload()
    }
    startUpload = () => {
        if (this.state.file && (this.state.options.isolate.size || this.state.options.remove.size)) {
                this.setState({
                    ...this.state,
                    status: Statuses.UPLOADING
                })
                const form = new FormData()
                form.append('file', this.state.file)
                form.append('stems', String(this.state.options.stems))
                form.append('isolate', JSON.stringify(Array.from(this.state.options.isolate)))
                form.append('remove', JSON.stringify(Array.from(this.state.options.remove)))
                HttpService.post('upload', form)
                    .then((res) => {
                        if (res) {
                            this.setState({
                                ...this.state,
                                status: Statuses.UPLOADED,
                                sessionname: res.name
                            })
                            this.startStatusCheck(res.name)
                        }
                    })
            }
    }
    async getStatus (name: string): Promise<Statuses | null> {
        const headers: HeadersInit = {
            'Content-Type': 'application/json'
        }
        const response = await HttpService.post('checkstatus', JSON.stringify({name}), headers)
        if (response && response.status) {
            return response.status
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
                <button onClick={this.startUpload}>Start</button>
                <div className="statusDisplay">
                    {this.state.status !== Statuses.UNINITIALIZED ? `Status: ${this.state.status}` : ''}
                </div>
                <Download name={this.state.sessionname} status={this.state.status} />
            </div>
        )
    }
}
