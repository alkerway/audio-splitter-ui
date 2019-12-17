import * as React from 'react';
import Dropdown from 'react-dropdown'
import 'react-dropdown/style.css'
import './Options.css'
import {SpleeterOptions, TrackConfig, Stem, Stem4Option, Stem2Option, Stem5Option} from "../Models/Stems";
import {Track} from "./Track";

const stems: Stem[] = [2, 4, 5]
const Stem2Options: Stem2Option[] = ['vocals', 'accompaniment']
const Stem4Options: Stem4Option[] = ['vocals', 'drums', 'bass', 'other']
const Stem5Options: Stem5Option[] = ['vocals', 'drums', 'bass', 'piano', 'other']
const stemOptions = {
    2: Stem2Options,
    4: Stem4Options,
    5: Stem5Options
}

export interface OptionsProps {
    sendState: (options: SpleeterOptions) => void;
}
export class Options extends React.Component<OptionsProps, SpleeterOptions> {
    constructor(props: OptionsProps) {
        super(props);
        this.state = {
            stems: 2,
            tracks: [{
                parts: [],
                trackId: this.generateTrackId(6)
            }]
        }
        this.sendState()
    }

    generateTrackId = (length: number) => {
        let id = ''
        const alphabet = '0123456789ABCDEF'
        for (let i = 0; i < length; i ++) {
            id += alphabet[Math.floor(Math.random() * alphabet.length)]
        }
        return id
    }

    sendState = () => {
        this.props.sendState(this.state)
    }

    removeOldParts = (track: TrackConfig, newOptions: string[]) => {
        track.parts = track.parts.filter(p => newOptions.indexOf(p) > -1)
        return track
    }

    onStemChange = (arg: any) => {
        const {value} = arg
        const newStems = Number(value) as Stem
        const newOptions = stemOptions[newStems]
        this.setState({
            stems: newStems,
            tracks: this.state.tracks.map(t => this.removeOldParts(t, newOptions))
        })
        this.sendState()

    }

    onTrackChange = (track: TrackConfig, trackId: string) => {
        this.setState({
            ...this.state,
            tracks: this.state.tracks.map(t => t.trackId === trackId ? track : t)
        })
        this.sendState()
    }

    onTrackRemove = (trackId: string) => {
        this.setState({
            ...this.state,
            tracks: this.state.tracks.filter(t => t.trackId !== trackId)
        })
    }

    onAddTrack = () => {
        const newTrack: TrackConfig = {
            trackId: this.generateTrackId(6),
            parts: []
        }
        this.setState({
            ...this.state,
            tracks: this.state.tracks.concat([newTrack])
        })
    }

    getTracks = (tracksArr: TrackConfig[]) => {
        return tracksArr.map((trackConfig, idx, tracksArr) => {
            return (
                <Track config={trackConfig}
                       idx={idx}
                       key={trackConfig.trackId}
                       trackId={trackConfig.trackId}
                       isOnlyTrack={tracksArr.length === 1}
                       parts={stemOptions[this.state.stems]}
                       onRemove={id => this.onTrackRemove(id)}
                       onTrackChange={(c) => this.onTrackChange(c, trackConfig.trackId)}/>
            )
        })
    }

    getSplitType = (stem: number): {value: string, label: string} => {
        if (stem === 2) {
            return {
                value: '2',
                label: 'Vocals/Accompaniment'
            }
        } else if (stem == 4) {
            return {
                label: 'Basic Instrumentation',
                value: '4'
            }
        } else {
            return {
                label: 'Instrumentation w/ piano',
                value: '5'
            }
        }
    }

    render() {
        return (<div className='OptionsContainer'>
            <div className="stemSelect">
                <span>Split type: </span> <div className="dropdownContainer">
                                <Dropdown options={stems.map(this.getSplitType)} onChange={this.onStemChange} value={this.state.stems.toString()}/>
                        </div>
            </div>
            <div className="tracksContainer">
                {this.getTracks(this.state.tracks)}
            </div>
            <div className="addTrackButtonContainer">
                <button className="addTrackButton" onClick={this.onAddTrack}>Add Track</button>
            </div>
        </div>)
    }
}
