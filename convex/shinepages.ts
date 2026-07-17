/**
 * ShinePages API proxy action.
 * Runs server-side in Convex to avoid CORS issues from the browser.
 */
import { v } from "convex/values";
import { action } from "./_generated/server";

declare const process: { env: Record<string, string | undefined> };

const SHINEPAGES_BASE_URL = "https://theunapologeticpen.com/api/site";
const HONESTY_INVENTORY_LIST_ID = 97529292;

// Tier-specific subscriber list IDs
const TIER_LIST_IDS: Record<string, number> = {
  "honesty-tier-1": 99124234,
  "honesty-tier-2": 99124321,
  "honesty-tier-3": 99124412,
  "honesty-tier-4": 99124500,
};

export const createContact = action({
  args: {
    name: v.string(),
    email: v.string(),
    tier: v.string(), // e.g. "honesty-tier-1"
    totalScore: v.number(),
  },
  returns: v.object({ success: v.boolean(), contactId: v.optional(v.number()) }),
  handler: async (_ctx, { name, email, tier, totalScore }) => {
    const apiKey = process.env.SHINEPAGES_API_KEY;
    if (!apiKey) throw new Error("ShinePages API key not configured");

    // First check if contact already exists
    const searchRes = await fetch(
      `${SHINEPAGES_BASE_URL}/contacts/search-by-email?email=${encodeURIComponent(email)}`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "User-Agent": "Viktor/1.0",
        },
      }
    );

    if (searchRes.ok) {
      const existing = await searchRes.json() as { id?: number; tags?: string[]; subscriberLists?: number[] };
      if (existing?.id) {
        // Contact exists — merge in the new tier tag + quiz lists and PUT
        const existingTags = existing.tags ?? [];
        const existingLists = existing.subscriberLists ?? [];
        const newTags = [tier, "Quiz Lead"].filter(t => !existingTags.includes(t));
        const newLists = [HONESTY_INVENTORY_LIST_ID, TIER_LIST_IDS[tier]].filter(
          (id): id is number => Boolean(id) && !existingLists.includes(id)
        );

        const updateRes = await fetch(`${SHINEPAGES_BASE_URL}/contacts/${existing.id}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
            "User-Agent": "Viktor/1.0",
          },
          body: JSON.stringify({
            tags: [...existingTags, ...newTags],
            subscriberLists: [...existingLists, ...newLists],
            subscribed: true,
            note: `Honesty Inventory Score: ${totalScore} | Tier: ${tier}`,
          }),
        });

        if (!updateRes.ok) {
          const text = await updateRes.text();
          throw new Error(`ShinePages update error ${updateRes.status}: ${text}`);
        }

        return { success: true, contactId: existing.id };
      }
    }

    // Create new contact with tier tag + subscriber list
    const response = await fetch(`${SHINEPAGES_BASE_URL}/contacts`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "User-Agent": "Viktor/1.0",
      },
      body: JSON.stringify({
        name,
        email,
        tags: [tier, "Quiz Lead"],
        subscriberLists: [HONESTY_INVENTORY_LIST_ID, TIER_LIST_IDS[tier]].filter(Boolean),
        subscribed: true,
        note: `Honesty Inventory Score: ${totalScore} | Tier: ${tier}`,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`ShinePages error ${response.status}: ${text}`);
    }

    const contact = await response.json() as { id?: number };
    return { success: true, contactId: contact.id };
  },
});
