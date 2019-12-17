import * as React from "react";
import {Stem2Option, Stem4Option, Stem5Option, TrackConfig} from "../Models/Stems";
import './Track.css'

export interface TrackProps {
    idx: number,
    config: TrackConfig,
    onTrackChange: (track: TrackConfig) => void,
    isOnlyTrack: boolean,
    parts: string[],
    trackId: string;
    onRemove: (trackId: string) => void
}

export class Track extends React.Component<TrackProps, TrackConfig> {
    constructor(props: TrackProps) {
        super(props);
    }

    onChecked = (part: string) => {
        if (this.props.config.parts.indexOf(part) > 0) {
            this.props.config.parts = this.props.config.parts.filter(p => p !== part)
            this.props.onTrackChange(this.props.config)
        } else {
            this.props.config.parts.push(part)
            this.props.onTrackChange(this.props.config)
        }
    }

    getStemBoxes = (parts: string[]) => {
        return parts.map((part) => {
            return (
                <span className="checkAndLabel" key={this.props.trackId + part}>
                    <input type="checkbox"
                           defaultChecked={this.props.config.parts.indexOf(part) > -1}
                           onChange={e => this.onChecked(part)}
                           id={this.props.trackId + part}
                           name={this.props.trackId + part}/>
                    <label htmlFor={this.props.trackId + part}><span>{part}</span></label>
                </span>
            )
        })
    }

    render() {
        return (
            <div className="trackContainer">
                <p className="trackTitle">Track {this.props.idx + 1}</p>
                {!this.props.isOnlyTrack ?
                    <button className="removeButton" onClick={e =>this.props.onRemove(this.props.trackId)}>🞨</button> : ""}
                <div className="clearBoth"></div>
                {this.getStemBoxes(this.props.parts)}
            </div>
        )
    }
}
