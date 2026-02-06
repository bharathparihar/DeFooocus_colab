import { useRef, useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ImageUploadProps {
    value?: string;
    onChange: (base64: string) => void;
    onRemove?: () => void;
    maxSizeMB?: number;
    aspectRatio?: string;
    label?: string;
}

export function ImageUpload({
    value,
    onChange,
    onRemove,
    maxSizeMB = 2,
    aspectRatio,
    label = 'Upload Image',
}: ImageUploadProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleFileSelect = async (file: File) => {
        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast.error('Please select an image file');
            return;
        }

        // Validate file size
        const sizeMB = file.size / (1024 * 1024);
        if (sizeMB > maxSizeMB) {
            toast.error(`Image size must be less than ${maxSizeMB}MB`);
            return;
        }

        // Convert to Base64
        const reader = new FileReader();
        reader.onload = (e) => {
            const base64 = e.target?.result as string;
            onChange(base64);
            toast.success('Image uploaded');
        };
        reader.onerror = () => {
            toast.error('Failed to read image');
        };
        reader.readAsDataURL(file);
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleRemove = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onRemove) {
            onRemove();
        } else {
            onChange('');
        }
        toast.success('Image removed');
    };

    return (
        <div className="w-full">
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                        handleFileSelect(file);
                    }
                }}
            />

            {value ? (
                <div className="relative group">
                    <div
                        className="relative overflow-hidden rounded-lg border-2 border-border bg-secondary"
                        style={aspectRatio ? { aspectRatio } : undefined}
                    >
                        <img
                            src={value}
                            alt="Upload preview"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <Button
                                type="button"
                                variant="secondary"
                                size="sm"
                                onClick={handleClick}
                            >
                                <Upload className="w-4 h-4 mr-2" />
                                Change
                            </Button>
                            <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={handleRemove}
                            >
                                <X className="w-4 h-4 mr-2" />
                                Remove
                            </Button>
                        </div>
                    </div>
                </div>
            ) : (
                <div
                    onClick={handleClick}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    className={`
            relative overflow-hidden rounded-lg border-2 border-dashed cursor-pointer
            transition-colors
            ${isDragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}
          `}
                    style={aspectRatio ? { aspectRatio } : { minHeight: '200px' }}
                >
                    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                        <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mb-3">
                            <ImageIcon className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <p className="text-sm font-medium text-foreground mb-1">{label}</p>
                        <p className="text-xs text-muted-foreground mb-3">
                            Drag and drop or click to browse
                        </p>
                        <p className="text-xs text-muted-foreground">
                            Max size: {maxSizeMB}MB • JPG, PNG, WEBP
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
