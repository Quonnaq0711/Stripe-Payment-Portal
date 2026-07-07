import { Button } from "@/components/ui/button";
import { CardContent, CardTitle, Card, CardHeader } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import Link from "next/link";


const page = async ({
    params,
    searchParams,
}: {
    params: Promise<{ subId: string }>;
    searchParams: Promise<{ session_id?: string | string[] }>;
}) => {
    const { subId } = await params;
    const resolvedSearchParams = await searchParams;
    const sessionId =
        typeof resolvedSearchParams.session_id === "string"
            ? resolvedSearchParams.session_id
            : Array.isArray(resolvedSearchParams.session_id)
              ? resolvedSearchParams.session_id[0] ?? "N/A"
              : "N/A";

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
                          Transaction ID: {sessionId || "N/A"}
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