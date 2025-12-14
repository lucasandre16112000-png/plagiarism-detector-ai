import { useState, useCallback } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload as UploadIcon, FileText, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function Upload() {
  const [, setLocation] = useLocation();
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const uploadMutation = trpc.documents.upload.useMutation({
    onSuccess: (data) => {
      toast.success("Document uploaded successfully!");
      setLocation(`/analyze/${data.documentId}`);
    },
    onError: (error) => {
      toast.error(`Upload failed: ${error.message}`);
      setIsUploading(false);
    },
  });

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      validateAndSetFile(droppedFile);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      validateAndSetFile(selectedFile);
    }
  };

  const validateAndSetFile = (selectedFile: File) => {
    const validTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'text/plain',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/vnd.ms-powerpoint'
    ];

    if (!validTypes.includes(selectedFile.type)) {
      toast.error("Invalid file type. Please upload PDF, DOCX, TXT, or PPT files.");
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB");
      return;
    }

    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64Data = e.target?.result as string;
        const base64Content = base64Data.split(',')[1];

        await uploadMutation.mutateAsync({
          filename: file.name,
          fileType: file.type,
          fileSize: file.size,
          fileData: base64Content,
        });
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Upload error:", error);
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              Upload Document for Analysis
            </h1>
            <p className="text-lg text-gray-600">
              Upload your document to detect plagiarism and AI-generated content
            </p>
          </div>

          <Card className="shadow-xl border-0">
            <CardHeader>
              <CardTitle>Select Document</CardTitle>
              <CardDescription>
                Supported formats: PDF, DOCX, TXT, PPT (Max 10MB)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`
                  border-2 border-dashed rounded-lg p-12 text-center transition-all
                  ${isDragging 
                    ? 'border-indigo-500 bg-indigo-50' 
                    : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50'
                  }
                  ${file ? 'bg-green-50 border-green-400' : ''}
                `}
              >
                {!file ? (
                  <>
                    <UploadIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <p className="text-lg font-medium text-gray-700 mb-2">
                      Drag and drop your file here
                    </p>
                    <p className="text-sm text-gray-500 mb-4">or</p>
                    <label>
                      <input
                        type="file"
                        className="hidden"
                        onChange={handleFileSelect}
                        accept=".pdf,.docx,.doc,.txt,.ppt,.pptx"
                      />
                      <Button variant="outline" asChild>
                        <span className="cursor-pointer">Browse Files</span>
                      </Button>
                    </label>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-green-500" />
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <FileText className="w-5 h-5 text-gray-600" />
                      <p className="text-lg font-medium text-gray-900">{file.name}</p>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      Size: {(file.size / 1024).toFixed(2)} KB
                    </p>
                    <div className="flex gap-3 justify-center">
                      <Button
                        onClick={handleUpload}
                        disabled={isUploading}
                        className="bg-indigo-600 hover:bg-indigo-700"
                      >
                        {isUploading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          "Upload & Analyze"
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setFile(null)}
                        disabled={isUploading}
                      >
                        Remove
                      </Button>
                    </div>
                  </>
                )}
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">What we analyze:</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Plagiarism detection with similarity scoring</li>
                  <li>• AI-generated content identification</li>
                  <li>• Source matching and comparison</li>
                  <li>• Detailed confidence metrics</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
