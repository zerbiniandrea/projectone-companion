import { toast } from '@renderer/components/hooks/use-toast'
import { Input } from '@renderer/components/ui/input'
import { downloadLocalStorageAsJSON } from '@renderer/lib/download-config'
import { handleFileUpload } from '@renderer/lib/upload-config'
import { Download, Trash, Upload } from 'lucide-react'

export default function NextPage(): JSX.Element {
    return (
        <div className="flex flex-col gap-y-8 mt-10 text-2xl ">
            <button
                className="flex items-center gap-2"
                onClick={() => {
                    downloadLocalStorageAsJSON()
                }}
            >
                <Download />
                Download config
            </button>
            <div className="flex flex-col gap-y-2">
                <span className="flex items-center gap-2">
                    <Upload /> Upload config
                </span>
                <Input type="file" accept=".json" onChange={handleFileUpload} />
            </div>
            <button
                className="flex items-center gap-2"
                onClick={() => {
                    window.localStorage.clear()
                    toast({
                        title: 'Config cancellata',
                        description: 'La configurazione è stata cancellata.'
                    })
                }}
            >
                <Trash />
                Delete current config
            </button>
        </div>
    )
}