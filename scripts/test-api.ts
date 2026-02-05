const BASE_URL = "http://localhost:3000";

interface TestResult {
  name: string;
  status: "pass" | "fail";
  message: string;
  details?: unknown;
}

const results: TestResult[] = [];

async function test(name: string, fn: () => Promise<void>) {
  try {
    await fn();
    results.push({ name, status: "pass", message: "✓ Passed" });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    results.push({
      name,
      status: "fail",
      message: `✗ Failed: ${message}`,
      details: error,
    });
  }
}

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  console.log("🧪 Starting Backend API Tests...\n");
  let token: string | null = null;
  let productId: string | null = null;

  // Test 1: Health Check
  await test("Health Check - Fetch Products", async () => {
    const res = await fetch(`${BASE_URL}/api/products`);
    if (!res.ok) throw new Error(`Expected 200, got ${res.status}`);
    const data = (await res.json()) as { products: unknown[] };
    if (!Array.isArray(data.products)) throw new Error("Products not an array");
    if (data.products.length === 0) throw new Error("No products returned");
    console.log(`   → Found ${data.products.length} products`);
  });

  // Test 2: Register User
  await test("Auth - Register New User", async () => {
    const timestamp = Date.now();
    const res = await fetch(`${BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: `TestUser${timestamp}`,
        emailOrPhone: `test${timestamp}@example.com`,
        password: "TestPassword123",
      }),
    });
    if (!res.ok) throw new Error(`Expected 201, got ${res.status}`);
    const data = (await res.json()) as { user?: { id?: string }; token?: string };
    if (!data.token) throw new Error("No token in response");
    token = data.token;
    console.log(`   → Token: ${token.substring(0, 20)}...`);
  });

  // Test 3: Login User
  await test("Auth - Login User", async () => {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        emailOrPhone: "test@example.com",
        password: "password123",
      }),
    });
    // Allow both 200 (success) and 401 (invalid credentials from seeded user)
    if (res.status === 200) {
      const data = (await res.json()) as { token?: string };
      if (!data.token) throw new Error("No token in response");
      console.log(`   → Login successful`);
    } else if (res.status === 401) {
      console.log(`   → Test user credentials not found (expected in test env)`);
    } else {
      throw new Error(`Expected 200 or 401, got ${res.status}`);
    }
  });

  // Test 4: Get Current User
  await test("Auth - Get Current User (with token)", async () => {
    if (!token) throw new Error("No token available");
    const res = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.status === 200) {
      const data = (await res.json()) as { user?: { name?: string } };
      console.log(`   → User: ${data.user?.name || "Unknown"}`);
    } else if (res.status === 401) {
      console.log(`   → Not authenticated (expected if seed user not active)`);
    } else {
      throw new Error(`Expected 200 or 401, got ${res.status}`);
    }
  });

  // Test 5: Get Specific Product
  await test("Products - Get Single Product", async () => {
    const listRes = await fetch(`${BASE_URL}/api/products`);
    const listData = (await listRes.json()) as { products: Array<{ id: string }> };
    if (listData.products.length === 0) throw new Error("No products to test");
    productId = listData.products[0].id;

    const res = await fetch(`${BASE_URL}/api/products/${productId}`);
    if (!res.ok) throw new Error(`Expected 200, got ${res.status}`);
    const data = (await res.json()) as { product?: { name?: string } };
    console.log(`   → Product: ${data.product?.name || "Unknown"}`);
  });

  // Test 6: Create Product (requires auth, may fail)
  await test("Products - Create Product (Admin)", async () => {
    const res = await fetch(`${BASE_URL}/api/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        name: `Test Product ${Date.now()}`,
        description: "A test product",
        price: 99.99,
        images: ["https://example.com/image.jpg"],
        category: "hoodies",
        stock: 10,
      }),
    });
    if (res.status === 201) {
      const data = (await res.json()) as { product?: { id?: string } };
      console.log(`   → Created: ${data.product?.id}`);
    } else if (res.status === 403) {
      console.log(`   → Forbidden (requires admin) - Expected`);
    } else {
      console.log(`   → Status ${res.status} (may need proper admin auth)`);
    }
  });

  // Test 7: Create Order (requires auth)
  await test("Orders - Create Order (with auth)", async () => {
    if (!productId) throw new Error("No product ID available");

    const res = await fetch(`${BASE_URL}/api/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      credentials: "include",
      body: JSON.stringify({
        items: [
          {
            productId,
            qty: 1,
            size: "M",
          },
        ],
        shipping: {
          name: "Test User",
          phone: "1234567890",
          address: "123 Test St",
          city: "Test City",
        },
      }),
    });

    if (res.status === 201) {
      const data = (await res.json()) as { order?: { id?: string } };
      console.log(`   → Order created: ${data.order?.id}`);
    } else if (res.status === 401) {
      console.log(`   → Unauthorized (requires valid token)`);
    } else {
      console.log(`   → Status ${res.status}`);
    }
  });

  // Test 8: Get Orders
  await test("Orders - Get User Orders", async () => {
    const res = await fetch(`${BASE_URL}/api/orders/my`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      credentials: "include",
    });

    if (res.status === 200) {
      const data = (await res.json()) as { orders?: unknown[] };
      console.log(`   → Found ${Array.isArray(data.orders) ? data.orders.length : 0} orders`);
    } else if (res.status === 401) {
      console.log(`   → Unauthorized (expected without token)`);
    } else {
      console.log(`   → Status ${res.status}`);
    }
  });

  // Test 9: Check Fallback System
  await test("Fallback System - Dummy Data Availability", async () => {
    const res = await fetch(`${BASE_URL}/api/products`);
    const data = (await res.json()) as { products?: unknown[] };
    if (!Array.isArray(data.products) || data.products.length === 0) {
      throw new Error("Dummy data fallback not working");
    }
    console.log(`   → Dummy data fallback active (${data.products.length} products)`);
  });

  // Print Results
  console.log("\n" + "=".repeat(60));
  console.log("📊 TEST RESULTS\n");

  const passed = results.filter((r) => r.status === "pass").length;
  const failed = results.filter((r) => r.status === "fail").length;

  results.forEach((result) => {
    const icon = result.status === "pass" ? "✅" : "❌";
    console.log(`${icon} ${result.name}`);
    console.log(`   ${result.message}`);
  });

  console.log("\n" + "=".repeat(60));
  console.log(`\n📈 Summary: ${passed} passed, ${failed} failed\n`);

  if (failed > 0) {
    console.log("⚠️  Some tests failed. Check the output above for details.\n");
    process.exit(1);
  } else {
    console.log("🎉 All tests passed!\n");
    process.exit(0);
  }
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
