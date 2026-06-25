import { Download, FileText, Image as ImageIcon, X, File as FileIcon } from 'lucide-react';
import type { Attachment } from '../types';
import { downloadAttachmentApi } from '../api/attachments';
import { useAttachmentImage } from '../hooks/useAttachmentImage';
import './AttachmentList.css';

interface AttachmentListProps {
    attachments: Attachment[];
    currentUserId: number;
    currentUserRole: 'admin' | 'agent' | 'user';
    onDelete?: (id: number) => void;
}

function AttachmentList({ attachments, currentUserId, currentUserRole, onDelete }: AttachmentListProps) {
    if (attachments.length === 0) return null;

    return (
        <div className="attachment-display-list">
            {attachments.map(att => (
                <AttachmentItem
                    key={att.id}
                    attachment={att}
                    canDelete={att.user_id === currentUserId || currentUserRole === 'admin'}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
}

// Sub-componente per ogni attachment (così posso usare hook per ognuno)
interface AttachmentItemProps {
    attachment: Attachment;
    canDelete: boolean;
    onDelete?: (id: number) => void;
}

function AttachmentItem({ attachment, canDelete, onDelete }: AttachmentItemProps) {
    const isImage = attachment.mime_type.startsWith('image/');
    const { url, loading, error } = useAttachmentImage(attachment.id, attachment.mime_type);

    const handleDownload = async () => {
        try {
            await downloadAttachmentApi(attachment.id, attachment.original_filename);
        } catch (err) {
            console.error('Errore download:', err);
        }
    };

    const formatSize = (bytes: number): string => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    const getIcon = () => {
        if (attachment.mime_type === 'application/pdf' || attachment.mime_type.includes('document')) {
            return <FileText size={20} />;
        }
        return <FileIcon size={20} />;
    };

    // Render per immagini: preview inline
    if (isImage) {
        return (
            <div className="attachment-display attachment-image">
                {loading && <div className="attachment-image-placeholder"><ImageIcon size={24} /></div>}
                {error && <div className="attachment-image-placeholder attachment-image-error"><ImageIcon size={24} /> Errore caricamento</div>}
                {url && <img src={url} alt={attachment.original_filename} onClick={handleDownload} />}
                <div className="attachment-image-overlay">
                    <span className="attachment-image-name">{attachment.original_filename}</span>
                    <div className="attachment-image-actions">
                        <button type="button" onClick={handleDownload} title="Scarica" className="attachment-action-btn">
                            <Download size={16} />
                        </button>
                        {canDelete && onDelete && (
                            <button type="button" onClick={() => onDelete(attachment.id)} title="Elimina" className="attachment-action-btn attachment-delete-btn">
                                <X size={16} />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // Render per file non-immagine: icona + nome + bottoni
    return (
        <div className="attachment-display attachment-file">
            {getIcon()}
            <div className="attachment-file-info">
                <span className="attachment-file-name">{attachment.original_filename}</span>
                <span className="attachment-file-size">{formatSize(attachment.size)}</span>
            </div>
            <div className="attachment-file-actions">
                <button type="button" onClick={handleDownload} title="Scarica" className="attachment-action-btn">
                    <Download size={16} />
                </button>
                {canDelete && onDelete && (
                    <button type="button" onClick={() => onDelete(attachment.id)} title="Elimina" className="attachment-action-btn attachment-delete-btn">
                        <X size={16} />
                    </button>
                )}
            </div>
        </div>
    );
}

export default AttachmentList;