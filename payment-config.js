window.BRUVSCHESS_PAYMENTS = {
  services: {
    privateCoaching: {
      serviceName: "Private Chess Coaching",
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
    }
  }
};
