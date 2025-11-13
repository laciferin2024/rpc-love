import { AppHeader } from "@/components/layout/AppHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, ExternalLink, Home, PlusCircle, AlertTriangle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useRpcFormStore } from "@/store/rpc-form-store";
import { useEffect } from "react";
export function SuccessPage() {
  const navigate = useNavigate();
  // Use individual selectors to avoid creating new object references on each render
  const submission = useRpcFormStore((s) => s.submission);
  const auth = useRpcFormStore((s) => s.auth);
  const reset = useRpcFormStore((s) => s.reset);
  const { prUrl, branchName } = submission;
  const user = auth.user;
  useEffect(() => {
    // Redirect if the user lands here without a successful submission
    if (submission.status !== 'success' || !prUrl) {
      navigate('/');
    }
  }, [submission.status, prUrl, navigate]);
  const handleAddAnother = () => {
    reset();
    navigate('/add');
  };
  const forkUrl = user ? `https://github.com/${user.login}/chain-love/tree/${branchName}` : '#';
  if (submission.status !== 'success' || !prUrl) {
    return (
      <div className="flex flex-col min-h-screen bg-muted/40">
        <AppHeader />
        <main className="flex-1 flex items-center justify-center">
          <Card className="text-center animate-scale-in p-8">
            <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <CardTitle>No submission data found.</CardTitle>
            <CardDescription>Redirecting to homepage...</CardDescription>
          </Card>
        </main>
      </div>
    );
  }
  return (
    <div className="flex flex-col min-h-screen bg-muted/40">
      <AppHeader />
      <main className="flex-1 flex items-center justify-center">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="text-center animate-scale-in">
            <CardHeader>
              <div className="mx-auto bg-green-100 dark:bg-green-900/50 rounded-full p-3 w-fit">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <CardTitle className="text-3xl font-bold font-display mt-4">Submission Successful!</CardTitle>
              <CardDescription className="text-lg text-muted-foreground">
                Your changes have been committed and a pull request has been opened.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-between" asChild>
                  <a href={prUrl} target="_blank" rel="noopener noreferrer">
                    View Pull Request on GitHub
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
                <Button variant="outline" className="w-full justify-between" asChild>
                  <a href={forkUrl} target="_blank" rel="noopener noreferrer">
                    View changes in your fork
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="flex-1" onClick={handleAddAnother}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Another RPC
                </Button>
                <Button variant="secondary" className="flex-1" asChild>
                  <Link to="/">
                    <Home className="mr-2 h-4 w-4" />
                    Back to Home
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}