import { getAllTranslatedPlans, getTranslatedPlan } from "../../../src/lib/plan-utils";
import { SubscriptionPlan } from "../../../src/lib/stripe";

describe("plan-utils", () => {
  const t = (key: string) => key; // identity translator for test

  it("getTranslatedPlan returns structure for MONTHLY", () => {
    const plan = getTranslatedPlan(SubscriptionPlan.MONTHLY, t as any);
    expect(plan).toHaveProperty("name");
    expect(plan).toHaveProperty("price", 20);
    expect(plan).toHaveProperty("features");
  });

  it("getAllTranslatedPlans returns both plans", () => {
    const plans = getAllTranslatedPlans(t as any);
    expect(Object.keys(plans)).toContain(SubscriptionPlan.MONTHLY);
    expect(Object.keys(plans)).toContain(SubscriptionPlan.YEARLY);
  });
});


