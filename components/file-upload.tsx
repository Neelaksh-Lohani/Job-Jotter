'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion } from 'framer-motion'
import { Upload, FileText, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FileUploadProps {
  onFileUpload: (file: File) => void
  isProcessing: boolean
  acceptedTypes: string[]
}

export function FileUpload({ onFileUpload, isProcessing, acceptedTypes }: FileUploadProps) {
  const [error, setError] = useState<string | null>(null)

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    setError(null)
    
    if (rejectedFiles.length > 0) {
      setError('Please upload a PDF or DOCX file')
      return
    }

    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0]
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        setError('File size must be less than 10MB')
        return
      }
      onFileUpload(file)
    }
  }, [onFileUpload])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc']
    },
    multiple: false,
    disabled: isProcessing
  })

  return (
    <div className="space-y-4">
      <motion.div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200",
          isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50",
          isProcessing && "opacity-50 cursor-not-allowed"
        )}
        whileHover={!isProcessing ? { scale: 1.02 } : {}}
        whileTap={!isProcessing ? { scale: 0.98 } : {}}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center space-y-4">
          {isProcessing ? (
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          ) : (
            <Upload className="w-12 h-12 text-muted-foreground" />
          )}
          
          <div>
            <p className="text-lg font-medium">
              {isProcessing ? 'Processing...' : 
               isDragActive ? 'Drop your resume here' : 'Upload your resume'}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {isProcessing ? 'Extracting text from your resume' :
               `Supports ${acceptedTypes.join(', ')} files up to 10MB`}
            </p>
          </div>
          
          {!isProcessing && (
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <FileText className="w-4 h-4" />
              <span>Click to browse or drag and drop</span>
            </div>
          )}
        </div>
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center space-x-2 text-sm text-destructive"
        >
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </motion.div>
      )}
    </div>
  )
}
