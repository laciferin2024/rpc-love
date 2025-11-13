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
import { Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
export function StepDetails() {
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
          <div className="space-y-2">
            <Label htmlFor="rpc-slug">Offering Slug</Label>
            <Input id="rpc-slug" placeholder="e.g., awesome-rpc-free" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="rpc-plan">Plan</Label>
            <Input id="rpc-plan" placeholder="e.g., Free, Pay-as-you-go" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="node-type">Node Type</Label>
            <Input id="node-type" placeholder="e.g., Recent-State, Archive" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="chain">Chain</Label>
            <Select defaultValue="mainnet">
              <SelectTrigger id="chain">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mainnet">Mainnet</SelectItem>
                <SelectItem value="calibnet">Calibnet</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="access-price">Access Price</Label>
            <Input id="access-price" placeholder="e.g., $0/month" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="query-price">Query Price</Label>
            <Input id="query-price" placeholder="e.g., $0.01/1k queries" />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Available APIs</Label>
          <div className="p-2 border rounded-md min-h-[40px] flex flex-wrap gap-2">
            <Badge variant="secondary">eth_call</Badge>
            <Badge variant="secondary">eth_blockNumber</Badge>
            {/* Input for new tags would go here */}
          </div>
          <Input placeholder="Type an API and press Enter..." />
        </div>
        <div className="space-y-4">
          <Label>Action Buttons</Label>
          <div className="space-y-4">
            <div className="flex items-end gap-4 p-4 border rounded-md">
              <div className="flex-1 space-y-2">
                <Label htmlFor="btn-label-1" className="text-xs">Label</Label>
                <Input id="btn-label-1" placeholder="Sign Up" />
              </div>
              <div className="flex-1 space-y-2">
                <Label htmlFor="btn-url-1" className="text-xs">URL</Label>
                <Input id="btn-url-1" placeholder="https://example.com/signup" />
              </div>
              <Button variant="outline" size="icon" className="shrink-0">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <Button variant="outline" size="sm">
            <Plus className="mr-2 h-4 w-4" /> Add Button
          </Button>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Switch id="trial-flag" />
            <Label htmlFor="trial-flag">Trial Available</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="starred-flag" />
            <Label htmlFor="starred-flag">Starred Offering</Label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}