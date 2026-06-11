import React from 'react'
import { api } from '../../../../convex/_generated/api';
import { ConvexHttpClient } from 'convex/browser';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Show, SignInButton } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
// import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';


const page = async() => {
    const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
    const subs = await convex.query(api.subs.getSubs);

  return (
      <div className="container mx-auto py-8 px-4">
          <h1 className="text-3xl font-bold mb-8"> All Subscriptions</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subs.map((sub) => (
                  <Card key={sub._id} className=" flex  flex-col">
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
                              <CardTitle className="text-xl mb-2 hover:underline">
                                  {sub.title}
                              </CardTitle>
                           </CardContent>                     
                      </Link>
                      <CardFooter className="flex items-center justify-between">
                <Badge variant="default" className="text-lg px-3 py-1">
                  {sub.price}
                </Badge>
              <Show when="signed-in">
                              Purchase
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
        </div>
  )
}

export default page