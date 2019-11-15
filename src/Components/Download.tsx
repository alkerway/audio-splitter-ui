import * as React from 'react';
import { Statuses } from '../Models/Statuses'

export interface DownloadState {

}

export interface DownloadProps {
    endpoint: string;
    name: string;
    status: Statuses
}
export class Download extends React.Component<DownloadProps, DownloadState> {
    onDownloadClick = () => {
        const body = {
            name: this.props.name
        }
        fetch(`${this.props.endpoint}/getfiles`, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json'
            },
        })
    }
    render() {
        return (this.props.status === Statuses.ERRORRED || this.props.status === Statuses.COMPLETE) ? (
            <div>
                {this.props.status === Statuses.COMPLETE ? 'Download file(s)' : 'Download error log'}
                <button className="downloadButton" onClick={this.onDownloadClick}>Download</button>
            </div>
        ) : (<div></div>)
    }
}
