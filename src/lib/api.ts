// API client for IRIS Code Review backend

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

export interface ReviewRequest {
  repo_owner: string;
  repo_name: string;
  pr_number?: number;
  branch_name?: string;
  git_pat: string;
  user_email: string;
  code_repo_type: string;
  additional_context?: Record<string, any>;
}

export interface JobStatus {
  job_id: string;
  status: string;
  progress?: number;
  message?: string;
  result?: any;
}

export interface ReviewReport {
  report_id: string;
  job_id: string;
  metadata: {
    repository: string;
    pr_number?: number;
    branch_name?: string;
    review_type: string;
    generated_at: string;
  };
  overall_scores: Record<string, number>;
  issues: any[];
  file_reviews: any[];
  overall_assessment: string;
}

class APIClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
  }

  async requestPRReview(request: ReviewRequest): Promise<{ job_id: string }> {
    const response = await fetch(`${this.baseUrl}/api/v2/review/pr`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: response.statusText }));
      throw new Error(error.detail || 'Failed to request PR review');
    }

    return response.json();
  }

  async requestRepoReview(request: ReviewRequest): Promise<{ job_id: string }> {
    const response = await fetch(`${this.baseUrl}/api/v2/review/repo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: response.statusText }));
      throw new Error(error.detail || 'Failed to request repository review');
    }

    return response.json();
  }

  async getJobStatus(jobId: string): Promise<JobStatus> {
    const response = await fetch(`${this.baseUrl}/api/v2/status/${jobId}`);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: response.statusText }));
      throw new Error(error.detail || 'Failed to get job status');
    }

    return response.json();
  }

  async getJobReports(jobId: string): Promise<ReviewReport[]> {
    const response = await fetch(`${this.baseUrl}/api/v2/reports/${jobId}`);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: response.statusText }));
      throw new Error(error.detail || 'Failed to get job reports');
    }

    return response.json();
  }

  async getReportContent(reportId: string): Promise<ReviewReport> {
    const response = await fetch(`${this.baseUrl}/api/v2/reports/${reportId}/content`);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: response.statusText }));
      throw new Error(error.detail || 'Failed to get report content');
    }

    return response.json();
  }
}

export const apiClient = new APIClient(BACKEND_URL);
