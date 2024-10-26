import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2, Share2, Edit, Calendar } from "lucide-react"

export default function ScreenshotHome() {
  const feedbackCards = [
    {
      title: "Net Crest Leadership Forum",
      description: "The biggest event of the year.",
      createdDate: "Oct 21, 2024",
    },
    {
      title: "Help us improve Netform's AI Form Generator!",
      description: "We're eager to hear your thoughts on our new project. Your feedback is invaluable to us.",
      createdDate: "Oct 22, 2024",
    },
    {
      title: "Subscribe to Our YouTube Newsletter",
      description: "Get notified about new uploads, exclusive content, and more.",
      createdDate: "Oct 22, 2024",
    },
    {
      title: "Net Unisex Saloon",
      description: "Schedule your next salon appointment with ease.",
      createdDate: "Oct 23, 2024",
    },
    {
      title: "New Patient Registration",
      description: "Please fill out the following information to register.",
      createdDate: "Oct 25, 2024",
    },
    {
      title: "Registration Form",
      description: "Join us for a night of reminiscing and reconnecting!",
      createdDate: "Oct 25, 2024",
    },
  ]

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {feedbackCards.map((card, index) => (
          <Card key={index} className="flex flex-col relative">
            <button className="absolute top-2 right-2 text-gray-500 hover:text-red-500 transition-colors">
              <Trash2 className="h-5 w-5 text-primary" />
            </button>
            <CardHeader>
              <CardTitle className="text-lg font-semibold ">{card.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-gray-600">{card.description}</p>

            <div className="flex gap-2 mt-5">
              <Calendar className="h-4 w-4 mr-1" />
              <p className="text-xs text-gray-500">Created on {card.createdDate}</p>
            </div>
            </CardContent>
            

            <CardFooter className="flex flex-col items-start space-y-2">
              <hr className="w-full border-t border-gray-200 my-2" />

              <div className="flex justify-between space-x-2 w-full">
                
              <Button
              size="sm"
              className="flex gap-2 bg-slate-white border border-black text-black hover:bg-transparent hover:border-b-2 font-semi-bold"
              
            >
              <Edit className="h-4 w-4" />
                  Edit
                </Button>
                <Button
                size="sm"
                className="flex gap-2 bg-slate-white border border-black text-black hover:bg-transparent hover:border-b-2 font-semi-bold"
              >
                <Share2 className="h-4 w-4" />
                  Share
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}