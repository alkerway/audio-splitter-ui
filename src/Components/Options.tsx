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
    sendState: (options: SpleeterOptions) => void;
}
export class Options extends React.Component<OptionsProps, SpleeterOptions> {
    constructor(props: OptionsProps) {
        super(props);
        this.state = {
            stems: 2,
            isolate: new Set([]),
            remove: new Set([])
        }
        this.sendState()
    }

    sendState = () => {
        this.props.sendState(this.state)
    }

    onStemChange = (arg: any) => {
        const {value} = arg
        const newStems = Number(value) as Stem
        const newOptions = newStems === 2 ? Stem2Options : newStems  === 4? Stem4Options : Stem5Options
        this.setState({
            ...this.state,
            stems: newStems
        })
        if (this.state.isolate.size) {
            this.state.isolate.forEach((option) => {
              if (newOptions.indexOf(option as any) === -1) {
                  this.state.isolate.delete(option)
              }
            })
        }
        if (this.state.remove.size) {
            this.state.remove.forEach((option) => {
                if (newOptions.indexOf(option as any) === -1 || newStems === 2) {
                    this.state.remove.delete(option)
                }
            })
        }
        this.sendState()

    }
    get stemOptionsSet(): string[] {
        if (this.state.stems === 2) {
            return Stem2Options
        } else if (this.state.stems === 4) {
            return Stem4Options
        } else {
            return Stem5Options
        }
    }

    onChecked = (option: any, optionType: 'isolate' | 'remove') => {
        console.log(`checked ${option} ${optionType}`)
        if (optionType === 'isolate') {
            const currentIsolate = this.state.isolate
            currentIsolate.has(option) ?
                currentIsolate.delete(option) :
                currentIsolate.add(option)
            this.setState({
                ...this.state,
                isolate: currentIsolate
            })
        } else {
            const currentRemove = this.state.remove
            currentRemove.has(option) ?
                currentRemove.delete(option) :
                currentRemove.add(option)
            this.setState({
                ...this.state,
                remove: currentRemove
            })
        }
        this.sendState()
    }

    getOption = (option: string, optionType: 'isolate' | 'remove') => {
        return (
            <div key={`${optionType}${option}`} className={`${optionType} optionRow`}>
                <input type="checkbox" name={`${optionType}${option}`} checked={this.state[optionType].has(option as any)}
                       onChange={e => this.onChecked(option, optionType)}/>
                <label htmlFor={`${optionType}${option}`}>{option}</label>
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
                        this.stemOptionsSet.map((option) => {
                            return this.getOption(option, 'isolate')
                        })
                    }
                </div>
                {
                    this.state.stems !== 2 ? (
                        <div className="halfColumn">
                            <p className='optionHeader'>Remove:</p>
                            {
                                this.stemOptionsSet.map((option) => {
                                    return this.getOption(option, 'remove')
                                })
                            }
                        </div>
                    ) : (<div></div>)
                }
            </div>
        </div>)
    }
}