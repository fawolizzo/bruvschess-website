window.BRUVSCHESS_PAYMENTS = {
  services: {
    privateCoaching: {
      serviceName: "In-Person Private Coaching",
      paymentUrl: "https://paystack.shop/pay/bruvschess-coaching",
      packages: [
        {
          name: "Single Private Coaching Session",
          label: "Single lesson",
          sessions: 1,
          price: 40000,
          description: "A focused one-on-one coaching session after the learner's needs, location, and schedule are confirmed."
        },
        {
          name: "5-Session Private Coaching Package",
          label: "5 sessions",
          sessions: 5,
          price: 180000,
          description: "A short coaching package for steady improvement across five scheduled private sessions."
        },
        {
          name: "10-Session Private Coaching Package",
          label: "10 sessions",
          sessions: 10,
          price: 330000,
          description: "A deeper coaching package for sustained progress, structured practice, and longer-term development."
        }
      ]
    },
    onlineCoaching: {
      serviceName: "Online Chess Coaching",
      paymentUrl: "https://paystack.shop/pay/bruvschess-online-coaching",
      packages: [
        {
          name: "Single Online Lesson",
          label: "Single lesson",
          sessions: 1,
          price: 30000,
          description: "A focused online coaching session for learners who want flexible chess instruction from home."
        },
        {
          name: "Five Pack",
          label: "5 sessions",
          sessions: 5,
          price: 135000,
          description: "A five-session online package for learners who want consistent practice and guided progress."
        },
        {
          name: "Ten Pack",
          label: "10 sessions",
          sessions: 10,
          price: 240000,
          description: "A ten-session online package for deeper development, review, practice, and steady improvement."
        },
        {
          name: "Family Group Lesson",
          label: "Family group",
          sessions: 1,
          price: 40000,
          priceSuffix: "per 1-hour session",
          description: "A shared online coaching session for family members learning together."
        }
      ]
    }
  }
};
