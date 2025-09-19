import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, UserCheck, Briefcase, CheckCircle, TrendingUp, AlertCircle } from "lucide-react"
import Link from "next/link"

export function AdminDashboard() {
  const stats = [
    {
      title: "Total Students",
      value: "1,247",
      description: "+12% from last month",
      icon: Users,
      color: "text-blue-600",
      trend: "up",
    },
    {
      title: "Total Mentors",
      value: "89",
      description: "+5% from last month",
      icon: UserCheck,
      color: "text-green-600",
      trend: "up",
    },
    {
      title: "Active Internships",
      value: "156",
      description: "Currently running",
      icon: Briefcase,
      color: "text-purple-600",
      trend: "stable",
    },
    {
      title: "Completed Internships",
      value: "342",
      description: "Successfully finished",
      icon: CheckCircle,
      color: "text-orange-600",
      trend: "up",
    },
  ]

  const recentActivities = [
    {
      id: 1,
      type: "student_registration",
      message: "New student Alex Johnson registered",
      timestamp: "2 hours ago",
      status: "info",
    },
    {
      id: 2,
      type: "mentor_approval",
      message: "Mentor Sarah Wilson approved",
      timestamp: "4 hours ago",
      status: "success",
    },
    {
      id: 3,
      type: "internship_pending",
      message: "Internship 'Data Science Intern' pending approval",
      timestamp: "6 hours ago",
      status: "warning",
    },
    {
      id: 4,
      type: "internship_completed",
      message: "Internship 'Frontend Developer' completed by Emma Wilson",
      timestamp: "1 day ago",
      status: "success",
    },
  ]

  const pendingApprovals = [
    {
      id: 1,
      type: "mentor",
      title: "Dr. Michael Chen",
      description: "Senior Software Engineer at Google",
      date: "2024-01-15",
    },
    {
      id: 2,
      type: "internship",
      title: "Machine Learning Intern",
      description: "Posted by DataFlow Inc",
      date: "2024-01-14",
    },
    {
      id: 3,
      type: "mentor",
      title: "Lisa Rodriguez",
      description: "Product Manager at Microsoft",
      date: "2024-01-13",
    },
  ]

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "student_registration":
        return <Users className="h-4 w-4" />
      case "mentor_approval":
        return <UserCheck className="h-4 w-4" />
      case "internship_pending":
        return <AlertCircle className="h-4 w-4" />
      case "internship_completed":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <TrendingUp className="h-4 w-4" />
    }
  }

  const getActivityColor = (status: string) => {
    switch (status) {
      case "success":
        return "text-green-600"
      case "warning":
        return "text-yellow-600"
      case "error":
        return "text-red-600"
      default:
        return "text-blue-600"
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-balance">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-2">Manage the Prashikshan platform</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Latest platform activities and events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 border rounded-lg">
                  <div className={`mt-0.5 ${getActivityColor(activity.status)}`}>{getActivityIcon(activity.type)}</div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.message}</p>
                    <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pending Approvals */}
        <Card>
          <CardHeader>
            <CardTitle>Pending Approvals</CardTitle>
            <CardDescription>Items requiring your attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingApprovals.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{item.title}</h4>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                    <p className="text-xs text-muted-foreground">Submitted: {item.date}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="capitalize">
                      {item.type}
                    </Badge>
                    <Button size="sm" variant="outline">
                      Review
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <Button asChild variant="outline" className="bg-transparent">
                <Link href="/admin/mentors">Manage Mentors</Link>
              </Button>
              <Button asChild variant="outline" className="bg-transparent">
                <Link href="/admin/internships">Approve Internships</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button asChild>
              <Link href="/admin/students">Manage Students</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/admin/mentors">Manage Mentors</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/admin/internships">Approve Internships</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/admin/analytics">View Analytics</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
