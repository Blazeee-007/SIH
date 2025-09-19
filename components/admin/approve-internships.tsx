"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Check, X, Eye, MapPin, Clock, DollarSign } from "lucide-react"

export function ApproveInternships() {
  const [searchTerm, setSearchTerm] = useState("")

  const internships = [
    {
      id: 1,
      title: "Machine Learning Intern",
      company: "DataFlow Inc",
      mentor: "John Davis",
      location: "New York, NY",
      type: "Hybrid",
      duration: "6 months",
      stipend: "$2500/month",
      skills: ["Python", "Machine Learning", "TensorFlow"],
      description: "Work on cutting-edge ML models for data analysis and prediction.",
      status: "pending",
      submittedDate: "2024-01-14",
      applicants: 0,
    },
    {
      id: 2,
      title: "Cloud Infrastructure Intern",
      company: "CloudTech Systems",
      mentor: "Mike Johnson",
      location: "Seattle, WA",
      type: "Remote",
      duration: "4 months",
      stipend: "$2200/month",
      skills: ["AWS", "Docker", "Kubernetes"],
      description: "Learn about cloud infrastructure and DevOps practices.",
      status: "pending",
      submittedDate: "2024-01-13",
      applicants: 0,
    },
    {
      id: 3,
      title: "Frontend Developer Intern",
      company: "TechCorp Solutions",
      mentor: "Sarah Wilson",
      location: "San Francisco, CA",
      type: "Remote",
      duration: "3 months",
      stipend: "$2000/month",
      skills: ["React", "TypeScript", "CSS"],
      description: "Build modern web applications using React and TypeScript.",
      status: "approved",
      submittedDate: "2024-01-10",
      applicants: 12,
    },
    {
      id: 4,
      title: "Data Science Intern",
      company: "Analytics Pro",
      mentor: "Dr. Emily Zhang",
      location: "Boston, MA",
      type: "On-site",
      duration: "5 months",
      stipend: "$2300/month",
      skills: ["Python", "SQL", "Tableau"],
      description: "Analyze large datasets and create insightful visualizations.",
      status: "approved",
      submittedDate: "2024-01-08",
      applicants: 8,
    },
    {
      id: 5,
      title: "Mobile App Developer Intern",
      company: "StartupXYZ",
      mentor: "Alex Thompson",
      location: "Austin, TX",
      type: "Hybrid",
      duration: "4 months",
      stipend: "$1800/month",
      skills: ["React Native", "Flutter", "Firebase"],
      description: "Develop cross-platform mobile applications.",
      status: "rejected",
      submittedDate: "2024-01-05",
      applicants: 0,
    },
  ]

  const filteredInternships = internships.filter(
    (internship) =>
      internship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      internship.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      internship.mentor.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 border-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const filterInternships = (status: string) => {
    if (status === "all") return filteredInternships
    return filteredInternships.filter((internship) => internship.status === status)
  }

  const handleApprove = (internshipId: number) => {
    console.log("Approving internship:", internshipId)
    // Handle approval logic
  }

  const handleReject = (internshipId: number) => {
    console.log("Rejecting internship:", internshipId)
    // Handle rejection logic
  }

  const InternshipRow = ({ internship }: { internship: (typeof internships)[0] }) => (
    <TableRow>
      <TableCell>
        <div>
          <p className="font-medium">{internship.title}</p>
          <p className="text-sm text-muted-foreground">{internship.company}</p>
          <p className="text-sm text-muted-foreground">by {internship.mentor}</p>
        </div>
      </TableCell>
      <TableCell>
        <div className="space-y-1 text-sm">
          <div className="flex items-center gap-2">
            <MapPin className="h-3 w-3" />
            <span>{internship.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-3 w-3" />
            <span>{internship.duration}</span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="h-3 w-3" />
            <span>{internship.stipend}</span>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex flex-wrap gap-1">
          {internship.skills.slice(0, 2).map((skill) => (
            <Badge key={skill} variant="secondary" className="text-xs">
              {skill}
            </Badge>
          ))}
          {internship.skills.length > 2 && (
            <Badge variant="secondary" className="text-xs">
              +{internship.skills.length - 2}
            </Badge>
          )}
        </div>
      </TableCell>
      <TableCell>
        <Badge className={getStatusColor(internship.status)}>{internship.status}</Badge>
      </TableCell>
      <TableCell>
        <div className="text-sm">
          <p>Submitted: {internship.submittedDate}</p>
          <p>{internship.applicants} applicants</p>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex gap-2">
          <Button size="sm" variant="outline">
            <Eye className="h-4 w-4" />
          </Button>
          {internship.status === "pending" && (
            <>
              <Button
                size="sm"
                className="bg-green-600 hover:bg-green-700"
                onClick={() => handleApprove(internship.id)}
              >
                <Check className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="destructive" onClick={() => handleReject(internship.id)}>
                <X className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </TableCell>
    </TableRow>
  )

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-balance">Approve Internships</h1>
        <p className="text-muted-foreground mt-2">Review and approve internship postings</p>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search internships by title, company, or mentor..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button>Export Data</Button>
          </div>
        </CardContent>
      </Card>

      {/* Internships Table with Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Internship Applications</CardTitle>
          <CardDescription>Review internship postings by status</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All ({filteredInternships.length})</TabsTrigger>
              <TabsTrigger value="pending">Pending ({filterInternships("pending").length})</TabsTrigger>
              <TabsTrigger value="approved">Approved ({filterInternships("approved").length})</TabsTrigger>
              <TabsTrigger value="rejected">Rejected ({filterInternships("rejected").length})</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Internship</TableHead>
                      <TableHead>Details</TableHead>
                      <TableHead>Skills</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Info</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInternships.map((internship) => (
                      <InternshipRow key={internship.id} internship={internship} />
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="pending">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Internship</TableHead>
                      <TableHead>Details</TableHead>
                      <TableHead>Skills</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Info</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filterInternships("pending").map((internship) => (
                      <InternshipRow key={internship.id} internship={internship} />
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="approved">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Internship</TableHead>
                      <TableHead>Details</TableHead>
                      <TableHead>Skills</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Info</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filterInternships("approved").map((internship) => (
                      <InternshipRow key={internship.id} internship={internship} />
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="rejected">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Internship</TableHead>
                      <TableHead>Details</TableHead>
                      <TableHead>Skills</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Info</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filterInternships("rejected").map((internship) => (
                      <InternshipRow key={internship.id} internship={internship} />
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
