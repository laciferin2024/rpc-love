import { AppHeader } from "@/components/layout/AppHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, ExternalLink, Home, PlusCircle } from "lucide-react";
import { Link } from "react-router-dom";
export function SuccessPage() {
  return (
    <div className="flex flex-col min-h-screen bg-muted/40">
      <AppHeader />
      <main className="flex-1 flex items-center justify-center">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="text-center animate-scale-in">
            <CardHeader>
              <div className="mx-auto bg-green-100 rounded-full p-3 w-fit">
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
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    View Pull Request on GitHub
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
                <Button variant="outline" className="w-full justify-between" asChild>
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    View changes in your fork
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </div>
              <div className="flex gap-4">
                <Button className="flex-1" asChild>
                  <Link to="/add">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Another RPC
                  </Link>
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