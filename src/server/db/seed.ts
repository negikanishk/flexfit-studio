import { db } from "./index";
import * as schema from "./schema";

export async function seedDatabase() {
  console.log("🌱 Seeding FlexFit Studio database...");

  // Clear existing tables
  await db.delete(schema.transactions);
  await db.delete(schema.waitlists);
  await db.delete(schema.bookings);
  await db.delete(schema.classes);
  await db.delete(schema.trainers);
  await db.delete(schema.members);
  await db.delete(schema.companies);
  await db.delete(schema.memberships);

  // 1. Insert Memberships
  await db.insert(schema.memberships).values([
    {
      id: "mem_tier_basic",
      name: "Basic Tier",
      monthlyPrice: 49.00,
      creditsPerMonth: 4,
      description: "Access to 4 group fitness classes per month.",
    },
    {
      id: "mem_tier_pro",
      name: "Pro Tier",
      monthlyPrice: 99.00,
      creditsPerMonth: 12,
      description: "Access to 12 group classes + priority waitlist.",
    },
    {
      id: "mem_tier_unlimited",
      name: "VIP Unlimited",
      monthlyPrice: 169.00,
      creditsPerMonth: 30,
      description: "Unlimited monthly class credits and front desk perks.",
    },
  ]);

  // 2. Insert Companies (Corporate Credit Pools)
  await db.insert(schema.companies).values([
    {
      id: "comp_acme",
      name: "Acme Corporation",
      creditPoolTotal: 200,
      creditPoolRemaining: 145,
      contactEmail: "hr@acme.com",
    },
    {
      id: "comp_techcorp",
      name: "TechCorp Global",
      creditPoolTotal: 500,
      creditPoolRemaining: 410,
      contactEmail: "wellness@techcorp.io",
    },
  ]);

  // 3. Insert Members
  await db.insert(schema.members).values([
    {
      id: "usr_admin",
      name: "Alex Vance",
      email: "alex@flexfit.com",
      phone: "+1 555-0100",
      role: "admin",
      personalCredits: 50,
      status: "active",
    },
    {
      id: "usr_frontdesk",
      name: "Jordan Lee",
      email: "jordan.frontdesk@flexfit.com",
      phone: "+1 555-0101",
      role: "front_desk",
      personalCredits: 10,
      status: "active",
    },
    {
      id: "usr_trainer_1",
      name: "Coach Marcus Thorne",
      email: "marcus@flexfit.com",
      phone: "+1 555-0102",
      role: "trainer",
      personalCredits: 20,
      status: "active",
    },
    {
      id: "usr_trainer_2",
      name: "Coach Elena Rostova",
      email: "elena@flexfit.com",
      phone: "+1 555-0103",
      role: "trainer",
      personalCredits: 20,
      status: "active",
    },
    {
      id: "usr_member_1",
      name: "Sarah Jenkins",
      email: "sarah.j@example.com",
      phone: "+1 555-0104",
      role: "member",
      membershipId: "mem_tier_pro",
      personalCredits: 8,
      status: "active",
    },
    {
      id: "usr_member_2",
      name: "Michael Chang",
      email: "mchang@acme.com",
      phone: "+1 555-0105",
      role: "member",
      membershipId: "mem_tier_basic",
      personalCredits: 2,
      companyId: "comp_acme",
      status: "active",
    },
    {
      id: "usr_member_3",
      name: "Emma Watson",
      email: "emma.w@techcorp.io",
      phone: "+1 555-0106",
      role: "member",
      membershipId: "mem_tier_unlimited",
      personalCredits: 25,
      companyId: "comp_techcorp",
      status: "active",
    },
    {
      id: "usr_member_4",
      name: "David Kim",
      email: "dkim@example.com",
      phone: "+1 555-0107",
      role: "member",
      membershipId: "mem_tier_basic",
      personalCredits: 1,
      status: "active",
    },
  ]);

  // 4. Insert Trainers
  await db.insert(schema.trainers).values([
    {
      id: "trn_1",
      memberId: "usr_trainer_1",
      specialties: JSON.stringify(["HIIT", "Strength", "Boxing"]),
      bio: "10+ years of high-intensity athletic conditioning and power training.",
      hourlyRate: 65.0,
    },
    {
      id: "trn_2",
      memberId: "usr_trainer_2",
      specialties: JSON.stringify(["Yoga", "Pilates", "Mobility"]),
      bio: "Certified Vinyasa and Reformer Pilates specialist focused on posture and core strength.",
      hourlyRate: 60.0,
    },
  ]);

  // Helper date function for scheduled classes
  const today = new Date();
  const getISO = (offsetDays: number, hour: number) => {
    const d = new Date(today);
    d.setDate(d.getDate() + offsetDays);
    d.setHours(hour, 0, 0, 0);
    return d.toISOString();
  };

  // 5. Insert Classes
  await db.insert(schema.classes).values([
    {
      id: "cls_hiit_morning",
      title: "Sunrise HIIT Blast",
      description: "Fast-paced full body interval workout to start your morning strong.",
      trainerId: "trn_1",
      category: "HIIT",
      capacity: 3, // Intentionally small capacity to demonstrate waitlist!
      creditCost: 1,
      startTime: getISO(0, 8),
      durationMinutes: 45,
      room: "Studio A",
      status: "scheduled",
    },
    {
      id: "cls_yoga_flow",
      title: "Vinyasa Flow & Restore",
      description: "Breath-centered yoga sequence aimed at flexibility and stress relief.",
      trainerId: "trn_2",
      category: "Yoga",
      capacity: 10,
      creditCost: 1,
      startTime: getISO(0, 10),
      durationMinutes: 60,
      room: "Mind & Body Room",
      status: "scheduled",
    },
    {
      id: "cls_strength_evening",
      title: "Heavy Metal Power Lifting",
      description: "Compound lifts focusing on squat, bench, deadlift, and accessory work.",
      trainerId: "trn_1",
      category: "Strength",
      capacity: 8,
      creditCost: 2,
      startTime: getISO(1, 18),
      durationMinutes: 60,
      room: "Iron Zone",
      status: "scheduled",
    },
    {
      id: "cls_pilates_core",
      title: "Core Reformer Pilates",
      description: "Precision core activation and muscle lengthening.",
      trainerId: "trn_2",
      category: "Pilates",
      capacity: 6,
      creditCost: 2,
      startTime: getISO(2, 17),
      durationMinutes: 50,
      room: "Studio B",
      status: "scheduled",
    },
  ]);

  // 6. Insert Bookings (Fill Sunrise HIIT Blast to capacity 3)
  await db.insert(schema.bookings).values([
    {
      id: "bkg_1",
      classId: "cls_hiit_morning",
      memberId: "usr_member_1",
      status: "confirmed",
      paymentType: "personal_credit",
      creditsDeducted: 1,
      bookedAt: new Date().toISOString(),
    },
    {
      id: "bkg_2",
      classId: "cls_hiit_morning",
      memberId: "usr_member_2",
      status: "confirmed",
      paymentType: "corporate_credit",
      creditsDeducted: 1,
      bookedAt: new Date().toISOString(),
    },
    {
      id: "bkg_3",
      classId: "cls_hiit_morning",
      memberId: "usr_member_3",
      status: "confirmed",
      paymentType: "membership_allowance",
      creditsDeducted: 1,
      bookedAt: new Date().toISOString(),
    },
    {
      id: "bkg_4",
      classId: "cls_yoga_flow",
      memberId: "usr_member_1",
      status: "attended",
      paymentType: "personal_credit",
      creditsDeducted: 1,
      checkInTime: new Date().toISOString(),
      bookedAt: new Date().toISOString(),
    },
  ]);

  // 7. Insert Waitlists (Since Sunrise HIIT Blast is full)
  await db.insert(schema.waitlists).values([
    {
      id: "wtl_1",
      classId: "cls_hiit_morning",
      memberId: "usr_member_4",
      position: 1,
      status: "waiting",
      joinedAt: new Date().toISOString(),
    },
  ]);

  // 8. Insert Initial Revenue / Transactions
  await db.insert(schema.transactions).values([
    {
      id: "txn_1",
      memberId: "usr_member_1",
      type: "membership_renewal",
      amount: 99.0,
      credits: 12,
      description: "Pro Tier Monthly Membership Renewal",
    },
    {
      id: "txn_2",
      companyId: "comp_acme",
      type: "corporate_grant",
      amount: 2000.0,
      credits: 200,
      description: "Acme Corporation Corporate Wellness Credit Purchase",
    },
    {
      id: "txn_3",
      memberId: "usr_member_3",
      type: "membership_renewal",
      amount: 169.0,
      credits: 30,
      description: "VIP Unlimited Monthly Membership Renewal",
    },
    {
      id: "txn_4",
      memberId: "usr_member_4",
      type: "credit_purchase",
      amount: 25.0,
      credits: 5,
      description: "Purchased 5 FlexCredits Pack",
    },
  ]);

  console.log("✅ FlexFit Studio database successfully seeded!");
}

// Run seed if executed directly
if (require.main === module) {
  seedDatabase().catch((err) => {
    console.error("❌ Error seeding database:", err);
    process.exit(1);
  });
}
