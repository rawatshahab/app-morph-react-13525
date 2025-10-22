import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, Search } from "lucide-react";

export default function Reports() {
  const [searchParams] = useSearchParams();
  const [jobId, setJobId] = useState(searchParams.get("job_id") || "");

  return (
    <div className="mx-auto max-w-6xl space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Review Reports</h1>
        <p className="text-muted-foreground">
          Access and download your code review reports
        </p>
      </div>

      {/* Search Section */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Find Reports</CardTitle>
          <CardDescription>Search by job ID to view associated reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <div className="flex-1 space-y-2">
              <Label htmlFor="search_job_id" className="sr-only">Job ID</Label>
              <Input
                id="search_job_id"
                placeholder="Enter job ID..."
                value={jobId}
                onChange={(e) => setJobId(e.target.value)}
              />
            </div>
            <Button>
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Reports List Placeholder */}
      <Card className="bg-muted/30 border-border border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <FileText className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Reports Yet</h3>
          <p className="text-muted-foreground max-w-md">
            Reports from completed reviews will appear here. Start a new review to generate your
            first report.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
