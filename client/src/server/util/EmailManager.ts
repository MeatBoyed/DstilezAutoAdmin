// import { MailService } from "@sendgrid/mail";
// import { FeedBackFormSchema } from "@/server/controllers/feedbackController";
// import { z } from "zod";

// export async function SendFeedbackEmail(feedback: z.infer<typeof FeedBackFormSchema>, SENDGRID_API_KEY: string) {
//   const mail = new MailService();
//   mail.setApiKey(SENDGRID_API_KEY);

//   await mail.send({
//     to: ["charliejrcool@gmail.com"],
//     from: "tcs@dstilezauto.co.za",
//     subject: `DS Tilez Auto Admin - ${feedback.subject}`,
//     text: `Meta Data: \nEmail :${feedback.email}\nReferenced StockId: ${feedback.stockId}\nUserId: ${feedback.userId}\n\n\n${feedback.message}`,
//   });
// }
