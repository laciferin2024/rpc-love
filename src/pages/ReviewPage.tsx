import { AppHeader } from "@/components/layout/AppHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { FileText, GitBranch, Github, Loader2 } from "lucide-react";
import { useRpcFormStore } from "@/store/rpc-form-store";
import { useEffect } from "react";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { signInWithGitHub } from "@/lib/github";
export function ReviewPage() {
  const navigate = useNavigate();
  const {
    formData,
    submission,
    auth,
    prepareSubmission,
    setSubmissionDetails,
    submitToGitHub,
  } = useRpcFormStore((s) => ({
    formData: s.formData,
    submission: s.submission,
    auth: s.auth,
    prepareSubmission: s.prepareSubmission,
    setSubmissionDetails: s.setSubmissionDetails,
    submitToGitHub: s.submitToGitHub,
  }));
  useEffect(() => {
    prepareSubmission();
  }, [prepareSubmission]);
  useEffect(() => {
    if (submission.status === 'success') {
      navigate('/success');
    }
    if (submission.status === 'error') {
      toast.error("Submission Failed", { description: submission.error });
    }
  }, [submission.status, submission.error, navigate]);
  const providerChangeText = formData.providerType === 'new' ? '+ 1 new row' : 'No changes';
  const networkChangeText = '+ 1 new or updated row';
  const handleSubmit = () => {
    if (!auth.isAuthenticated) {
      toast.error("Please sign in with GitHub to submit.");
      return;
    }
    toast.info("Submitting to GitHub...", { description: "This may take a moment." });
    submitToGitHub();
  };
  return (
    <div className="flex flex-col min-h-screen bg-muted/40">
      <AppHeader />
      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8 md:py-10 lg:py-12">
            <div className="text-center mb-10">
              <h1 className="text-4xl font-bold font-display">Review Your Submission</h1>
              <p className="text-muted-foreground mt-2">Final check before creating a pull request.</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5" />File Changes</CardTitle>
                    <CardDescription>A summary of the files that will be updated in your fork.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-3 border rounded-md bg-secondary/50">
                      <p className="font-mono text-sm font-medium">providers/rpc.csv</p>
                      <p className={`text-sm ${formData.providerType === 'new' ? 'text-green-600' : 'text-muted-foreground'}`}>{providerChangeText}</p>
                    </div>
                    <div className="p-3 border rounded-md bg-secondary/50">
                      <p className="font-mono text-sm font-medium">networks/filecoin/rpc.csv</p>
                      <p className="text-sm text-green-600">{networkChangeText}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><GitBranch className="h-5 w-5" />Pull Request Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="branch-name">Branch Name</Label>
                      <Input id="branch-name" value={submission.branchName} onChange={(e) => setSubmissionDetails({ branchName: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="commit-message">Commit Message</Label>
                      <Textarea id="commit-message" value={submission.commitMessage} onChange={(e) => setSubmissionDetails({ commitMessage: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pr-title">Pull Request Title</Label>
                      <Input id="pr-title" value={submission.prTitle} onChange={(e) => setSubmissionDetails({ prTitle: e.target.value })} />
                    </div>
                  </CardContent>
                </Card>
                {!auth.isAuthenticated && (
                  <Alert>
                    <Github className="h-4 w-4" />
                    <AlertTitle>Authentication Required</AlertTitle>
                    <AlertDescription>
                      Please <Button variant="link" className="p-0 h-auto" onClick={signInWithGitHub}>sign in with GitHub</Button> to submit your changes.
                    </AlertDescription>
                  </Alert>
                )}
                <Button size="lg" className="w-full" onClick={handleSubmit} disabled={!auth.isAuthenticated || submission.status === 'pending'}>
                  {submission.status === 'pending' ? (
                    <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Submitting...</>
                  ) : (
                    <><Github className="mr-2 h-5 w-5" /> Submit Pull Request</>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}