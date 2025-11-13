import { AppHeader } from "@/components/layout/AppHeader";
import { StepProvider } from "@/components/rpc/form/StepProvider";
import { StepDetails } from "@/components/rpc/form/StepDetails";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRpcFormStore, RpcFormData } from "@/store/rpc-form-store";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { rpcFormSchema, step1Schema, step2Schema } from "@/lib/schemas";
import { useEffect } from "react";
import { toast } from "sonner";
export function AddRpcPage() {
  const currentStep = useRpcFormStore((s) => s.currentStep);
  const formData = useRpcFormStore((s) => s.formData);
  const nextStep = useRpcFormStore((s) => s.nextStep);
  const prevStep = useRpcFormStore((s) => s.prevStep);
  const setFormData = useRpcFormStore((s) => s.setFormData);
  const navigate = useNavigate();
  const methods = useForm<RpcFormData>({
    resolver: zodResolver(rpcFormSchema),
    defaultValues: formData,
    mode: 'onBlur',
  });
  const { trigger, watch } = methods;
  // Sync RHF state back to Zustand store on change
  useEffect(() => {
    const subscription = watch((value) => {
      setFormData(value as RpcFormData);
    });
    return () => subscription.unsubscribe();
  }, [watch, setFormData]);
  const handleNext = async () => {
    const isValid = await trigger(Object.keys(step1Schema.shape));
    if (isValid) {
      nextStep();
    } else {
      toast.error("Please fix the errors before proceeding.");
    }
  };
  const handleReview = async () => {
    const isValid = await trigger();
    if (isValid) {
      navigate('/review');
    } else {
      toast.error("Please fix the errors on this page before proceeding.");
    }
  }
  return (
    <FormProvider {...methods}>
      <div className="flex flex-col min-h-screen bg-muted/40">
        <AppHeader />
        <main className="flex-1">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-8 md:py-10 lg:py-12">
              <div className="space-y-8">
                {/* Stepper UI */}
                <div className="flex justify-center">
                  <div className="flex items-center gap-4 text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <span className={`flex items-center justify-center w-6 h-6 rounded-full text-xs ${currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-border'}`}>1</span>
                      <span className={`${currentStep >= 1 ? 'text-foreground' : 'text-muted-foreground'}`}>Provider</span>
                    </div>
                    <div className="w-16 h-px bg-border" />
                    <div className="flex items-center gap-2">
                      <span className={`flex items-center justify-center w-6 h-6 rounded-full text-xs ${currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-border'}`}>2</span>
                      <span className={`${currentStep >= 2 ? 'text-foreground' : 'text-muted-foreground'}`}>Details</span>
                    </div>
                  </div>
                </div>
                <form onSubmit={(e) => e.preventDefault()}>
                  <div className="animate-fade-in">
                    {currentStep === 1 && <StepProvider />}
                    {currentStep === 2 && <StepDetails />}
                  </div>
                </form>
                {/* Navigation */}
                <div className="flex justify-between items-center pt-4">
                  <Button variant="outline" onClick={prevStep} disabled={currentStep === 1}>
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Previous
                  </Button>
                  {currentStep === 1 ? (
                    <Button onClick={handleNext}>
                      Next <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button onClick={handleReview}>
                      Review & Submit
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </FormProvider>
  );
}