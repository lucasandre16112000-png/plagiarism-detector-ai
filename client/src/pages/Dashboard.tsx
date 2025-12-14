import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  FileText, 
  Upload, 
  TrendingUp, 
  Brain,
  AlertTriangle,
  CheckCircle2,
  Clock
} from "lucide-react";
import { useLocation } from "wouter";

export default function Dashboard() {
  const { user } = useAuth();
  const displayName = user?.name || "User";
  const [, setLocation] = useLocation();

  const { data: stats } = trpc.dashboard.stats.useQuery();
  const { data: documents } = trpc.documents.list.useQuery();
  const { data: analyses } = trpc.analysis.list.useQuery();

  const recentAnalyses = analyses?.slice(0, 5) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome back, {displayName}
          </h1>
          <p className="text-lg text-gray-600">
            Advanced plagiarism and AI content detection platform
          </p>
        </div>

        {/* Quick Action */}
        <Card className="mb-8 shadow-xl border-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <CardHeader>
            <CardTitle className="text-2xl text-white">Start New Analysis</CardTitle>
            <CardDescription className="text-indigo-100">
              Upload a document to detect plagiarism and AI-generated content
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => setLocation("/upload")}
              size="lg"
              className="bg-white text-indigo-600 hover:bg-gray-100"
            >
              <Upload className="w-5 h-5 mr-2" />
              Upload Document
            </Button>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-lg border-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-gray-900">
                  {stats?.totalDocuments || 0}
                </div>
                <FileText className="w-8 h-8 text-indigo-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Completed Analyses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-gray-900">
                  {stats?.completedAnalyses || 0}
                </div>
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Avg Plagiarism
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-red-600">
                  {stats?.avgPlagiarismPercentage.toFixed(1) || 0}%
                </div>
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Avg AI Content
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-purple-600">
                  {stats?.avgAIPercentage.toFixed(1) || 0}%
                </div>
                <Brain className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Analyses */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-xl">Recent Analyses</CardTitle>
            <CardDescription>Your latest document analyses</CardDescription>
          </CardHeader>
          <CardContent>
            {recentAnalyses.length > 0 ? (
              <div className="space-y-4">
                {recentAnalyses.map((analysis) => {
                  const document = documents?.find(d => d.id === analysis.documentId);
                  return (
                    <div
                      key={analysis.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => setLocation(`/analyze/${analysis.documentId}`)}
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <FileText className="w-10 h-10 text-indigo-600" />
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">
                            {document?.originalFilename || "Unknown Document"}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Clock className="w-3 h-3 text-gray-400" />
                            <p className="text-sm text-gray-500">
                              {new Date(analysis.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <p className="text-xs text-gray-500 mb-1">Plagiarism</p>
                          <p className="text-lg font-bold text-red-600">
                            {analysis.plagiarismPercentage.toFixed(1)}%
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-500 mb-1">AI Content</p>
                          <p className="text-lg font-bold text-purple-600">
                            {analysis.aiContentPercentage.toFixed(1)}%
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-500 mb-1">Confidence</p>
                          <p className="text-lg font-bold text-blue-600">
                            {analysis.confidenceScore.toFixed(1)}%
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No analyses yet
                </h3>
                <p className="text-gray-600 mb-4">
                  Upload your first document to get started
                </p>
                <Button
                  onClick={() => setLocation("/upload")}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Document
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
