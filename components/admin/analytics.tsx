"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Users, Briefcase, BarChart3 } from "lucide-react"

export function Analytics() {
  const internshipsPerMonth: any[] = []
  const userRatio: any[] = []
  const progressData: any[] = []
  const topSkills: any[] = []

  const recentMetrics = [
    {
      title: "Application Success Rate",
      value: "0%",
      change: "0%",
      trend: "neutral",
      description: "Students getting accepted",
    },
    {
      title: "Average Completion Time",
      value: "0 months",
      change: "0",
      trend: "neutral",
      description: "Time to complete internships",
    },
    {
      title: "Mentor Satisfaction",
      value: "0/5",
      change: "0",
      trend: "neutral",
      description: "Average mentor rating",
    },
    {
      title: "Platform Growth",
      value: "0%",
      change: "0%",
      trend: "neutral",
      description: "Monthly user growth",
    },
  ]

  const EmptyChart = ({ title, description, icon: Icon }: { title: string; description: string; icon: any }) => (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80 flex items-center justify-center text-muted-foreground">
          <div className="text-center">
            <Icon className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <p>No data available yet</p>
            <p className="text-sm">Data will appear here as the platform grows</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-balance">Analytics Dashboard</h1>
        <p className="text-muted-foreground mt-2">Platform insights and performance metrics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {recentMetrics.map((metric) => (
          <Card key={metric.title}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="text-xs">
                  {metric.change}
                </Badge>
                <p className="text-xs text-muted-foreground">{metric.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EmptyChart
          title="Internships Per Month"
          description="Number of internships posted each month"
          icon={Briefcase}
        />

        <EmptyChart title="User Distribution" description="Platform users by role" icon={Users} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EmptyChart title="Progress Trends" description="Applications vs completions over time" icon={TrendingUp} />

        <EmptyChart
          title="Most Requested Skills"
          description="Skills most commonly required in internships"
          icon={BarChart3}
        />
      </div>
    </div>
  )
}
