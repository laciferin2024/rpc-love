import { AppHeader } from "@/components/layout/AppHeader";
import { StepProvider } from "@/components/rpc/form/StepProvider";
import { StepDetails } from "@/components/rpc/form/StepDetails";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
export function AddRpcPage() {
  // Mock step state for now
  const currentStep = 1;
  return (
    <div className="flex flex-col min-h-screen bg-muted/40">
      <AppHeader />
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8 md:py-10 lg:py-12">
            <div className="space-y-8">
              {/* Stepper UI (mock) */}
              <div className="flex justify-center">
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <span className={`flex items-center justify-center w-6 h-6 rounded-full ${currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-border'}`}>1</span>
                    <span className={`${currentStep >= 1 ? 'text-foreground' : 'text-muted-foreground'}`}>Provider</span>
                  </div>
                  <div className="w-16 h-px bg-border" />
                  <div className="flex items-center gap-2">
                    <span className={`flex items-center justify-center w-6 h-6 rounded-full ${currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-border'}`}>2</span>
                    <span className={`${currentStep >= 2 ? 'text-foreground' : 'text-muted-foreground'}`}>Details</span>
                  </div>
                </div>
              </div>
              {/* Form Content */}
              <div className="animate-fade-in">
                {currentStep === 1 && <StepProvider />}
                {currentStep === 2 && <StepDetails />}
              </div>
              {/* Navigation */}
              <div className="flex justify-between items-center">
                <Button variant="outline" disabled={currentStep === 1}>
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Previous
                </Button>
                {currentStep === 1 ? (
                  <Button>
                    Next <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button asChild>
                    <Link to="/review">Review & Submit</Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}