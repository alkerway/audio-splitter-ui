import * as React from 'react';
export interface FileInputState {}

export interface FileInputProps {
    onFileAdded: (file: File)=> void
}
export class FileInput extends React.Component<FileInputProps, FileInputState> {
    onFileAdded = (fileList: FileList | null) => {
        if (fileList) {
            this.props.onFileAdded(fileList[0])
        }
    }
    render() {
        return (
            <div className="fileInputWrapper">
                <input
                    id="file-input"
                    type="file"
                    name="fileInput"
                    accept="audio/*"
                    onChange={(e) => this.onFileAdded(e.target.files)}/>
            </div>
        )
    }
}
