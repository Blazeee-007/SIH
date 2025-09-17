"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, Calendar } from "lucide-react"

export function RateAndFeedback() {
  const [selectedStudent, setSelectedStudent] = useState("")
  const [selectedTask, setSelectedTask] = useState("")
  const [rating, setRating] = useState(0)
  const [feedback, setFeedback] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const students = [
    {
      id: "1",
      name: "Emma Wilson",
      internship: "UI/UX Design Intern",
      email: "emma.wilson@email.com",
    },
    {
      id: "2",
      name: "David Kim",
      internship: "Frontend Developer Intern",
      email: "david.kim@email.com",
    },
    {
      id: "3",
      name: "Lisa Zhang",
      internship: "Data Science Intern",
      email: "lisa.zhang@email.com",
    },
  ]

  const tasks = [
    {
      id: "1",
      title: "Complete React Component Assignment",
      studentId: "1",
      completedDate: "2024-01-15",
    },
    {
      id: "2",
      title: "Submit Weekly Progress Report",
      studentId: "2",
      completedDate: "2024-01-14",
    },
    {
      id: "3",
      title: "Data Analysis Project",
      studentId: "3",
      completedDate: "2024-01-13",
    },
  ]

  const recentFeedback = [
    {
      id: 1,
      student: "Emma Wilson",
      task: "React Component Assignment",
      rating: 4,
      comment:
        "Great work on the component structure! Your TypeScript implementation is solid. Consider adding more comprehensive error handling for edge cases.",
      date: "2024-01-15",
    },
    {
      id: 2,
      student: "David Kim",
      task: "Weekly Progress Report",
      rating: 5,
      comment:
        "Excellent documentation and clear communication of progress. Your reflection on challenges and learnings shows great self-awareness.",
      date: "2024-01-14",
    },
    {
      id: 3,
      student: "Lisa Zhang",
      task: "Data Analysis Project",
      rating: 5,
      comment:
        "Outstanding analysis and visualization! Your insights were valuable and well-presented. Keep up the great work with data storytelling.",
      date: "2024-01-13",
    },
  ]

  const getFilteredTasks = () => {
    if (!selectedStudent) return []
    return tasks.filter((task) => task.studentId === selectedStudent)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedStudent || !selectedTask || rating === 0) {
      alert("Please fill in all required fields")
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      console.log("Feedback submitted:", {
        studentId: selectedStudent,
        taskId: selectedTask,
        rating,
        feedback,
      })
      setIsSubmitting(false)
      // Reset form
      setSelectedStudent("")
      setSelectedTask("")
      setRating(0)
      setFeedback("")
    }, 1000)
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const renderStars = (currentRating: number, interactive = false) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-5 w-5 ${
          i < currentRating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        } ${interactive ? "cursor-pointer hover:text-yellow-400" : ""}`}
        onClick={interactive ? () => setRating(i + 1) : undefined}
      />
    ))
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-balance">Rate & Feedback</h1>
        <p className="text-muted-foreground mt-2">Provide ratings and feedback to your mentees</p>
      </div>

      <Tabs defaultValue="give-feedback" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="give-feedback">Give Feedback</TabsTrigger>
          <TabsTrigger value="feedback-history">Feedback History</TabsTrigger>
        </TabsList>

        <TabsContent value="give-feedback" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Feedback Form */}
            <Card>
              <CardHeader>
                <CardTitle>Submit Feedback</CardTitle>
                <CardDescription>Rate and provide feedback for completed tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Select Student *</label>
                    <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a student" />
                      </SelectTrigger>
                      <SelectContent>
                        {students.map((student) => (
                          <SelectItem key={student.id} value={student.id}>
                            {student.name} - {student.internship}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Select Task *</label>
                    <Select value={selectedTask} onValueChange={setSelectedTask} disabled={!selectedStudent}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a completed task" />
                      </SelectTrigger>
                      <SelectContent>
                        {getFilteredTasks().map((task) => (
                          <SelectItem key={task.id} value={task.id}>
                            {task.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Rating *</label>
                    <div className="flex gap-1">{renderStars(rating, true)}</div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Feedback Comments</label>
                    <Textarea
                      placeholder="Provide detailed feedback on the student's work..."
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      rows={4}
                    />
                  </div>

                  <Button type="submit" disabled={isSubmitting} className="w-full">
                    {isSubmitting ? "Submitting..." : "Submit Feedback"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Student Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Student Overview</CardTitle>
                <CardDescription>Quick overview of your mentees</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {students.map((student) => (
                    <div key={student.id} className="flex items-center gap-3 p-3 border rounded-lg">
                      <Avatar>
                        <AvatarFallback>{getInitials(student.name)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium">{student.name}</p>
                        <p className="text-sm text-muted-foreground">{student.internship}</p>
                      </div>
                      <Badge variant="outline">
                        {tasks.filter((task) => task.studentId === student.id).length} tasks
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="feedback-history" className="space-y-4">
          <div className="grid grid-cols-1 gap-6">
            {recentFeedback.map((item) => (
              <Card key={item.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{item.task}</CardTitle>
                      <CardDescription>Feedback for {item.student}</CardDescription>
                    </div>
                    <div className="flex items-center gap-1">{renderStars(item.rating)}</div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm leading-relaxed">{item.comment}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Submitted on {item.date}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
