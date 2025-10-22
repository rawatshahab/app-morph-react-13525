import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { apiClient, ReviewRequest } from "@/lib/api";
import { Loader2, GitPullRequest, GitBranch } from "lucide-react";

interface FormData {
  repo_owner: string;
  repo_name: string;
  pr_number?: string;
  branch_name?: string;
  git_pat: string;
  user_email: string;
  code_repo_type: string;
}

export default function NewReview() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get("type") === "repo" ? "repo" : "pr";
  const [activeTab, setActiveTab] = useState(defaultTab);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      code_repo_type: "GenAI",
    },
  });

  const prMutation = useMutation({
    mutationFn: (data: ReviewRequest) => apiClient.requestPRReview(data),
    onSuccess: (response) => {
      toast.success("Review started successfully!");
      navigate(`/status?job_id=${response.job_id}`);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to start review");
    },
  });

  const repoMutation = useMutation({
    mutationFn: (data: ReviewRequest) => apiClient.requestRepoReview(data),
    onSuccess: (response) => {
      toast.success("Review started successfully!");
      navigate(`/status?job_id=${response.job_id}`);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to start review");
    },
  });

  const onSubmit = (data: FormData) => {
    const request: ReviewRequest = {
      repo_owner: data.repo_owner,
      repo_name: data.repo_name,
      git_pat: data.git_pat,
      user_email: data.user_email,
      code_repo_type: data.code_repo_type,
    };

    if (activeTab === "pr") {
      request.pr_number = parseInt(data.pr_number || "0", 10);
      prMutation.mutate(request);
    } else {
      request.branch_name = data.branch_name || "main";
      repoMutation.mutate(request);
    }
  };

  const isLoading = prMutation.isPending || repoMutation.isPending;

  return (
    <div className="mx-auto max-w-3xl space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Start New Review</h1>
        <p className="text-muted-foreground">
          Submit a pull request or repository for automated code quality analysis
        </p>
      </div>

      <Card className="bg-card border-border shadow-elevated">
        <CardHeader>
          <CardTitle>Review Configuration</CardTitle>
          <CardDescription>
            Enter the repository details and select what you want to review
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Repository Info */}
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="repo_owner">Repository Owner*</Label>
                  <Input
                    id="repo_owner"
                    placeholder="octocat"
                    {...register("repo_owner", { required: "Repository owner is required" })}
                    className={errors.repo_owner ? "border-destructive" : ""}
                  />
                  {errors.repo_owner && (
                    <p className="text-sm text-destructive">{errors.repo_owner.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="repo_name">Repository Name*</Label>
                  <Input
                    id="repo_name"
                    placeholder="my-project"
                    {...register("repo_name", { required: "Repository name is required" })}
                    className={errors.repo_name ? "border-destructive" : ""}
                  />
                  {errors.repo_name && (
                    <p className="text-sm text-destructive">{errors.repo_name.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="git_pat">GitHub Personal Access Token*</Label>
                <Input
                  id="git_pat"
                  type="password"
                  placeholder="ghp_xxxxxxxxxxxx"
                  {...register("git_pat", { required: "GitHub PAT is required" })}
                  className={errors.git_pat ? "border-destructive" : ""}
                />
                {errors.git_pat && (
                  <p className="text-sm text-destructive">{errors.git_pat.message}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Your token is used only for this review and is not stored
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="user_email">Email Address*</Label>
                  <Input
                    id="user_email"
                    type="email"
                    placeholder="you@example.com"
                    {...register("user_email", { 
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address"
                      }
                    })}
                    className={errors.user_email ? "border-destructive" : ""}
                  />
                  {errors.user_email && (
                    <p className="text-sm text-destructive">{errors.user_email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="code_repo_type">Repository Type</Label>
                  <Select defaultValue="GenAI" onValueChange={(value) => register("code_repo_type").onChange({ target: { value } })}>
                    <SelectTrigger id="code_repo_type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GenAI">GenAI</SelectItem>
                      <SelectItem value="Backend">Backend</SelectItem>
                      <SelectItem value="Frontend">Frontend</SelectItem>
                      <SelectItem value="FullStack">Full Stack</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Review Type Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="pr" className="flex items-center gap-2">
                  <GitPullRequest className="h-4 w-4" />
                  Pull Request
                </TabsTrigger>
                <TabsTrigger value="repo" className="flex items-center gap-2">
                  <GitBranch className="h-4 w-4" />
                  Repository
                </TabsTrigger>
              </TabsList>

              <TabsContent value="pr" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="pr_number">Pull Request Number*</Label>
                  <Input
                    id="pr_number"
                    type="number"
                    placeholder="123"
                    {...register("pr_number", { 
                      required: activeTab === "pr" ? "PR number is required" : false 
                    })}
                    className={errors.pr_number ? "border-destructive" : ""}
                  />
                  {errors.pr_number && (
                    <p className="text-sm text-destructive">{errors.pr_number.message}</p>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="repo" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="branch_name">Branch Name</Label>
                  <Input
                    id="branch_name"
                    placeholder="main"
                    defaultValue="main"
                    {...register("branch_name")}
                  />
                  <p className="text-xs text-muted-foreground">
                    Leave empty to review the default branch
                  </p>
                </div>
              </TabsContent>
            </Tabs>

            <Button 
              type="submit" 
              className="w-full" 
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Starting Review...
                </>
              ) : (
                <>Start Review</>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
