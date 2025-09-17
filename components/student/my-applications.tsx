import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, MapPin, Eye, FileText } from "lucide-react"

export function MyApplications() {
  const applications: any[] = []

  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "bg-green-100 text-green-800 border-green-200"
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "interview":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const filterApplications = (status: string) => {
    if (status === "all") return applications
    return applications.filter((app) => app.status === status)
  }

  const ApplicationCard = ({ application }: { application: any }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{application.title}</CardTitle>
            <CardDescription className="text-base font-medium text-foreground">{application.company}</CardDescription>
          </div>
          <Badge className={getStatusColor(application.status)}>{application.status}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>{application.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>Applied: {application.appliedDate}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Badge variant="outline">{application.type}</Badge>
            <Badge variant="outline">{application.stipend}</Badge>
          </div>
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  const EmptyState = () => (
    <div className="text-center py-16 text-muted-foreground">
      <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
      <h3 className="text-lg font-medium mb-2">No applications yet</h3>
      <p>Start applying to internships to see them here</p>
    </div>
  )

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-balance">My Applications</h1>
        <p className="text-muted-foreground mt-2">Track the status of your internship applications</p>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All ({applications.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({filterApplications("pending").length})</TabsTrigger>
          <TabsTrigger value="interview">Interview ({filterApplications("interview").length})</TabsTrigger>
          <TabsTrigger value="accepted">Accepted ({filterApplications("accepted").length})</TabsTrigger>
          <TabsTrigger value="rejected">Rejected ({filterApplications("rejected").length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {applications.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {applications.map((application) => (
                <ApplicationCard key={application.id} application={application} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          {filterApplications("pending").length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filterApplications("pending").map((application) => (
                <ApplicationCard key={application.id} application={application} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="interview" className="space-y-4">
          {filterApplications("interview").length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filterApplications("interview").map((application) => (
                <ApplicationCard key={application.id} application={application} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="accepted" className="space-y-4">
          {filterApplications("accepted").length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filterApplications("accepted").map((application) => (
                <ApplicationCard key={application.id} application={application} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4">
          {filterApplications("rejected").length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filterApplications("rejected").map((application) => (
                <ApplicationCard key={application.id} application={application} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
