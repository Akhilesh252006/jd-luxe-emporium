import { cn } from "@/lib/utils"
import { Marquee } from "@/components/ui/marquee"
const reviews = [
  { body: "Exquisite bangles that blend tradition with modern design." },
  { body: "Each piece feels premium — perfect for any festive or bridal look." },
  { body: "Beautiful craftsmanship and shine — looks just like real gold!" },
  { body: "Harsh Bangle Shop redefines artificial jewelry with luxury designs." }, // stronger 4th
  { body: "From everyday elegance to grand occasions — they have it all." },
  { body: "Premium artificial jewelry that adds sparkle to every outfit." }
]


const firstRow = reviews.slice(0, reviews.length / 2)
const secondRow = reviews.slice(reviews.length / 2)


 const ReviewCard = ({ body }: { body: string }) => {
  return (
    <figure
      className={cn(
        "relative h-full w-64 cursor-pointer overflow-hidden rounded-xl border p-4",
        "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
        "dark:border-gray-950/[.1] dark:bg-gray-950/[.01] dark:hover:bg-gray-950/[.05]"
      )}
    >
      <blockquote className="text-sm">{body}</blockquote>
    </figure>
  )
}

export function BannerMarquee() {
  return (
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden mt-4 mb-4">
      <Marquee pauseOnHover className="[--duration:20s]">
        {reviews.map((review, index) => (
          <ReviewCard key={index} body={review.body} />
        ))}
      </Marquee>

      <div className="from-background pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r"></div>
      <div className="from-background pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l"></div>
    </div>
  )
}