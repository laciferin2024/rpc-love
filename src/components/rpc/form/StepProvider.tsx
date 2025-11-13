import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";
import { useRpcFormStore } from "@/store/rpc-form-store";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
export function StepProvider() {
  const { control, watch } = useFormContext();
  const providers = useRpcFormStore((s) => s.providers);
  const providerType = watch('providerType');
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Step 1: Provider Information</CardTitle>
        <CardDescription>
          Choose an existing RPC provider or create a new one.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <FormField
          control={control}
          name="providerType"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-2"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="existing" id="r-existing" />
                    </FormControl>
                    <FormLabel htmlFor="r-existing" className="font-normal cursor-pointer">
                      Use an existing provider
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="new" id="r-new" />
                    </FormControl>
                    <FormLabel htmlFor="r-new" className="font-normal cursor-pointer">
                      Create a new provider
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {providerType === 'existing' && (
          <div className="space-y-4 animate-fade-in">
            <FormField
              control={control}
              name="existingProviderSlug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Provider</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Search for a provider..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {providers.map((p) => (
                        <SelectItem key={p.slug} value={p.slug}>
                          {p.provider} ({p.slug})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}
        {providerType === 'new' && (
          <div className="space-y-4 animate-fade-in">
            <h3 className="font-semibold text-foreground">New Provider Details</h3>
            <FormField
              control={control}
              name="newProvider.name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Provider Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Awesome RPC" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="newProvider.slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Provider Slug</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., awesome-rpc" {...field} />
                  </FormControl>
                  <p className="text-xs text-muted-foreground pt-1">
                    A unique identifier (lowercase, alphanumeric, hyphens).
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}