import * as React from 'react';
import Dropdown from 'react-dropdown'
import 'react-dropdown/style.css'
import './Options.css'
import {SpleeterOptions, Stem, Stem4Option, Stem2Option, Stem5Option} from "../Models/Stems";

const stems: Stem[] = [2, 4, 5]
const Stem2Options: Stem2Option[] = ['vocals', 'accompaniment']
const Stem4Options: Stem4Option[] = ['vocals', 'drums', 'bass', 'other']
const Stem5Options: Stem5Option[] = ['vocals', 'drums', 'bass', 'piano', 'other']


export interface OptionsProps {
    onOptionsChange: (options: SpleeterOptions) => void;
}
export class Options extends React.Component<OptionsProps, SpleeterOptions> {
    constructor(props: OptionsProps) {
        super(props);
        this.state = {
            stems: 2,
            isolate: [],
            remove: []
        }
    }

    onStemChange = (arg: any) => {
        const {value} = arg
        this.setState({
            ...this.state,
            stems: Number(value) as Stem
        })
    }
    get stemsArray(): string[] {
        if (this.state.stems === 2) {
            return Stem2Options
        } else if (this.state.stems === 4) {
            return Stem4Options
        } else {
            return Stem5Options
        }
    }

    getOption = (option: string, rowClass: string) => {
        return (
            <div key={`${rowClass}${option}`} className={`${rowClass} optionRow`}>
                <input type="checkbox" name={`${rowClass}${option}`}/>
                <label htmlFor={`${rowClass}${option}`}>{option}</label>
            </div>
        )
    }

    render() {
        return (<div className='OptionsContainer'>
            <div className="stemSelect">
                <span>Stems: </span> <div className="dropdownContainer">
                                <Dropdown options={stems.map(s => s.toString())} onChange={this.onStemChange} value={this.state.stems.toString()}/>
                        </div>
            </div>
            <div className="splitSelect">
                <div className="halfColumn">
                    <p className='optionHeader'>Isolate:</p>
                    {
                        this.stemsArray.map((option) => {
                            return this.getOption(option, 'isolate')
                        })
                    }
                </div>
                {
                    this.state.stems !== 2 ? (
                        <div className="halfColumn">
                            <p className='optionHeader'>Remove:</p>
                            {
                                this.stemsArray.map((option) => {
                                    return this.getOption(option, 'isolate')
                                })
                            }
                        </div>
                    ) : (<div></div>)
                }
            </div>
        </div>)
    }
}