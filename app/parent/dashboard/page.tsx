"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/context/auth-context"
import { useData } from "@/lib/context/data-context"
import { PageLayout } from "@/components/layout/page-layout"
import { AirbnbCard } from "@/components/ui/airbnb-card"
import { AirbnbButton } from "@/components/ui/airbnb-button"
import { BookingCard } from "@/components/booking/booking-card"
import { Calendar, Clock, BookOpen, Users, ArrowRight, Plus } from "lucide-react"
import Link from "next/link"

export default function ParentDashboard() {
  const { user, isLoading } = useAuth()
  const { bookings, children, tutors } = useData()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "parent")) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  const upcomingBookings = bookings.filter((b) => b.status === "confirmed" || b.status === "pending").slice(0, 3)

  const stats = [
    { label: "Upcoming Sessions", value: upcomingBookings.length, icon: Calendar },
    { label: "Children", value: children.length, icon: Users },
    { label: "Total Sessions", value: bookings.filter((b) => b.status === "completed").length, icon: BookOpen },
    {
      label: "Hours Learned",
      value: Math.round(bookings.filter((b) => b.status === "completed").reduce((acc, b) => acc + b.duration, 0) / 60),
      icon: Clock,
    },
  ]

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Welcome back, {user.name.split(" ")[0]}!</h1>
          <p className="text-muted-foreground mt-1">Here's what's happening with your children's learning.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => (
            <AirbnbCard key={i}>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </AirbnbCard>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Upcoming Bookings */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Upcoming Sessions</h2>
              <Link href="/parent/bookings">
                <AirbnbButton variant="ghost" size="sm" rightIcon={<ArrowRight className="h-4 w-4" />}>
                  View All
                </AirbnbButton>
              </Link>
            </div>

            {upcomingBookings.length === 0 ? (
              <AirbnbCard className="text-center py-12">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold mb-2">No upcoming sessions</h3>
                <p className="text-muted-foreground mb-4">Book a session with a tutor to get started.</p>
                <Link href="/parent/tutors">
                  <AirbnbButton>Find a Tutor</AirbnbButton>
                </Link>
              </AirbnbCard>
            ) : (
              <div className="space-y-4">
                {upcomingBookings.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))}
              </div>
            )}
          </div>

          {/* Children */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Your Children</h2>
              <AirbnbButton variant="ghost" size="sm" leftIcon={<Plus className="h-4 w-4" />}>
                Add
              </AirbnbButton>
            </div>

            <div className="space-y-4">
              {children.map((child) => (
                <AirbnbCard key={child.id} hoverable>
                  <div className="flex items-center gap-4">
                    <img
                      src={child.avatar || "/placeholder.svg"}
                      alt={child.name}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold">{child.name}</p>
                      <p className="text-sm text-muted-foreground">{child.grade}</p>
                    </div>
                  </div>
                </AirbnbCard>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="mt-8">
              <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
              <div className="space-y-2">
                <Link href="/parent/tutors" className="block">
                  <AirbnbCard hoverable className="flex items-center gap-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <BookOpen className="h-5 w-5 text-primary" />
                    </div>
                    <span className="font-medium">Find a Tutor</span>
                    <ArrowRight className="h-4 w-4 ml-auto text-muted-foreground" />
                  </AirbnbCard>
                </Link>
                <Link href="/parent/messages" className="block">
                  <AirbnbCard hoverable className="flex items-center gap-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <span className="font-medium">Messages</span>
                    <ArrowRight className="h-4 w-4 ml-auto text-muted-foreground" />
                  </AirbnbCard>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
