# INCIDENT REPORT: ItemTotal Calculation Display Issue (UI Component)

**Date:** 2025-09-22
**Severity:** MEDIUM
**Status:** MONITORING
**Reporter:** Claude Code Assistant

## Issue Summary

While the primary itemTotal calculation issue is in the API backend, the YumPOS V2 UI may also be affected if it displays itemTotal values incorrectly during sales processes or receipt previews.

## Problem Details

### Context
- **Primary Issue:** Backend API @AfterLoad hook calculation error (see yumpos-api INCIDENT_REPORT.md)
- **UI Impact:** Any UI components displaying itemTotal may show incorrect values
- **Specific Case:** DF QOD MAXPRIME HAIR MASK showing Rs. 160 instead of Rs. 120

### Affected Areas
1. Sales POS interface (if showing line totals)
2. Receipt preview screens
3. Sales summary displays
4. Checkout/payment screens

## Technical Details

### Current Status
- **UI Repository:** On main branch with latest dynamic tax changes
- **Latest Merge:** PR #61 - feature/dynamic-tax merged
- **UI Calculations:** Should be receiving corrected data from API

### Verification Required

The UI components that may display itemTotal values need verification:

1. **Sales Interface Components**
2. **Receipt Preview Components**
3. **Line Item Display Components**
4. **Summary/Total Components**

## Production Verification Steps

### 1. UI Application Status Check
```bash
# Navigate to production UI directory
cd /path/to/yumpos-ui

# Check current deployment
git branch
git log --oneline -3

# Verify latest dynamic tax changes are deployed
grep -r "itemTotal" src/
```

**Expected Latest Commits:**
- Contains: `1573d0e Merge pull request #61 from yumweb/feature/dynamic-tax`
- Contains: `e8c9e02 fix: use dynamic location taxes instead of static item taxes in sales`

### 2. UI Service Verification
```bash
# Check if UI service is running
pm2 list | grep ui

# Restart UI service if needed
pm2 restart yumpos-ui

# Check for any build/runtime errors
pm2 logs yumpos-ui --lines 30
```

### 3. Frontend Testing Checklist

Access the production UI and test these scenarios:

#### Test Case 1: Sales POS Interface
1. Navigate to sales interface
2. Add DF QOD MAXPRIME HAIR MASK (Rs. 150)
3. Apply 20% discount
4. **Verify line total shows Rs. 120 (not Rs. 160)**

#### Test Case 2: Receipt Preview
1. Complete a test sale with discounted items
2. Preview receipt before finalizing
3. **Verify itemTotal calculations are correct**

#### Test Case 3: API Integration
Check if UI is calling the correct API endpoints:
```javascript
// Browser Developer Tools - Network Tab
// Look for API calls to:
// /sales/receipt/print/[locationId]/[saleId]
// Verify response contains correct itemTotal values
```

### 4. Browser Console Verification
Open browser developer tools and check for:
- JavaScript calculation errors
- API response validation errors
- Console warnings about itemTotal calculations

### 5. Cache Clearing
Ensure browser and CDN caches are cleared:
```bash
# Clear any application cache if applicable
# Restart web server
# Test with hard refresh (Ctrl+F5)
```

## API Integration Dependencies

The UI depends on the backend API for correct itemTotal values:

### Critical API Endpoints
1. **Sales Receipt API:** `/sales/receipt/print/{locationId}/{saleId}`
2. **Sales Data API:** `/sales/{saleId}`
3. **Item Calculation API:** Any endpoints returning SaleItem entities

### Expected API Response Format
```json
{
  "saleItems": [
    {
      "id": "item_id",
      "itemUnitPrice": 150,
      "quantityPurchased": 1,
      "discountPercent": 20,
      "itemTotal": 120  // Must be 120, not 160
    }
  ]
}
```

## UI-Specific Checks

### 1. Component Verification
Check these key UI components for itemTotal display:

```bash
# Search for components using itemTotal
find src/ -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" | xargs grep -l "itemTotal"

# Check for any client-side calculations
grep -r "discountPercent" src/
grep -r "quantity.*price" src/
```

### 2. State Management
Verify that any Redux/Context state properly handles itemTotal:

```bash
# Check state management files
find src/ -name "*store*" -o -name "*reducer*" -o -name "*context*" | xargs grep -l "itemTotal"
```

### 3. API Client Configuration
Ensure API client is pointing to correct backend:

```bash
# Check API configuration
grep -r "api.*studio11" src/
grep -r "localhost:3000" src/
cat src/lib/apiClient.js  # or equivalent API config file
```

## Deployment Status

### ✅ Development Environment
- [x] UI running on localhost:3001
- [x] Connected to localhost:3000 API
- [x] Receiving correct itemTotal values

### ⏳ Production Environment
- [ ] UI application deployed with latest code
- [ ] API integration showing correct itemTotal values
- [ ] No JavaScript errors in browser console
- [ ] Sales interface displays Rs. 120 for test case
- [ ] Receipt previews show correct calculations

## Rollback Plan

If UI issues are discovered:
```bash
# Rollback to previous stable UI deployment
git checkout [previous_stable_commit]
npm run build
pm2 restart yumpos-ui
```

## Monitoring Points

1. **User Reports:** Monitor for customer complaints about incorrect totals in UI
2. **Error Logs:** Watch for JavaScript calculation errors
3. **API Errors:** Monitor for API integration failures
4. **Performance:** Ensure calculation updates don't impact UI performance

## Next Actions for Production Team

1. **Verify UI deployment** is using latest main branch code
2. **Test sales interface** with the specific test case (DF QOD MAXPRIME HAIR MASK)
3. **Confirm API integration** is receiving correct itemTotal values
4. **Clear all caches** and test with fresh browser sessions
5. **Report back** if UI still shows Rs. 160 instead of Rs. 120

---

**Primary Resolution:** Fix backend API calculation (see yumpos-api INCIDENT_REPORT.md)
**Secondary Check:** Ensure UI correctly displays the fixed values from API