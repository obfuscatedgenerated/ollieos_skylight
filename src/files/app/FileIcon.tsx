import {FileTerminal, File, FileBraces, FileText, FileImage} from "lucide-react";

export const FileIcon = ({file, className = ""}: {file: string, className?: string}) => {
    const file_extension = file.split(".").pop()?.toLowerCase() || "";

    switch (file_extension) {
        case "js":
            return <FileTerminal className={className} />;
        case "json":
            return <FileBraces className={className} />;
        case "txt":
            return <FileText className={className} />;
        case "jpg":
        case "jpeg":
        case "png":
        case "gif":
        case "bmp":
        case "webp":
            return <FileImage className={className} />;
        default:
            return <File className={className} />;
    }
}
