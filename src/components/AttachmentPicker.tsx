import { useRef, useState } from 'react';
import { Upload, X, Image, FileText, File as FileIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import './AttachmentPicker.css';

interface AttachmentPickerProps {
    files: File[];
    onChange: (files: File[]) => void;
    maxFiles?: number;
    maxSizeMB?: number;
    accept?: string;
}

const DEFAULT_ACCEPT = 'image/jpeg,image/png,image/webp,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.oasis.opendocument.text,text/plain';

function AttachmentPicker({
    files,
    onChange,
    maxFiles = 5,
    maxSizeMB = 5,
    accept = DEFAULT_ACCEPT,
}: AttachmentPickerProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    const maxSizeBytes = maxSizeMB * 1024 * 1024;

    // Filtra e valida i file in arrivo, mostra toast su scarti
    const handleNewFiles = (incoming: FileList | File[]) => {
        const incomingArray = Array.from(incoming);
        const accepted: File[] = [];

        for (const file of incomingArray) {
            // Limite per dimensione
            if (file.size > maxSizeBytes) {
                toast.error(`${file.name} supera ${maxSizeMB} MB`);
                continue;
            }
            // Limite totale file (considerando quelli già presenti)
            if (files.length + accepted.length >= maxFiles) {
                toast.error(`Massimo ${maxFiles} file`);
                break;
            }
            accepted.push(file);
        }

        if (accepted.length > 0) {
            onChange([...files, ...accepted]);
        }
    };

    // Click su zona apre dialog
    const handleZoneClick = () => {
        inputRef.current?.click();
    };

    // Selezione tramite dialog
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            handleNewFiles(e.target.files);
            // Reset input per consentire selezione dello stesso file
            e.target.value = '';
        }
    };

    // Drag handlers
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files) {
            handleNewFiles(e.dataTransfer.files);
        }
    };

    // Rimuove un file dalla lista
    const removeFile = (index: number) => {
        onChange(files.filter((_, i) => i !== index));
    };

    // Icona in base al mime type
    const getIcon = (file: File) => {
        if (file.type.startsWith('image/')) return <Image size={18} />;
        if (file.type === 'application/pdf' || file.type.includes('document')) return <FileText size={18} />;
        return <FileIcon size={18} />;
    };

    // Formatta dimensione
    const formatSize = (bytes: number): string => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    return (
        <div className="attachment-picker">
            {/* Zona drop / click */}
            <div
                className={`attachment-zone ${isDragging ? 'is-dragging' : ''}`}
                onClick={handleZoneClick}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <Upload size={24} />
                <p>
                    Trascina qui i file o <span>scegli dal disco</span>
                </p>
                <small>
                    Massimo {maxFiles} file, {maxSizeMB} MB ciascuno
                </small>
            </div>

            {/* Input nascosto */}
            <input
                ref={inputRef}
                type="file"
                multiple
                accept={accept}
                onChange={handleInputChange}
                hidden
            />

            {/* Lista file selezionati */}
            {files.length > 0 && (
                <ul className="attachment-list">
                    {files.map((file, index) => (
                        <li key={index} className="attachment-item">
                            {getIcon(file)}
                            <div className="attachment-info">
                                <span className="attachment-name">{file.name}</span>
                                <span className="attachment-size">{formatSize(file.size)}</span>
                            </div>
                            <button
                                type="button"
                                className="attachment-remove"
                                onClick={() => removeFile(index)}
                                aria-label={`Rimuovi ${file.name}`}
                            >
                                <X size={16} />
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default AttachmentPicker;