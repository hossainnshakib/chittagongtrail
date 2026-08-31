import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { adminNavigation, adminUtilityItems } from "../components/admin/navigation";

describe("Admin Navigation Tests", () => {
  describe("Navigation Definition", () => {
    it("contains correct top-level groups", () => {
      const groupLabels = adminNavigation.map((g) => g.label);
      assert.deepStrictEqual(groupLabels, ["", "Content", "Media", "Homepage", "Site Settings"]);
    });

    it("has Dashboard as first item in first group", () => {
      const firstGroup = adminNavigation[0];
      assert.equal(firstGroup.items[0].label, "Dashboard");
      assert.equal(firstGroup.items[0].href, "/admin");
    });

    it("has Trails under Content group", () => {
      const contentGroup = adminNavigation.find((g) => g.label === "Content");
      assert.ok(contentGroup);
      const trailsItem = contentGroup.items.find((i) => i.label === "Trails");
      assert.ok(trailsItem);
      assert.equal(trailsItem.href, "/admin/trails");
    });

    it("has Journal under Content group", () => {
      const contentGroup = adminNavigation.find((g) => g.label === "Content");
      assert.ok(contentGroup);
      const journalItem = contentGroup.items.find((i) => i.label === "Journal");
      assert.ok(journalItem);
      assert.equal(journalItem.href, "/admin/journal");
    });

    it("has Food as enabled under Content group", () => {
      const contentGroup = adminNavigation.find((g) => g.label === "Content");
      assert.ok(contentGroup);
      const foodItem = contentGroup.items.find((i) => i.label === "Food");
      assert.ok(foodItem);
      assert.notEqual(foodItem.disabled, true);
      assert.equal(foodItem.href, "/admin/food");
    });

    it("has Media Library under Media group", () => {
      const mediaGroup = adminNavigation.find((g) => g.label === "Media");
      assert.ok(mediaGroup);
      const mediaItem = mediaGroup.items.find((i) => i.label === "Media Library");
      assert.ok(mediaItem);
      assert.equal(mediaItem.href, "/admin/media");
    });

    it("has Homepage group with all sub-items disabled", () => {
      const homepageGroup = adminNavigation.find((g) => g.label === "Homepage");
      assert.ok(homepageGroup);
      assert.equal(homepageGroup.items.length, 7);
      homepageGroup.items.forEach((item) => {
        assert.equal(item.disabled, true, `${item.label} should be disabled`);
        assert.ok(item.tooltip, `${item.label} should have a tooltip`);
      });
    });

    it("has General Settings under Site Settings group", () => {
      const settingsGroup = adminNavigation.find((g) => g.label === "Site Settings");
      assert.ok(settingsGroup);
      const generalItem = settingsGroup.items.find((i) => i.label === "General");
      assert.ok(generalItem);
      assert.equal(generalItem.href, "/admin/settings");
      assert.notEqual(generalItem.disabled, true);
    });

    it("has future Site Settings sub-items disabled", () => {
      const settingsGroup = adminNavigation.find((g) => g.label === "Site Settings");
      assert.ok(settingsGroup);
      const futureItems = settingsGroup.items.filter((i) => i.label !== "General");
      futureItems.forEach((item) => {
        assert.equal(item.disabled, true, `${item.label} should be disabled`);
      });
    });
  });

  describe("Utility Items", () => {
    it("contains View Site and Logout", () => {
      const labels = adminUtilityItems.map((i) => i.label);
      assert.ok(labels.includes("View Site"));
      assert.ok(labels.includes("Logout"));
    });

    it("View Site links to root", () => {
      const viewSite = adminUtilityItems.find((i) => i.label === "View Site");
      assert.ok(viewSite);
      assert.equal(viewSite.href, "/");
    });

    it("Logout has no href (handled by button)", () => {
      const logout = adminUtilityItems.find((i) => i.label === "Logout");
      assert.ok(logout);
      assert.equal(logout.href, undefined);
    });
  });

  describe("Disabled Items Not Broken Links", () => {
    it("all disabled items have no functional href or are marked disabled", () => {
      adminNavigation.forEach((group) => {
        group.items.forEach((item) => {
          if (item.disabled) {
            assert.equal(item.disabled, true, `${item.label} is disabled`);
          }
        });
      });
    });

    it("all disabled items have tooltips explaining unavailability", () => {
      adminNavigation.forEach((group) => {
        group.items.forEach((item) => {
          if (item.disabled) {
            assert.ok(
              item.tooltip && item.tooltip.length > 0,
              `${item.label} should have a tooltip when disabled`
            );
          }
        });
      });
    });
  });

  describe("Route Coverage", () => {
    it("every non-disabled item has a valid href", () => {
      adminNavigation.forEach((group) => {
        group.items.forEach((item) => {
          if (!item.disabled) {
            assert.ok(item.href, `${item.label} should have an href`);
            assert.ok(item.href.startsWith("/admin"), `${item.label} href should start with /admin`);
          }
        });
      });
    });

    it("all existing routes are represented", () => {
      const allHrefs = adminNavigation
        .flatMap((g) => g.items)
        .filter((i) => !i.disabled)
        .map((i) => i.href);
      assert.ok(allHrefs.includes("/admin"), "Dashboard route exists");
      assert.ok(allHrefs.includes("/admin/trails"), "Trails route exists");
      assert.ok(allHrefs.includes("/admin/journal"), "Journal route exists");
      assert.ok(allHrefs.includes("/admin/food"), "Food route exists");
      assert.ok(allHrefs.includes("/admin/media"), "Media route exists");
      assert.ok(allHrefs.includes("/admin/settings"), "Settings route exists");
    });
  });
});
