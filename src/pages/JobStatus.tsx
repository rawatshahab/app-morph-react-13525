import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { apiClient } from "@/lib/api";
import { CheckCircle, XCircle, Loader2, Clock, ArrowRight } from "lucide-react";

export default function JobStatus() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobId, setJobId] = useState(searchParams.get("job_id") || "");
  const [trackedJobId, setTrackedJobId] = useState(searchParams.get("job_id") || "");

  const { data: status, isLoading, error, refetch } = useQuery({
    queryKey: ["jobStatus", trackedJobId],
    queryFn: () => apiClient.getJobStatus(trackedJobId),
    enabled: !!trackedJobId,
    refetchInterval: (query) => {
      // Stop refetching if job is completed or failed
      const data = query.state.data;
      if (data?.status === "completed" || data?.status === "failed") {
        return false;
      }
      return 3000; // Refetch every 3 seconds
    },
  });

  const handleTrackJob = () => {
    if (jobId.trim()) {
      setTrackedJobId(jobId.trim());
      setSearchParams({ job_id: jobId.trim() });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-success text-success-foreground";
      case "failed":
        return "bg-destructive text-destructive-foreground";
      case "processing":
      case "in_progress":
        return "bg-primary text-primary-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return <CheckCircle className="h-5 w-5" />;
      case "failed":
        return <XCircle className="h-5 w-5" />;
      case "processing":
      case "in_progress":
        return <Loader2 className="h-5 w-5 animate-spin" />;
      default:
        return <Clock className="h-5 w-5" />;
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Job Status</h1>
        <p className="text-muted-foreground">
          Track the progress of your code review jobs in real-time
        </p>
      </div>

      {/* Job ID Input */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Track a Job</CardTitle>
          <CardDescription>Enter a job ID to monitor its status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <div className="flex-1 space-y-2">
              <Label htmlFor="job_id" className="sr-only">Job ID</Label>
              <Input
                id="job_id"
                placeholder="Enter job ID..."
                value={jobId}
                onChange={(e) => setJobId(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleTrackJob()}
              />
            </div>
            <Button onClick={handleTrackJob}>Track Job</Button>
          </div>
        </CardContent>
      </Card>

      {/* Status Display */}
      {trackedJobId && (
        <Card className="bg-card border-border shadow-elevated">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  Job Status
                  {status && (
                    <Badge className={getStatusColor(status.status)}>
                      {getStatusIcon(status.status)}
                      <span className="ml-1">{status.status}</span>
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription className="mt-1">
                  Job ID: <code className="text-xs bg-muted px-2 py-1 rounded">{trackedJobId}</code>
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {isLoading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}

            {error && (
              <div className="rounded-lg border border-destructive bg-destructive/10 p-4">
                <p className="text-sm text-destructive">
                  Failed to load job status. Please check the job ID and try again.
                </p>
              </div>
            )}

            {status && !isLoading && (
              <>
                {/* Progress Bar */}
                {(status.status === "processing" || status.status === "in_progress") && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{status.progress || 0}%</span>
                    </div>
                    <Progress value={status.progress || 0} className="h-2" />
                  </div>
                )}

                {/* Status Message */}
                {status.message && (
                  <div className="rounded-lg bg-muted p-4">
                    <p className="text-sm text-foreground">{status.message}</p>
                  </div>
                )}

                {/* Completed Actions */}
                {status.status === "completed" && (
                  <div className="flex gap-3">
                    <Button asChild className="flex-1">
                      <Link to={`/reports?job_id=${trackedJobId}`}>
                        View Reports
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                )}

                {/* Failed Actions */}
                {status.status === "failed" && (
                  <div className="space-y-3">
                    <div className="rounded-lg border border-destructive bg-destructive/10 p-4">
                      <p className="text-sm text-destructive">
                        The review job failed. Please try submitting a new review.
                      </p>
                    </div>
                    <Button asChild variant="outline" className="w-full">
                      <Link to="/review">Start New Review</Link>
                    </Button>
                  </div>
                )}

                {/* Auto-refresh indicator */}
                {(status.status === "processing" || status.status === "in_progress") && (
                  <p className="text-xs text-center text-muted-foreground">
                    Auto-refreshing every 3 seconds...
                  </p>
                )}
              </>
            )}
          </CardContent>
        </Card>
      )}

      {!trackedJobId && (
        <Card className="bg-muted/30 border-border border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Clock className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Job Selected</h3>
            <p className="text-muted-foreground mb-4 max-w-md">
              Enter a job ID above to start tracking, or start a new review to get a job ID.
            </p>
            <Button asChild>
              <Link to="/review">Start New Review</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
