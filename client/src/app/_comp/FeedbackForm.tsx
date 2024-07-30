// This is part of the Core Business Logic
// DO NOT Change & Push this file without Proper testing
// Failure to do so will lead to a reduction in Equity

// Every User who wishes to contact the Agent, must have an account

"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import useSWRMutation from "swr/mutation";
import { useUser } from "@clerk/nextjs";
import { Loader } from "lucide-react";
import { PostFeedBack, PostVehicle } from "@/server/requestLib";
import { FeedBackFormSchema } from "@/server/controllers/feedbackController";

// Lead Form UTILS

export default function FeedBackForm({ userId }: { userId: string }) {
  const user = useUser();
  const form = useForm<z.infer<typeof FeedBackFormSchema>>({
    resolver: zodResolver(FeedBackFormSchema),
    defaultValues: {
      subject: "",
      email: user.user?.primaryEmailAddress?.emailAddress || "",
      message: "Hi there, I have a suggestion/issue.",
      stockId: "",
      userId: userId,
    },
  });

  //   TODO: Test me
  const { trigger: triggerCreate, isMutating: isMutatingCreate } = useSWRMutation("/api/feedback", PostFeedBack /* options */, {
    onError: (error) => {
      console.log("Received Error (Plain): ", error);
      toast.error("Something unexpected happened.", {
        description: "Please try again....",
      });
    },
    onSuccess: (data) => {
      // Show message
      console.log("Data Submitted: ", data);
      toast.success("Your feedback has been delivered 🚚", {
        description: `Thank you for reaching out. I will be in contact with you shortly.`,
        duration: 10000,
      });
    },
  });

  function onSubmit(values: z.infer<typeof FeedBackFormSchema>) {
    console.log(values);
    triggerCreate({ feedback: values });
  }

  return (
    <Card id="LeadForm" className="w-full sm:w-[70%] shadow-lg px-2">
      <CardHeader className="flex justify-center items-center">
        <CardTitle>Send a Feedback</CardTitle>
        <CardDescription>Send me a message with any improvements, and issues you may have.</CardDescription>
      </CardHeader>
      <CardContent>
        {isMutatingCreate ? (
          <div className="w-full h-[30vh] flex justify-center items-center animate-spin">
            <Loader color="blue" />
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Feedback subject" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email address</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Email address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="I'm interested in this property, please contact me."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="stockId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vehicle Stock ID (optional)</FormLabel>
                    <FormControl>
                      <Input type="string" placeholder="Valid stockId to a specific or all vehicles you referncing" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Submit
              </Button>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
}
