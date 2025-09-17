"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Calendar, User } from "lucide-react"

export function AssignTasks() {
  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    deadline: "",
    priority: "",
  })

  const [selectedStudents, setSelectedStudents] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const students = [
    {
      id: "1",
      name: "Emma Wilson",
      internship: "UI/UX Design Intern",
      progress: 75,
      email: "emma.wilson@email.com",
    },
    {
      id: "2",
      name: "David Kim",
      internship: "Frontend Developer Intern",
      progress: 60,
      email: "david.kim@email.com",
    },
    {
      id: "3",
      name: "Lisa Zhang",
      internship: "Data Science Intern",
      progress: 90,
      email: "lisa.zhang@email.com",
    },
    {
      id: "4",
      name: "Alex Johnson",
      internship: "Backend Developer Intern",
      progress: 45,
      email: "alex.johnson@email.com",
    },
  ]

  const recentTasks = [
    {
      id: 1,
      title: "Complete React Component Assignment",
      assignedTo: "Emma Wilson",
      deadline: "2024-01-20",
      status: "in-progress",
      priority: "high",
    },
    {
      id: 2,
      title: "Submit Weekly Progress Report",
      assignedTo: "David Kim",
      deadline: "2024-01-18",
      status: "completed",
      priority: "medium",
    },
    {
      id: 3,
      title: "Code Review: API Integration",
      assignedTo: "Lisa Zhang",
      deadline: "2024-01-22",
      status: "pending",
      priority: "low",
    },
  ]

  const handleInputChange = (field: string, value: string) => {
    setTaskData((prev) => ({ ...prev, [field]: value }))
  }

  const handleStudentSelection = (studentId: string, checked: boolean) => {
    if (checked) {
      setSelectedStudents((prev) => [...prev, studentId])
    } else {
      setSelectedStudents((prev) => prev.filter((id) => id !== studentId))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedStudents.length === 0) {
      alert("Please select at least one student")
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      console.log("Task assigned:", { ...taskData, assignedTo: selectedStudents })
      setIsSubmitting(false)
      // Reset form
      setTaskData({ title: "", description: "", deadline: "", priority: "" })
      setSelectedStudents([])
    }, 1000)
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "in-progress":
        return "bg-blue-100 text-blue-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-balance">Assign Tasks</h1>
        <p className="text-muted-foreground mt-2">Create and assign tasks to your mentees</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Task Assignment Form */}
        <Card>
          <CardHeader>
            <CardTitle>Create New Task</CardTitle>
            <CardDescription>Assign a task to selected students</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Task Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Complete React Component Assignment"
                  value={taskData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the task requirements and expectations..."
                  value={taskData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  rows={3}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="deadline">Deadline *</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={taskData.deadline}
                    onChange={(e) => handleInputChange("deadline", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority *</Label>
                  <Select value={taskData.priority} onValueChange={(value) => handleInputChange("priority", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Assign to Students *</Label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {students.map((student) => (
                    <div key={student.id} className="flex items-center space-x-3 p-2 border rounded">
                      <Checkbox
                        id={student.id}
                        checked={selectedStudents.includes(student.id)}
                        onCheckedChange={(checked) => handleStudentSelection(student.id, checked as boolean)}
                      />
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">{getInitials(student.name)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{student.name}</p>
                        <p className="text-xs text-muted-foreground">{student.internship}</p>
                      </div>
                      <div className="text-xs text-muted-foreground">{student.progress}%</div>
                    </div>
                  ))}
                </div>
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? "Assigning..." : "Assign Task"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Recent Tasks */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Tasks</CardTitle>
            <CardDescription>Tasks you've recently assigned</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTasks.map((task) => (
                <div key={task.id} className="p-3 border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-sm">{task.title}</h4>
                    <div className="flex gap-1">
                      <Badge className={getStatusColor(task.status)} variant="secondary">
                        {task.status}
                      </Badge>
                      <Badge className={getPriorityColor(task.priority)} variant="secondary">
                        {task.priority}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      <span>{task.assignedTo}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>Due: {task.deadline}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
