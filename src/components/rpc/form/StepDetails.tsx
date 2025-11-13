import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useFormContext, useFieldArray } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useState } from "react";
export function StepDetails() {
  const { control, watch, setValue, formState: { errors } } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "network.actionButtons",
  });
  const [apiInput, setApiInput] = useState('');
  const availableApis = watch('network.availableApis', []);
  const handleAddApi = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && apiInput.trim() !== '') {
      e.preventDefault();
      const newApi = apiInput.trim();
      if (!availableApis.includes(newApi)) {
        setValue('network.availableApis', [...availableApis, newApi], { shouldValidate: true });
      }
      setApiInput('');
    }
  };
  const handleRemoveApi = (apiToRemove: string) => {
    setValue('network.availableApis', availableApis.filter((api: string) => api !== apiToRemove), { shouldValidate: true });
  };
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Step 2: Network RPC Details</CardTitle>
        <CardDescription>
          Provide the specific details for this RPC offering on the Filecoin network.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField control={control} name="network.slug" render={({ field }) => (<FormItem><FormLabel>Offering Slug</FormLabel><FormControl><Input placeholder="e.g., awesome-rpc-free" {...field} /></FormControl><FormMessage /></FormItem>)} />
          <FormField control={control} name="network.plan" render={({ field }) => (<FormItem><FormLabel>Plan</FormLabel><FormControl><Input placeholder="e.g., Free, Pay-as-you-go" {...field} /></FormControl><FormMessage /></FormItem>)} />
          <FormField control={control} name="network.nodeType" render={({ field }) => (<FormItem><FormLabel>Node Type</FormLabel><FormControl><Input placeholder="e.g., Recent-State, Archive" {...field} /></FormControl><FormMessage /></FormItem>)} />
          <FormField control={control} name="network.chain" render={({ field }) => (<FormItem><FormLabel>Chain</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="mainnet">Mainnet</SelectItem><SelectItem value="calibnet">Calibnet</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
          <FormField control={control} name="network.accessPrice" render={({ field }) => (<FormItem><FormLabel>Access Price (optional)</FormLabel><FormControl><Input placeholder="e.g., $0/month" {...field} /></FormControl><FormMessage /></FormItem>)} />
          <FormField control={control} name="network.queryPrice" render={({ field }) => (<FormItem><FormLabel>Query Price (optional)</FormLabel><FormControl><Input placeholder="e.g., $0.01/1k queries" {...field} /></FormControl><FormMessage /></FormItem>)} />
        </div>
        <FormField
          control={control}
          name="network.availableApis"
          render={() => (
            <FormItem>
              <FormLabel>Available APIs</FormLabel>
              <FormControl>
                <>
                  <div className="p-2 border rounded-md min-h-[40px] flex flex-wrap gap-2">
                    {availableApis.length === 0 && <p className="text-sm text-muted-foreground px-2">Enter an API below and press Enter.</p>}
                    {availableApis.map((api: string) => (
                      <Badge key={api} variant="secondary" className="flex items-center gap-1">
                        {api}
                        <button type="button" onClick={() => handleRemoveApi(api)} className="rounded-full hover:bg-muted-foreground/20 p-0.5">
                          <X className="h-3 w-3" />
                          <span className="sr-only">Remove {api}</span>
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <Input 
                    placeholder="Type an API and press Enter..." 
                    value={apiInput}
                    onChange={(e) => setApiInput(e.target.value)}
                    onKeyDown={handleAddApi}
                  />
                </>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="space-y-4">
          <Label>Action Buttons (optional)</Label>
          {fields.map((item, index) => (
            <div key={item.id} className="flex items-end gap-4 p-4 border rounded-md bg-muted/50">
              <FormField control={control} name={`network.actionButtons.${index}.label`} render={({ field }) => (<FormItem className="flex-1 space-y-1"><FormLabel className="text-xs">Label</FormLabel><FormControl><Input placeholder="Sign Up" {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={control} name={`network.actionButtons.${index}.url`} render={({ field }) => (<FormItem className="flex-1 space-y-1"><FormLabel className="text-xs">URL</FormLabel><FormControl><Input placeholder="https://example.com/signup" {...field} /></FormControl><FormMessage /></FormItem>)} />
              <Button type="button" variant="outline" size="icon" className="shrink-0" onClick={() => remove(index)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button type="button" variant="outline" size="sm" onClick={() => append({ label: '', url: '' })}>
            <Plus className="mr-2 h-4 w-4" /> Add Button
          </Button>
        </div>
        <div className="flex items-center space-x-4 pt-2">
          <FormField control={control} name="network.isTrial" render={({ field }) => (<FormItem className="flex items-center space-x-2"><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel>Trial Available</FormLabel></FormItem>)} />
          <FormField control={control} name="network.isStarred" render={({ field }) => (<FormItem className="flex items-center space-x-2"><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel>Starred Offering</FormLabel></FormItem>)} />
        </div>
      </CardContent>
    </Card>
  );
}