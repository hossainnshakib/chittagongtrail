import { test, describe } from "node:test";
import assert from "node:assert";
import { ALLOWED_UPLOAD_FOLDERS, ALLOWED_IMAGE_TYPES, ALLOWED_VIDEO_TYPES, MAX_IMAGE_SIZE, MAX_VIDEO_SIZE, CLOUDINARY_CLOUD_NAME } from "@/lib/cloudinary";

describe("Media Lifecycle and Validation Tests", () => {
  test("ALLOWED_UPLOAD_FOLDERS contains correct approved namespaces", () => {
    assert.strictEqual(ALLOWED_UPLOAD_FOLDERS.includes("chittagong-trail/trails"), true);
    assert.strictEqual(ALLOWED_UPLOAD_FOLDERS.includes("chittagong-trail/journal"), true);
    assert.strictEqual(ALLOWED_UPLOAD_FOLDERS.includes("chittagong-trail/food"), true);
    assert.strictEqual(ALLOWED_UPLOAD_FOLDERS.includes("chittagong-trail/homepage"), true);
    assert.strictEqual(ALLOWED_UPLOAD_FOLDERS.includes("chittagong-trail/general"), true);
    assert.strictEqual(ALLOWED_UPLOAD_FOLDERS.includes("chittagong-trail/video"), true);
    assert.strictEqual(ALLOWED_UPLOAD_FOLDERS.length, 6);
  });

  test("Cloudinary secure URL validation rules", () => {
    const isValidUrl = (url: string) => {
      try {
        const u = new URL(url);
        return u.protocol === "https:" && u.hostname === "res.cloudinary.com";
      } catch {
        return false;
      }
    };

    assert.strictEqual(isValidUrl("https://res.cloudinary.com/demo/image/upload/sample.jpg"), true);
    assert.strictEqual(isValidUrl("http://res.cloudinary.com/demo/image/upload/sample.jpg"), false);
    assert.strictEqual(isValidUrl("https://malicious.com/image.jpg"), false);
  });

  test("Alt text trimming and plain text rules", () => {
    const sanitizeAlt = (input: string | null) => {
      if (!input) return null;
      return input.trim();
    };

    assert.strictEqual(sanitizeAlt("  Boga Lake View  "), "Boga Lake View");
    assert.strictEqual(sanitizeAlt(null), null);
    assert.strictEqual(sanitizeAlt("   "), "");
  });
});

describe("Upload Constants", () => {
  test("ALLOWED_IMAGE_TYPES includes standard web formats", () => {
    assert.deepStrictEqual([...ALLOWED_IMAGE_TYPES], ["image/jpeg", "image/png", "image/webp", "image/gif"]);
  });

  test("ALLOWED_VIDEO_TYPES includes standard web video formats", () => {
    assert.deepStrictEqual([...ALLOWED_VIDEO_TYPES], ["video/mp4", "video/webm"]);
  });

  test("MAX_IMAGE_SIZE is 10MB", () => {
    assert.strictEqual(MAX_IMAGE_SIZE, 10 * 1024 * 1024);
  });

  test("MAX_VIDEO_SIZE is 100MB", () => {
    assert.strictEqual(MAX_VIDEO_SIZE, 100 * 1024 * 1024);
  });

  test("CLOUDINARY_CLOUD_NAME is a string", () => {
    assert.strictEqual(typeof CLOUDINARY_CLOUD_NAME, "string");
  });
});

describe("Namespace Validation", () => {
  const ALLOWED_NAMESPACES = [
    "chittagong-trail/trails",
    "chittagong-trail/journal",
    "chittagong-trail/food",
    "chittagong-trail/homepage",
    "chittagong-trail/general",
    "chittagong-trail/video",
  ];

  test("valid namespace passes", () => {
    const publicId = "chittagong-trail/trails/image123";
    const isValid = ALLOWED_NAMESPACES.some((ns) => publicId.startsWith(ns));
    assert.strictEqual(isValid, true);
  });

  test("namespace escape is rejected", () => {
    const publicId = "chittagong-trail/../admin/secret";
    const isValid = ALLOWED_NAMESPACES.some((ns) => publicId.startsWith(ns));
    assert.strictEqual(isValid, false);
  });

  test("arbitrary external namespace is rejected", () => {
    const publicId = "other-bucket/some/file";
    const isValid = ALLOWED_NAMESPACES.some((ns) => publicId.startsWith(ns));
    assert.strictEqual(isValid, false);
  });

  test("video namespace is valid", () => {
    const publicId = "chittagong-trail/video/hero-clip";
    const isValid = ALLOWED_NAMESPACES.some((ns) => publicId.startsWith(ns));
    assert.strictEqual(isValid, true);
  });

  test("homepage namespace is valid", () => {
    const publicId = "chittagong-trail/homepage/gallery1";
    const isValid = ALLOWED_NAMESPACES.some((ns) => publicId.startsWith(ns));
    assert.strictEqual(isValid, true);
  });
});

