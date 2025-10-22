import { FileSearch, Shield, TrendingUp, Activity } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-primary p-8 shadow-glow">
        <div className="relative z-10">
          <h1 className="text-4xl font-bold text-primary-foreground mb-3">
            Welcome to IRIS Code Review
          </h1>
          <p className="text-lg text-primary-foreground/90 mb-6 max-w-2xl">
            Automated code quality analysis powered by AI. Review pull requests and repositories
            with comprehensive insights on security, performance, and best practices.
          </p>
          <div className="flex gap-4">
            <Button asChild size="lg" variant="secondary" className="shadow-elevated">
              <Link to="/review">Start New Review</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/20 text-primary-foreground hover:bg-white/10">
              <Link to="/status">Check Status</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-card border-border hover:shadow-elevated transition-all duration-300">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <FileSearch className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl">Code Analysis</CardTitle>
                <CardDescription>Deep code quality insights</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Comprehensive analysis of readability, structure, and documentation across all files
              in your codebase.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border hover:shadow-elevated transition-all duration-300">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-destructive/10">
                <Shield className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <CardTitle className="text-xl">Security Scanning</CardTitle>
                <CardDescription>Identify vulnerabilities</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Detect security issues, potential vulnerabilities, and compliance concerns with
              detailed remediation steps.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border hover:shadow-elevated transition-all duration-300">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/10">
                <TrendingUp className="h-6 w-6 text-success" />
              </div>
              <div>
                <CardTitle className="text-xl">Performance Metrics</CardTitle>
                <CardDescription>Efficiency analysis</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Evaluate code efficiency, identify bottlenecks, and receive optimization
              recommendations.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Getting Started */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Getting Started
          </CardTitle>
          <CardDescription>
            Learn how to make the most of IRIS Code Review
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-sm">
              1
            </div>
            <div>
              <h4 className="font-medium mb-1">Start a Review</h4>
              <p className="text-sm text-muted-foreground">
                Use the sidebar to quickly start reviewing a pull request or entire repository.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-sm">
              2
            </div>
            <div>
              <h4 className="font-medium mb-1">Monitor Progress</h4>
              <p className="text-sm text-muted-foreground">
                Track your review job in real-time with automatic updates every 3 seconds.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-sm">
              3
            </div>
            <div>
              <h4 className="font-medium mb-1">View Results</h4>
              <p className="text-sm text-muted-foreground">
                Access detailed reports with security insights, code quality scores, and actionable recommendations.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
