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
        window.open(`${this.props.endpoint}/getfiles?name=${this.props.name}`);
    }
    render() {
        return (this.props.status === Statuses.ERRORED || this.props.status === Statuses.COMPLETE) ? (
            <div>
                {this.props.status === Statuses.COMPLETE ? 'Download file(s)' : 'Download error log'}
                <button className="downloadButton" onClick={this.onDownloadClick}>Download</button>
            </div>
        ) : (<div></div>)
    }
}
