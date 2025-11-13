import { AppHeader } from "@/components/layout/AppHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { FileText, GitBranch, MessageSquare, Github } from "lucide-react";
export function ReviewPage() {
  return (
    <div className="flex flex-col min-h-screen bg-muted/40">
      <AppHeader />
      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8 md:py-10 lg:py-12">
            <div className="text-center mb-10">
              <h1 className="text-4xl font-bold font-display">Review Your Submission</h1>
              <p className="text-muted-foreground mt-2">
                Final check before creating a pull request.
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      File Changes
                    </CardTitle>
                    <CardDescription>
                      Here's a summary of the files that will be updated in your fork.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-3 border rounded-md bg-secondary/50">
                      <p className="font-mono text-sm font-medium">providers/rpc.csv</p>
                      <p className="text-sm text-green-600">+ 1 new row</p>
                    </div>
                    <div className="p-3 border rounded-md bg-secondary/50">
                      <p className="font-mono text-sm font-medium">networks/filecoin/rpc.csv</p>
                      <p className="text-sm text-green-600">+ 1 new row</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <GitBranch className="h-5 w-5" />
                      Pull Request Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="branch-name">Branch Name</Label>
                      <Input id="branch-name" defaultValue="cl-rpc-awesome-rpc-free-1678886400" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="commit-message">Commit Message</Label>
                      <Textarea id="commit-message" defaultValue="feat: add awesome-rpc-free to filecoin network" />
                    </div>
                  </CardContent>
                </Card>
                <Button size="lg" className="w-full" asChild>
                  <Link to="/success">
                    <Github className="mr-2 h-5 w-5" />
                    Submit Pull Request
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}