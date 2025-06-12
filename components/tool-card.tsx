import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { ArrowRight, Star } from "lucide-react"

interface ToolCardProps {
  title: string
  description: string
  icon: LucideIcon
  href: string
  color: string
  features?: string[]
  popular?: boolean
}

export default function ToolCard({ title, description, icon: Icon, href, color, features, popular }: ToolCardProps) {
  return (
    <Card className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border-0 glass dark:glass-dark overflow-hidden relative">
      {popular && (
        <div className="absolute top-4 right-4 z-10">
          <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 shadow-lg">
            <Star className="h-3 w-3 mr-1" />
            Popular
          </Badge>
        </div>
      )}

      <CardHeader className="pb-4 p-4 sm:p-6">
        <div
          className={cn(
            "w-12 h-12 sm:w-16 sm:h-16 rounded-2xl sm:rounded-3xl flex items-center justify-center mb-4 sm:mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300",
            color,
          )}
        >
          <Icon className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
        </div>
        <CardTitle className="text-lg sm:text-xl lg:text-2xl group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight">
          {title}
        </CardTitle>
        <CardDescription className="text-sm sm:text-base leading-relaxed text-muted-foreground">
          {description}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 p-4 sm:p-6 pt-0">
        {features && (
          <div className="flex flex-wrap gap-2">
            {features.map((feature) => (
              <Badge key={feature} variant="secondary" className="text-xs glass dark:glass-dark border-0">
                {feature}
              </Badge>
            ))}
          </div>
        )}
        <Button
          asChild
          className="w-full group/button bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl border-0 rounded-xl sm:rounded-2xl h-10 sm:h-12 text-sm sm:text-base"
        >
          <Link href={href}>
            Get Started
            <ArrowRight className="ml-2 h-4 w-4 group-hover/button:translate-x-1 transition-transform" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