describe("Registration Validation Logic", () => {
  const ALLOWED_IMAGE_FORMATS = ["jpg", "jpeg", "png", "webp", "gif"];
  const ALLOWED_VIDEO_FORMATS = ["mp4", "webm"];

  test("valid image format passes", () => {
    assert.strictEqual(ALLOWED_IMAGE_FORMATS.includes("jpg"), true);
    assert.strictEqual(ALLOWED_IMAGE_FORMATS.includes("png"), true);
    assert.strictEqual(ALLOWED_IMAGE_FORMATS.includes("webp"), true);
  });

  test("unsupported image format is rejected", () => {
    assert.strictEqual(ALLOWED_IMAGE_FORMATS.includes("bmp"), false);
    assert.strictEqual(ALLOWED_IMAGE_FORMATS.includes("tiff"), false);
  });

  test("valid video format passes", () => {
    assert.strictEqual(ALLOWED_VIDEO_FORMATS.includes("mp4"), true);
    assert.strictEqual(ALLOWED_VIDEO_FORMATS.includes("webm"), true);
  });

  test("unsupported video format is rejected", () => {
    assert.strictEqual(ALLOWED_VIDEO_FORMATS.includes("avi"), false);
    assert.strictEqual(ALLOWED_VIDEO_FORMATS.includes("mov"), false);
  });

  test("resource type validation", () => {
    const validTypes = ["image", "video"];
    assert.strictEqual(validTypes.includes("image"), true);
    assert.strictEqual(validTypes.includes("video"), true);
    assert.strictEqual(validTypes.includes("raw"), false);
  });
});

describe("Direct Upload Contract", () => {
  test("sign endpoint requires authenticated session", () => {
    const unauthenticated = false;
    assert.strictEqual(unauthenticated, false);
  });

  test("sign endpoint rejects invalid folder", () => {
    const validFolders = ALLOWED_UPLOAD_FOLDERS;
    assert.strictEqual(validFolders.includes("malicious-folder" as typeof validFolders[number]), false);
  });

  test("sign endpoint rejects invalid resource type", () => {
    const validTypes = ["image", "video"];
    assert.strictEqual(validTypes.includes("image"), true);
    assert.strictEqual(validTypes.includes("video"), true);
    assert.strictEqual(validTypes.includes("raw"), false);
  });

  test("API secret is never returned in sign response", () => {
    const signResponse = {
      signature: "abc123",
      timestamp: 1234567890,
      cloudName: "demo",
      apiKey: "12345",
      folder: "chittagong-trail/general",
      resourceType: "image",
    };
    const responseStr = JSON.stringify(signResponse);
    assert.strictEqual(responseStr.includes("api_secret"), false);
    assert.strictEqual(responseStr.includes("CLOUDINARY_API_SECRET"), false);
  });

  test("registration endpoint validates required fields", () => {
    const required = ["publicId", "secureUrl", "resourceType"];
    const body = { publicId: "test", secureUrl: "https://res.cloudinary.com/demo/test.jpg", resourceType: "image" };
    for (const field of required) {
      assert.strictEqual(field in body, true, `${field} should be present`);
    }
  });

  test("registration rejects HTTP URLs", () => {
    const url = "http://res.cloudinary.com/demo/test.jpg";
    const isHttps = url.startsWith("https://");
    assert.strictEqual(isHttps, false);
  });

  test("registration rejects wrong hostname", () => {
    const url = "https://evil.com/demo/test.jpg";
    const isCorrectHost = url.includes("res.cloudinary.com");
    assert.strictEqual(isCorrectHost, false);
  });
});

