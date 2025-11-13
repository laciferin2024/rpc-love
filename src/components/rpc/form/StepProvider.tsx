import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
export function StepProvider() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Step 1: Provider Information</CardTitle>
        <CardDescription>
          Choose an existing RPC provider or create a new one.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <RadioGroup defaultValue="existing" className="space-y-2">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="existing" id="r-existing" />
            <Label htmlFor="r-existing">Use an existing provider</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="new" id="r-new" />
            <Label htmlFor="r-new">Create a new provider</Label>
          </div>
        </RadioGroup>
        <div className="space-y-4 animate-fade-in">
          <Label htmlFor="provider-select">Select Provider</Label>
          <Select>
            <SelectTrigger id="provider-select">
              <SelectValue placeholder="Search for a provider..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ankr">Ankr</SelectItem>
              <SelectItem value="infura">Infura</SelectItem>
              <SelectItem value="alchemy">Alchemy</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {/* This part would be shown conditionally based on radio selection */}
        <div className="space-y-4 hidden animate-fade-in">
          <h3 className="font-semibold text-foreground">New Provider Details</h3>
          <div className="space-y-2">
            <Label htmlFor="new-provider-name">Provider Name</Label>
            <Input id="new-provider-name" placeholder="e.g., Awesome RPC" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-provider-slug">Provider Slug</Label>
            <Input id="new-provider-slug" placeholder="e.g., awesome-rpc" />
            <p className="text-xs text-muted-foreground">
              A unique identifier (alphanumeric, hyphens, underscores).
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}