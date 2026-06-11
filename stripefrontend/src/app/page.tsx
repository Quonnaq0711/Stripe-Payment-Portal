import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../convex/_generated/api";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Show, SignOutButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export default async function Home() {
  const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
  const subs = await convex.query(api.subs.getSubs); 

  return (
    <div className="flex min-h-screen flox-col">
      <main className="grow container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
            Find your vibe, entertainment, and enjoy...
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore our subscription-based entertainment platform,
            where you can discover a world of content tailored to your interests.
            With our diverse range of subscription options, you can find the perfect
            fit for your entertainment needs. Whether you're into movies, TV shows,
            music, or gaming, we've got you covered. Join us today and unlock a universe
            of entertainment possibilities!
          </p> 
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {subs.map((sub) => (
            <Card key={sub._id} className="flex flex-col">
              <Link href={`/subscriptions/${sub._id}`} className="cursor-pointer">
                <CardHeader>
                  <Image
                    src={sub.imageUrl}
                    alt={sub.title}
                    width={400}
                    height={225}
                    className=" rounded-md object-cover"
                  />
                </CardHeader>
                <CardContent className="grow">
                  <CardTitle className="text-xl mb-2 hover:underline">{sub.title}</CardTitle>
              </CardContent>
              </Link>
              <CardFooter>
                <Badge variant="default" className="text-lg px-3 py-1">
                  {sub.price}
                </Badge>
              </CardFooter>
              <Show when="signed-in">
                Enroll
              </Show>
              <Show when="signed-out">
                <SignOutButton>
                  <Button>
                    Enroll Now
                  </Button>
                </SignOutButton>
              </Show>
            </Card>
          ))}
          </div>
      </main>
    </div>
  );
}
