"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Check, X, Mail, Building, Calendar, Users } from "lucide-react"

export function ManageMentors() {
  const [searchTerm, setSearchTerm] = useState("")

  const mentors: any[] = []

  const filteredMentors = mentors.filter(
    (mentor) =>
      mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.company.toLowerCase().includes(searchTerm.toLowerCase()),
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

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const handleApprove = (mentorId: number) => {
    console.log("Approving mentor:", mentorId)
    // Handle approval logic
  }

  const handleReject = (mentorId: number) => {
    console.log("Rejecting mentor:", mentorId)
    // Handle rejection logic
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-balance">Manage Mentors</h1>
        <p className="text-muted-foreground mt-2">Review and manage mentor applications</p>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search mentors by name, email, or company..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button>Export Data</Button>
          </div>
        </CardContent>
      </Card>

      {/* Mentors Table */}
      <Card>
        <CardHeader>
          <CardTitle>Mentors ({filteredMentors.length})</CardTitle>
          <CardDescription>All mentor applications and approved mentors</CardDescription>
        </CardHeader>
        <CardContent>
          {mentors.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <Users className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No mentor applications yet</h3>
              <p>Mentor applications will appear here when professionals apply</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mentor</TableHead>
                    <TableHead>Company & Role</TableHead>
                    <TableHead>Expertise</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Performance</TableHead>
                    <TableHead>Join Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMentors.map((mentor) => (
                    <TableRow key={mentor.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>{getInitials(mentor.name)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{mentor.name}</p>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Mail className="h-3 w-3" />
                              <span>{mentor.email}</span>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4 text-muted-foreground" />
                            <p className="font-medium">{mentor.company}</p>
                          </div>
                          <p className="text-sm text-muted-foreground">{mentor.position}</p>
                          <p className="text-sm text-muted-foreground">{mentor.experience} experience</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {mentor.expertise.slice(0, 2).map((skill) => (
                            <Badge key={skill} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {mentor.expertise.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{mentor.expertise.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(mentor.status)}>{mentor.status}</Badge>
                      </TableCell>
                      <TableCell>
                        {mentor.status === "approved" ? (
                          <div className="text-sm">
                            <p>{mentor.students} students</p>
                            <p>{mentor.internships} internships</p>
                            <p>Rating: {mentor.rating}/5</p>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">N/A</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-3 w-3" />
                          <span>{mentor.joinDate}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {mentor.status === "pending" ? (
                            <>
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700"
                                onClick={() => handleApprove(mentor.id)}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="destructive" onClick={() => handleReject(mentor.id)}>
                                <X className="h-4 w-4" />
                              </Button>
                            </>
                          ) : (
                            <Button size="sm" variant="outline">
                              View Details
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
