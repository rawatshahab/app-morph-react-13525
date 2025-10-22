import { Code2, FileSearch, Home, History, Activity, GitPullRequest, GitBranch } from "lucide-react";
import { NavLink, Link } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const navigation = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "New Review", url: "/review", icon: FileSearch },
  { title: "Job Status", url: "/status", icon: Activity },
  { title: "Reports", url: "/reports", icon: History },
];

const quickActions = [
  { 
    title: "Review Pull Request", 
    description: "Analyze changes in a PR", 
    url: "/review?type=pr", 
    icon: GitPullRequest 
  },
  { 
    title: "Review Repository", 
    description: "Scan entire repository", 
    url: "/review?type=repo", 
    icon: GitBranch 
  },
  { 
    title: "Check Job Status", 
    description: "Monitor review progress", 
    url: "/status", 
    icon: Activity 
  },
  { 
    title: "View Reports", 
    description: "Access past reviews", 
    url: "/reports", 
    icon: History 
  },
];

export function AppSidebar() {
  return (
    <Sidebar className="border-r border-border">
      <SidebarHeader className="border-b border-border px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-primary">
            <Code2 className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">IRIS Review</h1>
            <p className="text-xs text-muted-foreground">Code Quality Analysis</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3">
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/70">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className={({ isActive }) =>
                        `flex items-center gap-3 rounded-lg px-3 py-2 transition-all text-sidebar-foreground ${
                          isActive
                            ? "bg-primary text-primary-foreground font-medium"
                            : "hover:bg-sidebar-accent"
                        }`
                      }
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-4">
          <SidebarGroupLabel className="text-sidebar-foreground/70">Quick Actions</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="space-y-2">
              {quickActions.map((action) => (
                <Button
                  key={action.title}
                  asChild
                  variant="ghost"
                  className="w-full justify-start h-auto py-3 px-3 text-left hover:bg-sidebar-accent text-sidebar-foreground"
                >
                  <Link to={action.url} className="flex items-start gap-3">
                    <action.icon className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm text-sidebar-foreground">{action.title}</div>
                      <div className="text-xs text-sidebar-foreground/60 mt-0.5">{action.description}</div>
                    </div>
                  </Link>
                </Button>
              ))}
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
