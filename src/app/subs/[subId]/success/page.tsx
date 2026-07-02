import { Button } from "@/components/ui/button";
import { CardContent, CardTitle, Card, CardHeader } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import Link from "next/link";


const page = ({ params, searchParams}: { params: { subId: string }; searchParams: { session_id: string } }) => {

    const { subId } = params;
    const { session_id } = searchParams;

  return (
      <div className="container mx-auto py-12 px-4">
          <Card className="max-w-2xl mx-auto">
              <CardHeader className="text-center">
                  <CheckCircle className="size-16 text-green-500 mx-auto mb-4" />
                  <CardTitle className="text-3xl font-bold text-green-700">Payment Successful!</CardTitle>
              </CardHeader>

              <CardContent className="text-center space-y-6">
                  <p className="text-lg text-muted-foreground">
                      Thank you for your payment. Your transaction has been processed successfully.
                  </p>

                  <div className="bg-grey-100 p-4 rounded-md">
                      <p className="text-sm text-grey-500">
                          Transaction ID: {session_id}
                      </p>
                  </div>
                  <div className="flex justify-center gap-4">
                      <Link href={`/subscriptions/${subId}`} >
                      <Button variant="outline" className="w-full sm:w-auto flex items-center justify-center">View Subscription</Button>
                      </Link>

                      <Link href='/subscriptions'>
                          <Button variant="outline" className="w-full sm:w-auto">
                              Browse Vibes
                          </Button>
                      </Link>
                  </div>

              </CardContent>
          </Card>
    </div>
  )
}

export default page