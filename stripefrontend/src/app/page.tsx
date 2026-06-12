import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../convex/_generated/api";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Show, SignInButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

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
              <CardFooter className="flex items-center justify-between">
                <Badge variant="default" className="text-lg px-3 py-1">
                  {sub.price}
                </Badge>
                <Show when="signed-in">
                  <Button variant="outline">
                    Enroll
                    </Button>
              </Show>
              <Show when="signed-out">
                <SignInButton mode="modal">
                  <Button variant="outline">
                    Enroll Now
                  </Button>
                </SignInButton>
              </Show>
              </CardFooter>
            </Card>
          ))}
        </div>
        <div className="text-center">
          <Link href="/pro">
            <Button size="lg" className="group hover:bg-purple-900 transition-colors duration-300">
              Pro Plans
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
