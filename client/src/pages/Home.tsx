import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { 
  Shield, 
  Brain, 
  Search, 
  TrendingUp, 
  FileText,
  CheckCircle2,
  Zap,
  Lock
} from "lucide-react";
import { useLocation } from "wouter";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  if (isAuthenticated) {
    setLocation("/dashboard");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h1 className="text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Advanced Plagiarism & AI
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              {" "}Detection System
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Protect academic integrity with cutting-edge AI technology. Detect plagiarism, 
            identify AI-generated content, and ensure originality in every document.
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              size="lg"
              className="bg-indigo-600 hover:bg-indigo-700 text-lg px-8 py-6"
              onClick={() => window.location.href = getLoginUrl()}
            >
              Get Started Free
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6"
              onClick={() => {
                document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Learn More
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div id="features" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="shadow-lg border-0 hover:shadow-xl transition-shadow">
            <CardHeader>
              <Shield className="w-12 h-12 text-indigo-600 mb-4" />
              <CardTitle>Plagiarism Detection</CardTitle>
              <CardDescription>
                Advanced algorithms detect copied content from millions of sources
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="shadow-lg border-0 hover:shadow-xl transition-shadow">
            <CardHeader>
              <Brain className="w-12 h-12 text-purple-600 mb-4" />
              <CardTitle>AI Content Detection</CardTitle>
              <CardDescription>
                Identify AI-generated text with high accuracy using LLM analysis
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="shadow-lg border-0 hover:shadow-xl transition-shadow">
            <CardHeader>
              <Search className="w-12 h-12 text-blue-600 mb-4" />
              <CardTitle>Source Matching</CardTitle>
              <CardDescription>
                Find exact sources with similarity scores and detailed comparisons
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="shadow-lg border-0 hover:shadow-xl transition-shadow">
            <CardHeader>
              <TrendingUp className="w-12 h-12 text-green-600 mb-4" />
              <CardTitle>Confidence Metrics</CardTitle>
              <CardDescription>
                Get detailed confidence scores and reliability indicators
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* How It Works */}
        <div className="mb-16">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">1. Upload Document</h3>
              <p className="text-gray-600">
                Upload your PDF, DOCX, TXT, or PPT file for analysis
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">2. AI Analysis</h3>
              <p className="text-gray-600">
                Our advanced AI scans for plagiarism and AI-generated content
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">3. Get Results</h3>
              <p className="text-gray-600">
                Receive detailed reports with sources and confidence scores
              </p>
            </div>
          </div>
        </div>

        {/* Key Features */}
        <Card className="shadow-2xl border-0 mb-16">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl mb-4">Powerful Features</CardTitle>
            <CardDescription className="text-lg">
              Everything you need for comprehensive document analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex gap-4">
                <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Multi-Format Support</h4>
                  <p className="text-gray-600">Analyze PDF, DOCX, TXT, and PPT files seamlessly</p>
                </div>
              </div>

              <div className="flex gap-4">
                <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Real-Time Processing</h4>
                  <p className="text-gray-600">Get results in minutes with our optimized algorithms</p>
                </div>
              </div>

              <div className="flex gap-4">
                <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Detailed Reports</h4>
                  <p className="text-gray-600">Export comprehensive reports with all findings</p>
                </div>
              </div>

              <div className="flex gap-4">
                <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Secure & Private</h4>
                  <p className="text-gray-600">Your documents are encrypted and never shared</p>
                </div>
              </div>

              <div className="flex gap-4">
                <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Source Tracking</h4>
                  <p className="text-gray-600">Identify exact sources with clickable references</p>
                </div>
              </div>

              <div className="flex gap-4">
                <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">History & Analytics</h4>
                  <p className="text-gray-600">Track all analyses with detailed statistics</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <Card className="shadow-2xl border-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <CardContent className="py-16 text-center">
            <Lock className="w-16 h-16 mx-auto mb-6 text-white" />
            <h2 className="text-4xl font-bold mb-4">
              Ready to Ensure Academic Integrity?
            </h2>
            <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
              Join thousands of educators and professionals using our platform to detect plagiarism and AI content.
            </p>
            <Button
              size="lg"
              className="bg-white text-indigo-600 hover:bg-gray-100 text-lg px-8 py-6"
              onClick={() => window.location.href = getLoginUrl()}
            >
              Start Analyzing Now
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-600">
            <p className="mb-2">© 2024 Plagiarism Detector AI. Created by Lucas Andre S</p>
            <p className="text-sm">Advanced AI-powered plagiarism and content detection system</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