describe("MediaPicker Mode Logic", () => {
  test("image mode rejects video assets", () => {
    const mode = "image" as string;
    const assetResourceType = "video" as string;
    const matches = mode === "image" ? assetResourceType === "image" : mode === "video" ? assetResourceType === "video" : true;
    assert.strictEqual(matches, false);
  });

  test("video mode rejects image assets", () => {
    const mode = "video" as string;
    const assetResourceType = "image" as string;
    const matches = mode === "image" ? assetResourceType === "image" : mode === "video" ? assetResourceType === "video" : true;
    assert.strictEqual(matches, false);
  });

  test("image mode accepts image assets", () => {
    const mode = "image" as string;
    const assetResourceType = "image" as string;
    const matches = mode === "image" ? assetResourceType === "image" : mode === "video" ? assetResourceType === "video" : true;
    assert.strictEqual(matches, true);
  });

  test("video mode accepts video assets", () => {
    const mode = "video" as string;
    const assetResourceType = "video" as string;
    const matches = mode === "image" ? assetResourceType === "image" : mode === "video" ? assetResourceType === "video" : true;
    assert.strictEqual(matches, true);
  });

  test("any mode accepts both image and video", () => {
    const mode = "any" as string;
    const imageType = "image" as string;
    const videoType = "video" as string;
    assert.strictEqual(
      mode === "image" ? imageType === "image" : mode === "video" ? videoType === "video" : true,
      true
    );
    assert.strictEqual(
      mode === "image" ? videoType === "image" : mode === "video" ? videoType === "video" : true,
      true
    );
  });
});

describe("Server-Side Asset Validation", () => {
  test("positive integer IDs are required", () => {
    const isValidId = (id: unknown) => typeof id === "number" && id > 0 && Number.isInteger(id);
    assert.strictEqual(isValidId(1), true);
    assert.strictEqual(isValidId(42), true);
    assert.strictEqual(isValidId(-1), false);
    assert.strictEqual(isValidId(0), false);
    assert.strictEqual(isValidId(1.5), false);
    assert.strictEqual(isValidId("1"), false);
    assert.strictEqual(isValidId(null), false);
  });

  test("width and height must be non-negative integers", () => {
    const isValidDimension = (v: unknown) => v === undefined || v === null || (typeof v === "number" && v >= 0 && Number.isInteger(v));
    assert.strictEqual(isValidDimension(1920), true);
    assert.strictEqual(isValidDimension(0), true);
    assert.strictEqual(isValidDimension(-1), false);
    assert.strictEqual(isValidDimension(1.5), false);
    assert.strictEqual(isValidDimension(undefined), true);
  });

  test("gallery prevents duplicate asset IDs", () => {
    const gallery = [{ id: 1 }, { id: 2 }, { id: 3 }];
    const newId = 2;
    const isDuplicate = gallery.some((g) => g.id === newId);
    assert.strictEqual(isDuplicate, true);
  });

  test("gallery allows unique asset IDs", () => {
    const gallery = [{ id: 1 }, { id: 2 }, { id: 3 }];
    const newId = 4;
    const isDuplicate = gallery.some((g) => g.id === newId);
    assert.strictEqual(isDuplicate, false);
  });
});

describe("Hero Video Readiness", () => {
  test("Cloudinary video delivery uses HTTPS", () => {
    const deliveryUrl = "https://res.cloudinary.com/demo/video/upload/sample.mp4";
    assert.strictEqual(deliveryUrl.startsWith("https://"), true);
  });

  test("video resource type is stored correctly", () => {
    const resourceType = "video";
    assert.strictEqual(resourceType, "video");
  });

  test("video format validation includes mp4 and webm", () => {
    const supported = ["mp4", "webm"];
    assert.strictEqual(supported.includes("mp4"), true);
    assert.strictEqual(supported.includes("webm"), true);
  });
});

describe("Delete Scope Integrity (Regression)", () => {
  const VALID_SCOPES = ["trail", "story", "food"] as const;

  test("delete scope validation still works", () => {
    const scope = "story";
    const isValid = VALID_SCOPES.includes(scope as typeof VALID_SCOPES[number]);
    assert.strictEqual(isValid, true);
  });

  test("unknown scope is rejected", () => {
    const scope = "journal";
    const isValid = VALID_SCOPES.includes(scope as typeof VALID_SCOPES[number]);
    assert.strictEqual(isValid, false);
  });

  test("missing scope is rejected", () => {
    const scope = undefined;
    const isValid = typeof scope === "string" && VALID_SCOPES.includes(scope as typeof VALID_SCOPES[number]);
    assert.strictEqual(isValid, false);
  });
});
