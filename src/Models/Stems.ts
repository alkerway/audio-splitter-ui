export type Stem = 2 | 4 | 5
export type Stem2Option = 'vocals' | 'accompaniment'
export type Stem4Option = 'vocals' | 'drums' | 'bass' | 'other'
export type Stem5Option = Stem4Option | 'piano'
export type SelectedOptions = Array<Stem extends 2 ? Stem2Option : Stem extends 4 ? Stem4Option : Stem5Option>

export interface SpleeterOptions {
    stems: Stem,
    isolate: SelectedOptions,
    remove: SelectedOptions
}