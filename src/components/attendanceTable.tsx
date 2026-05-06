"use client"

import React, { useState } from 'react'
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"

export function AttendanceTable({ students }: { students: any[] }) {
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const toggleSelectAll = () => {
    if (selectedIds.length === students.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(students.map(s => s.id))
    }
  }

  const handleSave = async () => {
    const response = await fetch('/api/attendance', {
      method: 'POST',
      body: JSON.stringify({
        studentIds: selectedIds,
        date: new Date().toISOString().split('T')[0],
        status: 'present'
      })
    })
    if (response.ok) alert("Success!")
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Checkbox 
          checked={selectedIds.length === students.length}
          onCheckedChange={toggleSelectAll} 
        />
        <span className="font-medium">Select All Wrestlers</span>
      </div>
      
      <div className="border rounded-md">
        {students.map(student => (
          <div key={student.id} className="flex items-center p-3 border-b last:border-0">
            <Checkbox 
              checked={selectedIds.includes(student.id)}
              onCheckedChange={() => {
                setSelectedIds(prev => 
                  prev.includes(student.id) 
                    ? prev.filter(id => id !== student.id) 
                    : [...prev, student.id]
                )
              }}
            />
            <span className="ml-4">{student.name}</span>
          </div>
        ))}
      </div>
      
      <Button onClick={handleSave} className="w-full">Submit Attendance</Button>
    </div>
  )
}