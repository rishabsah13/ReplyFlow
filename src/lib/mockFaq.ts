// src/lib/mockFaq.ts

export type Tone = "professional" | "friendly" | "apologetic";

export type MockFaq = {
  id: string;
  keywords: string[]; // lowercase keywords to match
  title: string;
  questionPattern: string; // optional description
  baseResponse: {
    professional: string;
    friendly: string;
    apologetic: string;
  };
};

export const MOCK_FAQ: MockFaq[] = [
  {
    id: "billing-refund",
    keywords: ["refund", "charged", "payment", "billing", "double"],
    title: "Refund / billing issue",
    questionPattern: "Customer was charged incorrectly or wants a refund.",
    baseResponse: {
      professional:
        "Thanks for reaching out about this. We’ve reviewed your billing and can see an unexpected charge. We’ve now reversed the extra amount and the refund will reflect on your original payment method within 5–7 business days. If you notice anything unusual after that, please reply to this message and we’ll be happy to take another look.",
      friendly:
        "Thanks so much for flagging this! We’ve checked your billing and can see the unexpected charge. We’ve gone ahead and reversed the extra amount, and you should see the refund on your original payment method within 5–7 business days. If anything still looks off after that, just reply here and we’ll sort it out together.",
      apologetic:
        "Really sorry for the confusion and frustration this has caused. We’ve reviewed your billing and confirmed there was an incorrect charge. We’ve reversed the extra amount and the refund will show up on your original payment method within 5–7 business days. If it still doesn’t look right after that, please reply directly to this message and we’ll prioritise fixing it.",
    },
  },
  {
    id: "login-issues",
    keywords: ["login", "log in", "sign in", "password", "2fa", "otp"],
    title: "Login / access issue",
    questionPattern: "Customer can’t log in to their account.",
    baseResponse: {
      professional:
        "Thanks for letting us know you’re having trouble logging in. Please try resetting your password using the “Forgot password” link on the sign-in page, and make sure you use the same email address you registered with. If you still can’t access your account after resetting your password, reply to this message with the email address you’re using and we’ll investigate further from our side.",
      friendly:
        "Thanks for reaching out — sorry that logging in has been a hassle! Please try resetting your password using the “Forgot password” link on the sign-in page, and double-check that you’re using the same email you used to sign up. If it still doesn’t work, just hit reply with the email you’re logging in with and we’ll help you get back in.",
      apologetic:
        "Sorry you’re stuck outside your account — that’s never a good experience. Please start by using the “Forgot password” link on the sign-in page, making sure to use the same email you registered with. If you still can’t log in after that, reply to this message with the email you’re using and we’ll manually review your account and restore access.",
    },
  },
  {
    id: "subscription-cancel",
    keywords: ["cancel", "unsubscribe", "subscription", "plan", "downgrade"],
    title: "Cancel or change subscription",
    questionPattern: "Customer wants to cancel or change their plan.",
    baseResponse: {
      professional:
        "Thanks for contacting us about your subscription. You can cancel or change your plan at any time from your billing settings page. Once cancelled, you’ll keep access until the end of your current billing period, and you won’t be charged again. If you prefer, reply to this message and we can process the cancellation for you from our side.",
      friendly:
        "Thanks for reaching out about your subscription. You can cancel or switch plans anytime from your billing settings page. After cancellation, you’ll still have access until the end of your current billing period, and there won’t be any further charges. If you’d like us to handle this for you, just reply here and we’ll take care of it.",
      apologetic:
        "Thanks for letting us know you’d like to change your subscription, and we’re sorry to see you go. You can cancel or update your plan from your billing settings page, and you’ll keep full access until the end of your current billing period with no further charges afterwards. If you’d prefer us to process this manually, reply to this message and we’ll handle it for you right away.",
    },
  },
  {
    id: "feature-request",
    keywords: ["feature", "request", "idea", "suggestion", "feedback"],
    title: "Feature request / suggestion",
    questionPattern:
      "Customer is asking for a new feature or improvement.",
    baseResponse: {
      professional:
        "Thanks for taking the time to share this suggestion. Feedback like this helps us decide what to build next. I’ve logged your request for our product team to review, and while we can’t promise an exact timeline, we’ll factor it into our roadmap. If we release something that covers this use case, we’ll let you know.",
      friendly:
        "Thanks a lot for sharing this idea — we really appreciate it! Feedback like this helps us decide what to build next. I’ve captured your request for our product team, and while we can’t promise a specific date, we’ll definitely keep it in mind as we plan our roadmap. If we ship something that solves this, we’ll be sure to let you know.",
      apologetic:
        "Thanks for sharing this suggestion and sorry that the current experience doesn’t fully cover your workflow. I’ve logged your request with our product team so it’s considered as we plan upcoming improvements. While we can’t commit to a timeline, your feedback is now part of our roadmap discussions, and we’ll let you know if we release something that addresses this need.",
    },
  },
  {
    id: "performance-issues",
    keywords: ["slow", "lag", "loading", "performance", "delay", "timeout"],
    title: "App is slow or not loading",
    questionPattern: "Customer reports that the app is slow or timing out.",
    baseResponse: {
      professional:
        "Thanks for reporting this. We’re sorry the app is running slower than expected. In many cases, a quick refresh or trying an incognito window helps rule out cache issues. If the problem continues, please reply with the approximate time it happened, the page or action you were on, and any error messages, so we can investigate this on our side.",
      friendly:
        "Thanks for flagging this — and sorry things are feeling slow right now. A quick refresh or testing in an incognito window often helps clear out cache issues. If it’s still happening, reply with roughly when you noticed it, what page or action you were on, and any error messages, and we’ll dig into it from our side.",
      apologetic:
        "Sorry the app is running slowly — that’s not the experience we want for you. A quick refresh or trying an incognito window often helps clear out cached data, but if the issue continues, please reply with when it happened, what page or action you were on, and any error messages you saw. That information will help us diagnose and resolve this as quickly as possible.",
    },
  },
  {
    id: "generic-fallback",
    keywords: [],
    title: "Generic fallback",
    questionPattern: "Used when no specific topic matched.",
    baseResponse: {
      professional:
        "Thanks for reaching out. Your message doesn’t match any of our common help topics, so we’ve flagged it for a human representative to review. Someone from our team will get back to you with a personalised response as soon as possible.",
      friendly:
        "Thanks for getting in touch! Your message doesn’t fully match our usual help topics, so we’ve flagged it for one of our team members to review. A human representative will follow up with a personalised reply as soon as possible.",
      apologetic:
        "Thanks for contacting us and sorry we can’t resolve this automatically. Your message doesn’t match our standard help topics, so we’ve escalated it to a human representative. Someone from our team will review your case and reply with a personalised response as soon as possible.",
    },
  },
];