import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, Briefcase, MessageSquare, TrendingUp, FileText } from "lucide-react"
import Link from "next/link"

export function MentorDashboard() {
  const stats = [
    {
      title: "Active Internships",
      value: "0",
      description: "Currently posted",
      icon: Briefcase,
      color: "text-blue-600",
    },
    {
      title: "Students Mentored",
      value: "0",
      description: "Total mentees",
      icon: Users,
      color: "text-green-600",
    },
    {
      title: "Feedback Given",
      value: "0",
      description: "Reviews completed",
      icon: MessageSquare,
      color: "text-purple-600",
    },
    {
      title: "Success Rate",
      value: "0%",
      description: "Student completion",
      icon: TrendingUp,
      color: "text-orange-600",
    },
  ]

  const recentApplications: any[] = []
  const activeMentees: any[] = []

  const getStatusColor = (status: string) => {
    switch (status) {
      case "reviewed":
        return "bg-blue-100 text-blue-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-balance">Mentor Dashboard</h1>
        <p className="text-muted-foreground mt-2">Manage your internships and guide your mentees</p>
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
        {/* Recent Applications */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Applications</CardTitle>
            <CardDescription>New applications for your internships</CardDescription>
          </CardHeader>
          <CardContent>
            {recentApplications.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No recent applications</p>
                <p className="text-sm">Applications will appear here when students apply</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentApplications.map((application) => (
                  <div key={application.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{application.studentName}</h4>
                      <p className="text-sm text-muted-foreground">{application.internshipTitle}</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {application.skills.slice(0, 2).map((skill) => (
                          <Badge key={skill} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {application.skills.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{application.skills.length - 2}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(application.status)}>{application.status}</Badge>
                      <p className="text-xs text-muted-foreground mt-1">{application.appliedDate}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-4">
              <Button asChild variant="outline" className="w-full bg-transparent">
                <Link href="/mentor/applicants">Manage All Applicants</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Active Mentees */}
        <Card>
          <CardHeader>
            <CardTitle>Active Mentees</CardTitle>
            <CardDescription>Students you're currently mentoring</CardDescription>
          </CardHeader>
          <CardContent>
            {activeMentees.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No active mentees</p>
                <p className="text-sm">Students you mentor will appear here</p>
              </div>
            ) : (
              <div className="space-y-4">
                {activeMentees.map((mentee) => (
                  <div key={mentee.id} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{mentee.name}</h4>
                      <span className="text-sm text-muted-foreground">{mentee.progress}%</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{mentee.internship}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>
                        {mentee.tasksCompleted}/{mentee.totalTasks} tasks completed
                      </span>
                      <span>Active {mentee.lastActivity}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2 mt-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${mentee.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-4">
              <Button asChild variant="outline" className="w-full bg-transparent">
                <Link href="/mentor/assign-tasks">Assign New Tasks</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks you might want to do</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button asChild>
              <Link href="/mentor/post-internship">Post New Internship</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/mentor/applicants">Review Applications</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/mentor/assign-tasks">Assign Tasks</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/mentor/feedback">Give Feedback</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
