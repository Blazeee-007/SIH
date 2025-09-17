import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Eye, Check, X, Mail, Phone, Calendar } from "lucide-react"

export function ManageApplicants() {
  const applicants = [
    {
      id: 1,
      name: "Alex Johnson",
      email: "alex.johnson@email.com",
      phone: "+1 (555) 123-4567",
      internshipTitle: "Frontend Developer Intern",
      appliedDate: "2024-01-15",
      status: "pending",
      skills: ["React", "TypeScript", "CSS", "JavaScript"],
      education: "Computer Science, Tech University",
      year: "3rd Year",
      gpa: "3.8",
    },
    {
      id: 2,
      name: "Sarah Chen",
      email: "sarah.chen@email.com",
      phone: "+1 (555) 234-5678",
      internshipTitle: "Data Science Intern",
      appliedDate: "2024-01-14",
      status: "pending",
      skills: ["Python", "Machine Learning", "SQL", "Pandas"],
      education: "Data Science, State University",
      year: "4th Year",
      gpa: "3.9",
    },
    {
      id: 3,
      name: "Mike Rodriguez",
      email: "mike.rodriguez@email.com",
      phone: "+1 (555) 345-6789",
      internshipTitle: "Backend Developer Intern",
      appliedDate: "2024-01-13",
      status: "reviewed",
      skills: ["Node.js", "MongoDB", "AWS", "Docker"],
      education: "Software Engineering, City College",
      year: "3rd Year",
      gpa: "3.7",
    },
    {
      id: 4,
      name: "Emma Wilson",
      email: "emma.wilson@email.com",
      phone: "+1 (555) 456-7890",
      internshipTitle: "UI/UX Design Intern",
      appliedDate: "2024-01-12",
      status: "accepted",
      skills: ["Figma", "Adobe XD", "Prototyping", "User Research"],
      education: "Design, Art Institute",
      year: "2nd Year",
      gpa: "3.6",
    },
    {
      id: 5,
      name: "David Kim",
      email: "david.kim@email.com",
      phone: "+1 (555) 567-8901",
      internshipTitle: "Frontend Developer Intern",
      appliedDate: "2024-01-11",
      status: "rejected",
      skills: ["React", "Vue.js", "CSS", "HTML"],
      education: "Web Development, Online University",
      year: "2nd Year",
      gpa: "3.4",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "bg-green-100 text-green-800 border-green-200"
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "reviewed":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const filterApplicants = (status: string) => {
    if (status === "all") return applicants
    return applicants.filter((applicant) => applicant.status === status)
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const ApplicantCard = ({ applicant }: { applicant: (typeof applicants)[0] }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback>{getInitials(applicant.name)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{applicant.name}</CardTitle>
              <CardDescription>{applicant.internshipTitle}</CardDescription>
            </div>
          </div>
          <Badge className={getStatusColor(applicant.status)}>{applicant.status}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span>{applicant.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span>{applicant.phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>Applied: {applicant.appliedDate}</span>
          </div>
          <div className="text-muted-foreground">GPA: {applicant.gpa}</div>
        </div>

        <div>
          <p className="text-sm text-muted-foreground mb-2">Education</p>
          <p className="text-sm font-medium">
            {applicant.education} ({applicant.year})
          </p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground mb-2">Skills</p>
          <div className="flex flex-wrap gap-1">
            {applicant.skills.map((skill) => (
              <Badge key={skill} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button size="sm" variant="outline">
            <Eye className="h-4 w-4 mr-2" />
            View Profile
          </Button>
          {applicant.status === "pending" && (
            <>
              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                <Check className="h-4 w-4 mr-2" />
                Accept
              </Button>
              <Button size="sm" variant="destructive">
                <X className="h-4 w-4 mr-2" />
                Reject
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-balance">Manage Applicants</h1>
        <p className="text-muted-foreground mt-2">Review and manage internship applications</p>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All ({applicants.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({filterApplicants("pending").length})</TabsTrigger>
          <TabsTrigger value="reviewed">Reviewed ({filterApplicants("reviewed").length})</TabsTrigger>
          <TabsTrigger value="accepted">Accepted ({filterApplicants("accepted").length})</TabsTrigger>
          <TabsTrigger value="rejected">Rejected ({filterApplicants("rejected").length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {applicants.map((applicant) => (
              <ApplicantCard key={applicant.id} applicant={applicant} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filterApplicants("pending").map((applicant) => (
              <ApplicantCard key={applicant.id} applicant={applicant} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="reviewed" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filterApplicants("reviewed").map((applicant) => (
              <ApplicantCard key={applicant.id} applicant={applicant} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="accepted" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filterApplicants("accepted").map((applicant) => (
              <ApplicantCard key={applicant.id} applicant={applicant} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filterApplicants("rejected").map((applicant) => (
              <ApplicantCard key={applicant.id} applicant={applicant} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
