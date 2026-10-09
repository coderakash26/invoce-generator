import { runInvoiceCalculationTests } from "../lib/calculations/__tests__/invoice-calculations.test";

const results = runInvoiceCalculationTests();
let allPassed = true;
console.log("\n=== INVOICE CALCULATION TEST SUITE ===");
results.forEach((r) => {
  if (r.passed) {
    console.log(`✅ PASS: ${r.name}`);
  } else {
    allPassed = false;
    console.error(`❌ FAIL: ${r.name} - ${r.message}`);
  }
});

if (allPassed) {
  console.log(`\n🎉 All ${results.length} calculation tests passed successfully!\n`);
  process.exit(0);
} else {
  console.error("\n❌ Some tests failed.\n");
  process.exit(1);
}
