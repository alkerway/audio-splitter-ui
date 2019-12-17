export type Stem = 2 | 4 | 5
export type Stem2Option = 'vocals' | 'accompaniment'
export type Stem4Option = 'vocals' | 'drums' | 'bass' | 'other'
export type Stem5Option = Stem4Option | 'piano'

export interface TrackConfig {
    parts: string[]
    trackId: string
}

export interface SpleeterOptions {
    stems: Stem,
    tracks: TrackConfig[]
}
