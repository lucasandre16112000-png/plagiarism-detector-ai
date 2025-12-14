import { useEffect, useState } from "react";
import { useRoute, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp, 
  Brain,
  Link as LinkIcon,
  Loader2,
  ArrowLeft
} from "lucide-react";
import { toast } from "sonner";

export default function Analyze() {
  const [, params] = useRoute("/analyze/:id");
  const [, setLocation] = useLocation();
  const documentId = params?.id ? parseInt(params.id) : 0;

  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const { data: document } = trpc.documents.get.useQuery({ id: documentId });
  const { data: analysis, refetch: refetchAnalysis } = trpc.analysis.getByDocument.useQuery(
    { documentId },
    { enabled: !!documentId }
  );

  const createAnalysisMutation = trpc.analysis.create.useMutation({
    onSuccess: () => {
      toast.success("Analysis completed!");
      refetchAnalysis();
      setIsAnalyzing(false);
    },
    onError: (error) => {
      toast.error(`Analysis failed: ${error.message}`);
      setIsAnalyzing(false);
    },
  });

  const handleStartAnalysis = () => {
    setIsAnalyzing(true);
    createAnalysisMutation.mutate({ documentId });
  };

  const getPlagiarismColor = (percentage: number) => {
    if (percentage < 15) return "text-green-600";
    if (percentage < 40) return "text-yellow-600";
    return "text-red-600";
  };

  const getAIColor = (percentage: number) => {
    if (percentage < 20) return "text-green-600";
    if (percentage < 50) return "text-yellow-600";
    return "text-red-600";
  };

  if (!document) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => setLocation("/dashboard")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="max-w-7xl mx-auto">
          {/* Document Info */}
          <Card className="mb-6 shadow-lg border-0">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <FileText className="w-6 h-6 text-indigo-600" />
                    {document.originalFilename}
                  </CardTitle>
                  <CardDescription className="mt-2">
                    Uploaded on {new Date(document.createdAt).toLocaleDateString()}
                  </CardDescription>
                </div>
                {!analysis && (
                  <Button
                    onClick={handleStartAnalysis}
                    disabled={isAnalyzing}
                    className="bg-indigo-600 hover:bg-indigo-700"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      "Start Analysis"
                    )}
                  </Button>
                )}
              </div>
            </CardHeader>
          </Card>

          {analysis && analysis.status === "completed" && (
            <>
              {/* Main Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <Card className="shadow-lg border-0 bg-gradient-to-br from-red-50 to-white">
                  <CardHeader>
                    <CardTitle className="text-sm font-medium text-gray-600">
                      Plagiarism Detected
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className={`text-4xl font-bold ${getPlagiarismColor(analysis.plagiarismPercentage)}`}>
                      {analysis.plagiarismPercentage.toFixed(1)}%
                    </div>
                    <Progress 
                      value={analysis.plagiarismPercentage} 
                      className="mt-4"
                    />
                    <p className="text-sm text-gray-600 mt-2">
                      {analysis.totalSources} sources found
                    </p>
                  </CardContent>
                </Card>

                <Card className="shadow-lg border-0 bg-gradient-to-br from-purple-50 to-white">
                  <CardHeader>
                    <CardTitle className="text-sm font-medium text-gray-600">
                      AI Content Detected
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className={`text-4xl font-bold ${getAIColor(analysis.aiContentPercentage)}`}>
                      {analysis.aiContentPercentage.toFixed(1)}%
                    </div>
                    <Progress 
                      value={analysis.aiContentPercentage} 
                      className="mt-4"
                    />
                    <div className="flex items-center gap-2 mt-2">
                      <Brain className="w-4 h-4 text-purple-600" />
                      <p className="text-sm text-gray-600">
                        AI-generated segments detected
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-white">
                  <CardHeader>
                    <CardTitle className="text-sm font-medium text-gray-600">
                      Confidence Score
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold text-blue-600">
                      {analysis.confidenceScore.toFixed(1)}%
                    </div>
                    <Progress 
                      value={analysis.confidenceScore} 
                      className="mt-4"
                    />
                    <div className="flex items-center gap-2 mt-2">
                      <TrendingUp className="w-4 h-4 text-blue-600" />
                      <p className="text-sm text-gray-600">
                        Analysis reliability
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Detailed Results */}
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle>Detailed Analysis Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="plagiarism" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="plagiarism">
                        Plagiarism Sources ({analysis.sources?.length || 0})
                      </TabsTrigger>
                      <TabsTrigger value="ai">
                        AI Detection ({analysis.aiResults?.length || 0})
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="plagiarism" className="space-y-4 mt-4">
                      {analysis.sources && analysis.sources.length > 0 ? (
                        analysis.sources.map((source, index) => (
                          <Card key={index} className="border border-gray-200">
                            <CardHeader>
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <CardTitle className="text-base flex items-center gap-2">
                                    <LinkIcon className="w-4 h-4" />
                                    {source.sourceTitle || "Unknown Source"}
                                  </CardTitle>
                                  <CardDescription className="mt-1">
                                    Type: {source.sourceType}
                                  </CardDescription>
                                </div>
                                <Badge variant={source.similarityScore > 0.7 ? "destructive" : "secondary"}>
                                  {(source.similarityScore * 100).toFixed(1)}% similar
                                </Badge>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-2">
                                <div>
                                  <p className="text-sm font-medium text-gray-700">Matched Text:</p>
                                  <p className="text-sm text-gray-600 bg-red-50 p-2 rounded mt-1">
                                    {source.matchedText}
                                  </p>
                                </div>
                                {source.sourceUrl && (
                                  <a 
                                    href={source.sourceUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-sm text-indigo-600 hover:underline"
                                  >
                                    View Source →
                                  </a>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
                          <p className="text-gray-600">No plagiarism sources detected</p>
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="ai" className="space-y-4 mt-4">
                      {analysis.aiResults && analysis.aiResults.length > 0 ? (
                        analysis.aiResults.map((result, index) => (
                          <Card key={index} className="border border-gray-200">
                            <CardHeader>
                              <div className="flex items-start justify-between">
                                <CardTitle className="text-base flex items-center gap-2">
                                  <Brain className="w-4 h-4" />
                                  Segment {index + 1}
                                </CardTitle>
                                <Badge 
                                  variant={result.aiProbability > 0.7 ? "destructive" : "secondary"}
                                >
                                  {(result.aiProbability * 100).toFixed(1)}% AI probability
                                </Badge>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-2">
                                <div>
                                  <p className="text-sm font-medium text-gray-700">Text Segment:</p>
                                  <p className="text-sm text-gray-600 bg-purple-50 p-2 rounded mt-1">
                                    {result.textSegment}
                                  </p>
                                </div>
                                <p className="text-xs text-gray-500">
                                  Detection Method: {result.detectionMethod}
                                </p>
                              </div>
                            </CardContent>
                          </Card>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
                          <p className="text-gray-600">No AI-generated content detected</p>
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </>
          )}

          {isAnalyzing && (
            <Card className="shadow-lg border-0">
              <CardContent className="py-12">
                <div className="text-center">
                  <Loader2 className="w-16 h-16 animate-spin text-indigo-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Analyzing Document...
                  </h3>
                  <p className="text-gray-600">
                    This may take a few moments. We're running advanced algorithms to detect plagiarism and AI content.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
