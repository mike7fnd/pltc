"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/context/auth-context"
import { useData } from "@/lib/context/data-context"
import { PageLayout } from "@/components/layout/page-layout"
import { ChildCard } from "@/components/children/child-card"
import { AddChildModal } from "@/components/children/add-child-modal"
import { AirbnbButton } from "@/components/ui/airbnb-button"
import { Plus, Users } from "lucide-react"

export default function ChildrenPage() {
  const { user, isLoading: authLoading } = useAuth()
  const { children, addChild } = useData()
  const router = useRouter()
  const [showAddModal, setShowAddModal] = useState(false)

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "parent")) {
      router.push("/login")
    }
  }, [user, authLoading, router])

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  const handleAddChild = (childData: any) => {
    addChild({
      ...childData,
      parentId: user.id,
    })
  }

  return (
    <PageLayout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Children</h1>
            <p className="text-muted-foreground mt-1">
              Manage your children's profiles and track their learning progress.
            </p>
          </div>
          <AirbnbButton onClick={() => setShowAddModal(true)} leftIcon={<Plus className="h-5 w-5" />}>
            Add Child
          </AirbnbButton>
        </div>

        {children.length === 0 ? (
          <div className="text-center py-16 bg-card rounded-2xl border border-border">
            <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold text-xl mb-2">No Children Added</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Add your children to start booking tutoring sessions and tracking their learning progress.
            </p>
            <AirbnbButton onClick={() => setShowAddModal(true)} leftIcon={<Plus className="h-5 w-5" />}>
              Add Your First Child
            </AirbnbButton>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {children.map((child) => (
              <ChildCard key={child.id} child={child} />
            ))}
          </div>
        )}
      </div>

      <AddChildModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} onAdd={handleAddChild} />
    </PageLayout>
  )
}
