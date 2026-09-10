# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: acceptance.spec.ts >> Habit Tracker - Acceptance Checklist >> [3] User can create, edit, and delete habits
- Location: e2e/acceptance.spec.ts:44:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('button:has-text("New Habit")')
    - locator resolved to <button class="btn-primary flex-1 md:flex-none flex items-center justify-center gap-2 font-semibold">…</button>
  - attempting click action
    2 × waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <p class="font-bold text-gray-900">Milestone reached!</p> from <div class="fixed top-4 right-4 z-50 flex flex-col gap-3 max-w-sm pointer-events-none">…</div> subtree intercepts pointer events
    - retrying click action
    - waiting 20ms
    2 × waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <p class="font-bold text-gray-900">Milestone reached!</p> from <div class="fixed top-4 right-4 z-50 flex flex-col gap-3 max-w-sm pointer-events-none">…</div> subtree intercepts pointer events
    - retrying click action
      - waiting 100ms
    - waiting for element to be visible, enabled and stable
    - element is not stable
  8 × retrying click action
      - waiting 500ms
      - waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <div class="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-500 rounded-lg shadow-xl p-4 pointer-events-auto animate-slide-in">…</div> from <div class="fixed top-4 right-4 z-50 flex flex-col gap-3 max-w-sm pointer-events-none">…</div> subtree intercepts pointer events
    - retrying click action
      - waiting 500ms
      - waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <div class="flex items-center gap-2 mb-2">…</div> from <div class="fixed top-4 right-4 z-50 flex flex-col gap-3 max-w-sm pointer-events-none">…</div> subtree intercepts pointer events
    - retrying click action
      - waiting 500ms
      - waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <div class="flex items-center gap-2 mb-2">…</div> from <div class="fixed top-4 right-4 z-50 flex flex-col gap-3 max-w-sm pointer-events-none">…</div> subtree intercepts pointer events
    - retrying click action
      - waiting 500ms
      - waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <div class="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-500 rounded-lg shadow-xl p-4 pointer-events-auto animate-slide-in">…</div> from <div class="fixed top-4 right-4 z-50 flex flex-col gap-3 max-w-sm pointer-events-none">…</div> subtree intercepts pointer events
  - retrying click action
    - waiting 500ms
    - waiting for element to be visible, enabled and stable
    - element is visible, enabled and stable
    - scrolling into view if needed
    - done scrolling
    - <div class="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-500 rounded-lg shadow-xl p-4 pointer-events-auto animate-slide-in">…</div> from <div class="fixed top-4 right-4 z-50 flex flex-col gap-3 max-w-sm pointer-events-none">…</div> subtree intercepts pointer events
  - retrying click action
    - waiting 500ms

```

# Page snapshot

```yaml
- generic [ref=e2]:
  - generic [ref=e4]:
    - generic [ref=e5]:
      - generic [ref=e6]:
        - heading "My Habits" [level=1] [ref=e7]
        - paragraph [ref=e8]: 👤 Demo User • Demo
      - generic [ref=e9]:
        - button "+ New Habit" [ref=e10] [cursor=pointer]:
          - generic [ref=e11]: +
          - generic [ref=e12]: New Habit
        - button "Logout" [ref=e13] [cursor=pointer]
    - generic [ref=e14]:
      - generic [ref=e15]:
        - img [ref=e16]
        - textbox "Search habits..." [ref=e18]
      - combobox [ref=e19]:
        - option "All Statuses" [selected]
        - option "Active"
        - option "Paused"
        - option "Archived"
      - generic [ref=e20] [cursor=pointer]:
        - checkbox "Completed Today" [ref=e21]
        - generic [ref=e22]: Completed Today
    - generic [ref=e23]:
      - 'link "Morning Run Run 5km every morning Active 🔥 0 day ⭐ 0 day # 0 checkins 📍 Check in Today ✏️ Edit 🗑️ Delete" [ref=e25] [cursor=pointer]':
        - /url: /habits/60669fca-7163-4315-90e7-ce7ce880636a
        - generic [ref=e26]:
          - generic [ref=e27]:
            - generic [ref=e28]:
              - heading "Morning Run" [level=3] [ref=e29]
              - paragraph [ref=e30]: Run 5km every morning
            - generic [ref=e31]: Active
          - generic [ref=e32]:
            - generic [ref=e33]:
              - generic [ref=e34]: 🔥
              - paragraph [ref=e35]: "0"
              - paragraph [ref=e36]: day
            - generic [ref=e37]:
              - generic [ref=e38]: ⭐
              - paragraph [ref=e39]: "0"
              - paragraph [ref=e40]: day
            - generic [ref=e41]:
              - generic [ref=e42]: "#"
              - paragraph [ref=e43]: "0"
              - paragraph [ref=e44]: checkins
          - button "📍 Check in Today" [ref=e45]:
            - generic [ref=e46]: 📍
            - generic [ref=e47]: Check in Today
          - generic [ref=e48]:
            - button "✏️ Edit" [ref=e49]
            - button "🗑️ Delete" [ref=e50]
      - 'link "Transition Habit No description Archived 🔥 0 day ⭐ 0 day # 0 checkins 📍 Check in Today ✏️ Edit 🗑️ Delete" [ref=e52] [cursor=pointer]':
        - /url: /habits/7491d924-7b22-42d1-885b-cfe87a0c1683
        - generic [ref=e53]:
          - generic [ref=e54]:
            - generic [ref=e55]:
              - heading "Transition Habit" [level=3] [ref=e56]
              - paragraph [ref=e57]: No description
            - generic [ref=e58]: Archived
          - generic [ref=e59]:
            - generic [ref=e60]:
              - generic [ref=e61]: 🔥
              - paragraph [ref=e62]: "0"
              - paragraph [ref=e63]: day
            - generic [ref=e64]:
              - generic [ref=e65]: ⭐
              - paragraph [ref=e66]: "0"
              - paragraph [ref=e67]: day
            - generic [ref=e68]:
              - generic [ref=e69]: "#"
              - paragraph [ref=e70]: "0"
              - paragraph [ref=e71]: checkins
          - button "📍 Check in Today" [disabled] [ref=e72]:
            - generic [ref=e73]: 📍
            - generic [ref=e74]: Check in Today
          - generic [ref=e75]:
            - button "✏️ Edit" [ref=e76]
            - button "🗑️ Delete" [ref=e77]
      - 'link "Test Habit No description Active 🔥 0 day ⭐ 0 day # 0 checkins 📍 Check in Today ✏️ Edit 🗑️ Delete" [ref=e79] [cursor=pointer]':
        - /url: /habits/8c6a3834-af08-4ce5-910f-77ecefe0fb8d
        - generic [ref=e80]:
          - generic [ref=e81]:
            - generic [ref=e82]:
              - heading "Test Habit" [level=3] [ref=e83]
              - paragraph [ref=e84]: No description
            - generic [ref=e85]: Active
          - generic [ref=e86]:
            - generic [ref=e87]:
              - generic [ref=e88]: 🔥
              - paragraph [ref=e89]: "0"
              - paragraph [ref=e90]: day
            - generic [ref=e91]:
              - generic [ref=e92]: ⭐
              - paragraph [ref=e93]: "0"
              - paragraph [ref=e94]: day
            - generic [ref=e95]:
              - generic [ref=e96]: "#"
              - paragraph [ref=e97]: "0"
              - paragraph [ref=e98]: checkins
          - button "📍 Check in Today" [ref=e99]:
            - generic [ref=e100]: 📍
            - generic [ref=e101]: Check in Today
          - generic [ref=e102]:
            - button "✏️ Edit" [ref=e103]
            - button "🗑️ Delete" [ref=e104]
      - 'link "T6 Habit No description Active 🔥 3 day ⭐ 3 day # 3 checkins ✓ Done Today ✏️ Edit 🗑️ Delete" [ref=e106] [cursor=pointer]':
        - /url: /habits/4c1b8c22-1c0a-4cdf-a09c-8f99b9bc583b
        - generic [ref=e107]:
          - generic [ref=e108]:
            - generic [ref=e109]:
              - heading "T6 Habit" [level=3] [ref=e110]
              - paragraph [ref=e111]: No description
            - generic [ref=e112]: Active
          - generic [ref=e113]:
            - generic [ref=e114]:
              - generic [ref=e115]: 🔥
              - paragraph [ref=e116]: "3"
              - paragraph [ref=e117]: day
            - generic [ref=e118]:
              - generic [ref=e119]: ⭐
              - paragraph [ref=e120]: "3"
              - paragraph [ref=e121]: day
            - generic [ref=e122]:
              - generic [ref=e123]: "#"
              - paragraph [ref=e124]: "3"
              - paragraph [ref=e125]: checkins
          - button "✓ Done Today" [ref=e126]:
            - generic [ref=e127]: ✓
            - generic [ref=e128]: Done Today
          - generic [ref=e129]:
            - button "✏️ Edit" [ref=e130]
            - button "🗑️ Delete" [ref=e131]
      - 'link "Morning Run Run 5km every morning Active 🔥 0 day ⭐ 0 day # 0 checkins 📍 Check in Today ✏️ Edit 🗑️ Delete" [ref=e133] [cursor=pointer]':
        - /url: /habits/c8df85d3-cd34-4565-af30-f82fd68a6545
        - generic [ref=e134]:
          - generic [ref=e135]:
            - generic [ref=e136]:
              - heading "Morning Run" [level=3] [ref=e137]
              - paragraph [ref=e138]: Run 5km every morning
            - generic [ref=e139]: Active
          - generic [ref=e140]:
            - generic [ref=e141]:
              - generic [ref=e142]: 🔥
              - paragraph [ref=e143]: "0"
              - paragraph [ref=e144]: day
            - generic [ref=e145]:
              - generic [ref=e146]: ⭐
              - paragraph [ref=e147]: "0"
              - paragraph [ref=e148]: day
            - generic [ref=e149]:
              - generic [ref=e150]: "#"
              - paragraph [ref=e151]: "0"
              - paragraph [ref=e152]: checkins
          - button "📍 Check in Today" [ref=e153]:
            - generic [ref=e154]: 📍
            - generic [ref=e155]: Check in Today
          - generic [ref=e156]:
            - button "✏️ Edit" [ref=e157]
            - button "🗑️ Delete" [ref=e158]
      - 'link "T7 Habit No description Active 🔥 7 day ⭐ 7 day # 7 checkins ✓ Done Today ✏️ Edit 🗑️ Delete" [ref=e160] [cursor=pointer]':
        - /url: /habits/79634319-cf95-4f57-ae95-5a0d3f2e72d7
        - generic [ref=e161]:
          - generic [ref=e162]:
            - generic [ref=e163]:
              - heading "T7 Habit" [level=3] [ref=e164]
              - paragraph [ref=e165]: No description
            - generic [ref=e166]: Active
          - generic [ref=e167]:
            - generic [ref=e168]:
              - generic [ref=e169]: 🔥
              - paragraph [ref=e170]: "7"
              - paragraph [ref=e171]: day
            - generic [ref=e172]:
              - generic [ref=e173]: ⭐
              - paragraph [ref=e174]: "7"
              - paragraph [ref=e175]: day
            - generic [ref=e176]:
              - generic [ref=e177]: "#"
              - paragraph [ref=e178]: "7"
              - paragraph [ref=e179]: checkins
          - button "✓ Done Today" [ref=e180]:
            - generic [ref=e181]: ✓
            - generic [ref=e182]: Done Today
          - generic [ref=e183]:
            - button "✏️ Edit" [ref=e184]
            - button "🗑️ Delete" [ref=e185]
      - 'link "Paused Habit No description Paused 🔥 0 day ⭐ 0 day # 0 checkins 📍 Check in Today ✏️ Edit 🗑️ Delete" [ref=e187] [cursor=pointer]':
        - /url: /habits/a0c40bda-6577-421c-9436-d33bed5313b5
        - generic [ref=e188]:
          - generic [ref=e189]:
            - generic [ref=e190]:
              - heading "Paused Habit" [level=3] [ref=e191]
              - paragraph [ref=e192]: No description
            - generic [ref=e193]: Paused
          - generic [ref=e194]:
            - generic [ref=e195]:
              - generic [ref=e196]: 🔥
              - paragraph [ref=e197]: "0"
              - paragraph [ref=e198]: day
            - generic [ref=e199]:
              - generic [ref=e200]: ⭐
              - paragraph [ref=e201]: "0"
              - paragraph [ref=e202]: day
            - generic [ref=e203]:
              - generic [ref=e204]: "#"
              - paragraph [ref=e205]: "0"
              - paragraph [ref=e206]: checkins
          - button "📍 Check in Today" [disabled] [ref=e207]:
            - generic [ref=e208]: 📍
            - generic [ref=e209]: Check in Today
          - generic [ref=e210]:
            - button "✏️ Edit" [ref=e211]
            - button "🗑️ Delete" [ref=e212]
      - 'link "T8 Habit No description Active 🔥 30 day ⭐ 30 day # 30 checkins ✓ Done Today ✏️ Edit 🗑️ Delete" [ref=e214] [cursor=pointer]':
        - /url: /habits/a07f8e95-4646-4cc1-b30b-89074017efd1
        - generic [ref=e215]:
          - generic [ref=e216]:
            - generic [ref=e217]:
              - heading "T8 Habit" [level=3] [ref=e218]
              - paragraph [ref=e219]: No description
            - generic [ref=e220]: Active
          - generic [ref=e221]:
            - generic [ref=e222]:
              - generic [ref=e223]: 🔥
              - paragraph [ref=e224]: "30"
              - paragraph [ref=e225]: day
            - generic [ref=e226]:
              - generic [ref=e227]: ⭐
              - paragraph [ref=e228]: "30"
              - paragraph [ref=e229]: day
            - generic [ref=e230]:
              - generic [ref=e231]: "#"
              - paragraph [ref=e232]: "30"
              - paragraph [ref=e233]: checkins
          - button "✓ Done Today" [ref=e234]:
            - generic [ref=e235]: ✓
            - generic [ref=e236]: Done Today
          - generic [ref=e237]:
            - button "✏️ Edit" [ref=e238]
            - button "🗑️ Delete" [ref=e239]
      - 'link "Archived Habit No description Archived 🔥 0 day ⭐ 0 day # 0 checkins 📍 Check in Today ✏️ Edit 🗑️ Delete" [ref=e241] [cursor=pointer]':
        - /url: /habits/a8176aa5-9a8f-4e4e-8c53-cf64e1e3e45b
        - generic [ref=e242]:
          - generic [ref=e243]:
            - generic [ref=e244]:
              - heading "Archived Habit" [level=3] [ref=e245]
              - paragraph [ref=e246]: No description
            - generic [ref=e247]: Archived
          - generic [ref=e248]:
            - generic [ref=e249]:
              - generic [ref=e250]: 🔥
              - paragraph [ref=e251]: "0"
              - paragraph [ref=e252]: day
            - generic [ref=e253]:
              - generic [ref=e254]: ⭐
              - paragraph [ref=e255]: "0"
              - paragraph [ref=e256]: day
            - generic [ref=e257]:
              - generic [ref=e258]: "#"
              - paragraph [ref=e259]: "0"
              - paragraph [ref=e260]: checkins
          - button "📍 Check in Today" [disabled] [ref=e261]:
            - generic [ref=e262]: 📍
            - generic [ref=e263]: Check in Today
          - generic [ref=e264]:
            - button "✏️ Edit" [ref=e265]
            - button "🗑️ Delete" [ref=e266]
      - 'link "Transition Habit No description Archived 🔥 0 day ⭐ 0 day # 0 checkins 📍 Check in Today ✏️ Edit 🗑️ Delete" [ref=e268] [cursor=pointer]':
        - /url: /habits/0c0d8854-e784-4526-97f2-7f0432eb2d4f
        - generic [ref=e269]:
          - generic [ref=e270]:
            - generic [ref=e271]:
              - heading "Transition Habit" [level=3] [ref=e272]
              - paragraph [ref=e273]: No description
            - generic [ref=e274]: Archived
          - generic [ref=e275]:
            - generic [ref=e276]:
              - generic [ref=e277]: 🔥
              - paragraph [ref=e278]: "0"
              - paragraph [ref=e279]: day
            - generic [ref=e280]:
              - generic [ref=e281]: ⭐
              - paragraph [ref=e282]: "0"
              - paragraph [ref=e283]: day
            - generic [ref=e284]:
              - generic [ref=e285]: "#"
              - paragraph [ref=e286]: "0"
              - paragraph [ref=e287]: checkins
          - button "📍 Check in Today" [disabled] [ref=e288]:
            - generic [ref=e289]: 📍
            - generic [ref=e290]: Check in Today
          - generic [ref=e291]:
            - button "✏️ Edit" [ref=e292]
            - button "🗑️ Delete" [ref=e293]
      - 'link "T9 Habit No description Active 🔥 3 day ⭐ 3 day # 3 checkins ✓ Done Today ✏️ Edit 🗑️ Delete" [ref=e295] [cursor=pointer]':
        - /url: /habits/c435346b-ee50-4d6e-a1b7-8522c4262d9a
        - generic [ref=e296]:
          - generic [ref=e297]:
            - generic [ref=e298]:
              - heading "T9 Habit" [level=3] [ref=e299]
              - paragraph [ref=e300]: No description
            - generic [ref=e301]: Active
          - generic [ref=e302]:
            - generic [ref=e303]:
              - generic [ref=e304]: 🔥
              - paragraph [ref=e305]: "3"
              - paragraph [ref=e306]: day
            - generic [ref=e307]:
              - generic [ref=e308]: ⭐
              - paragraph [ref=e309]: "3"
              - paragraph [ref=e310]: day
            - generic [ref=e311]:
              - generic [ref=e312]: "#"
              - paragraph [ref=e313]: "3"
              - paragraph [ref=e314]: checkins
          - button "✓ Done Today" [ref=e315]:
            - generic [ref=e316]: ✓
            - generic [ref=e317]: Done Today
          - generic [ref=e318]:
            - button "✏️ Edit" [ref=e319]
            - button "🗑️ Delete" [ref=e320]
      - 'link "Ownership Test Habit No description Active 🔥 0 day ⭐ 0 day # 0 checkins 📍 Check in Today ✏️ Edit 🗑️ Delete" [ref=e322] [cursor=pointer]':
        - /url: /habits/127ae438-893b-4dba-9d5d-ec15921694ab
        - generic [ref=e323]:
          - generic [ref=e324]:
            - generic [ref=e325]:
              - heading "Ownership Test Habit" [level=3] [ref=e326]
              - paragraph [ref=e327]: No description
            - generic [ref=e328]: Active
          - generic [ref=e329]:
            - generic [ref=e330]:
              - generic [ref=e331]: 🔥
              - paragraph [ref=e332]: "0"
              - paragraph [ref=e333]: day
            - generic [ref=e334]:
              - generic [ref=e335]: ⭐
              - paragraph [ref=e336]: "0"
              - paragraph [ref=e337]: day
            - generic [ref=e338]:
              - generic [ref=e339]: "#"
              - paragraph [ref=e340]: "0"
              - paragraph [ref=e341]: checkins
          - button "📍 Check in Today" [ref=e342]:
            - generic [ref=e343]: 📍
            - generic [ref=e344]: Check in Today
          - generic [ref=e345]:
            - button "✏️ Edit" [ref=e346]
            - button "🗑️ Delete" [ref=e347]
  - generic:
    - generic [ref=e349]:
      - generic [ref=e350]:
        - generic [ref=e351]:
          - generic [ref=e352]: 🎉
          - paragraph [ref=e353]: Milestone reached!
        - paragraph [ref=e354]:
          - text: Your habit
          - generic [ref=e355]: "'T6 Habit'"
          - text: hit a
          - generic [ref=e356]: 3-day streak!
        - paragraph [ref=e357]: 🔥 3 days and counting
      - button "Dismiss notification" [ref=e358] [cursor=pointer]:
        - img [ref=e359]
    - generic [ref=e362]:
      - generic [ref=e363]:
        - generic [ref=e364]:
          - generic [ref=e365]: 🎉
          - paragraph [ref=e366]: Milestone reached!
        - paragraph [ref=e367]:
          - text: Your habit
          - generic [ref=e368]: "'T7 Habit'"
          - text: hit a
          - generic [ref=e369]: 3-day streak!
        - paragraph [ref=e370]: 🔥 7 days and counting
      - button "Dismiss notification" [ref=e371] [cursor=pointer]:
        - img [ref=e372]
    - generic [ref=e375]:
      - generic [ref=e376]:
        - generic [ref=e377]:
          - generic [ref=e378]: 🎉
          - paragraph [ref=e379]: Milestone reached!
        - paragraph [ref=e380]:
          - text: Your habit
          - generic [ref=e381]: "'T7 Habit'"
          - text: hit a
          - generic [ref=e382]: 7-day streak!
        - paragraph [ref=e383]: 🔥 7 days and counting
      - button "Dismiss notification" [ref=e384] [cursor=pointer]:
        - img [ref=e385]
    - generic [ref=e388]:
      - generic [ref=e389]:
        - generic [ref=e390]:
          - generic [ref=e391]: 🎉
          - paragraph [ref=e392]: Milestone reached!
        - paragraph [ref=e393]:
          - text: Your habit
          - generic [ref=e394]: "'T8 Habit'"
          - text: hit a
          - generic [ref=e395]: 3-day streak!
        - paragraph [ref=e396]: 🔥 30 days and counting
      - button "Dismiss notification" [ref=e397] [cursor=pointer]:
        - img [ref=e398]
    - generic [ref=e401]:
      - generic [ref=e402]:
        - generic [ref=e403]:
          - generic [ref=e404]: 🎉
          - paragraph [ref=e405]: Milestone reached!
        - paragraph [ref=e406]:
          - text: Your habit
          - generic [ref=e407]: "'T8 Habit'"
          - text: hit a
          - generic [ref=e408]: 7-day streak!
        - paragraph [ref=e409]: 🔥 30 days and counting
      - button "Dismiss notification" [ref=e410] [cursor=pointer]:
        - img [ref=e411]
    - generic [ref=e414]:
      - generic [ref=e415]:
        - generic [ref=e416]:
          - generic [ref=e417]: 🎉
          - paragraph [ref=e418]: Milestone reached!
        - paragraph [ref=e419]:
          - text: Your habit
          - generic [ref=e420]: "'T8 Habit'"
          - text: hit a
          - generic [ref=e421]: 30-day streak!
        - paragraph [ref=e422]: 🔥 30 days and counting
      - button "Dismiss notification" [ref=e423] [cursor=pointer]:
        - img [ref=e424]
    - generic [ref=e427]:
      - generic [ref=e428]:
        - generic [ref=e429]:
          - generic [ref=e430]: 🎉
          - paragraph [ref=e431]: Milestone reached!
        - paragraph [ref=e432]:
          - text: Your habit
          - generic [ref=e433]: "'T9 Habit'"
          - text: hit a
          - generic [ref=e434]: 3-day streak!
        - paragraph [ref=e435]: 🔥 3 days and counting
      - button "Dismiss notification" [ref=e436] [cursor=pointer]:
        - img [ref=e437]
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | test.describe('Habit Tracker - Acceptance Checklist', () => {
  4   |   test.beforeEach(async ({ page }) => {
  5   |     // Start fresh for each test
  6   |     await page.goto('http://localhost:5173');
  7   |   });
  8   | 
  9   |   // Test 1: Demo login works (simulates SSO flow)
  10  |   test('[1] User can sign in with demo account (simulates SSO)', async ({ page }) => {
  11  |     // Should see login page
  12  |     await expect(page.locator('button:has-text("Demo Login")')).toBeVisible();
  13  | 
  14  |     // Click demo login
  15  |     await page.locator('button:has-text("Demo Login")').click();
  16  | 
  17  |     // Should redirect to dashboard
  18  |     await page.waitForURL('**/');
  19  |     await expect(page.locator('h1:has-text("My Habits")')).toBeVisible();
  20  | 
  21  |     // Should show user info
  22  |     const userInfo = page.locator('text=/👤.*Demo/');
  23  |     await expect(userInfo).toBeVisible();
  24  |   });
  25  | 
  26  |   // Test 2: Local user record is created on sign-in
  27  |   test('[2] User record created automatically on first SSO', async ({ page }) => {
  28  |     // Login first
  29  |     await page.locator('button:has-text("Demo Login")').click();
  30  |     await page.waitForURL('**/');
  31  | 
  32  |     // After login, /auth/me should return user profile
  33  |     const response = await page.evaluate(() =>
  34  |       fetch('http://localhost:3000/api/auth/me', { credentials: 'include' })
  35  |         .then(r => r.json())
  36  |     );
  37  | 
  38  |     expect(response.id).toBeDefined();
  39  |     expect(response.displayName).toBeDefined();
  40  |     expect(response.email).toBeDefined();
  41  |   });
  42  | 
  43  |   // Test 3: Create, edit, delete habits
  44  |   test('[3] User can create, edit, and delete habits', async ({ page }) => {
  45  |     // Login first
  46  |     await page.locator('button:has-text("Demo Login")').click();
  47  |     await page.waitForURL('**/');
  48  | 
  49  |     // Create habit
> 50  |     await page.locator('button:has-text("New Habit")').click();
      |                                                        ^ Error: locator.click: Test timeout of 30000ms exceeded.
  51  |     await page.waitForTimeout(500); // Wait for modal to appear
  52  |     await page.locator('input[placeholder="e.g., Morning Run"]').fill('E2E Test Habit');
  53  |     const descInput = page.locator('input[placeholder="Optional description"]');
  54  |     if (await descInput.isVisible({ timeout: 2000 }).catch(() => false)) {
  55  |       await descInput.fill('Test description');
  56  |     }
  57  |     await page.locator('button:has-text("Create")').click();
  58  | 
  59  |     // Wait for habit to appear in the list (target href link, not form input)
  60  |     await page.waitForSelector('[href*="/habits/"]');
  61  |     const habitLink = page.locator('[href*="/habits/"]').filter({ hasText: 'E2E Test Habit' }).first();
  62  |     await expect(habitLink).toBeVisible();
  63  | 
  64  |     // Edit habit - click edit button for this specific habit
  65  |     const habitCard = habitLink.locator('..');
  66  |     const editButton = habitCard.locator('button:has-text("Edit")');
  67  |     await editButton.click();
  68  | 
  69  |     // Wait for modal to open and input field to be visible
  70  |     const habitNameInput = page.locator('input[placeholder="e.g., Morning Run"]').first();
  71  |     await habitNameInput.waitFor({ state: 'visible', timeout: 5000 });
  72  |     await page.waitForTimeout(200);
  73  | 
  74  |     // Clear and fill new name
  75  |     await habitNameInput.fill('');
  76  |     await habitNameInput.fill('E2E Test Habit Updated');
  77  |     await page.waitForTimeout(300);
  78  | 
  79  |     // Wait for and click Save button (not Update - the modal uses Save for edit)
  80  |     const saveButton = page.locator('button:has-text("Save")');
  81  |     await saveButton.waitFor({ state: 'visible', timeout: 5000 });
  82  |     await saveButton.click();
  83  |     await page.waitForTimeout(500);
  84  | 
  85  |     // Verify edit by finding the updated link
  86  |     const updatedLink = page.locator('[href*="/habits/"]').filter({ hasText: 'E2E Test Habit Updated' }).first();
  87  |     await expect(updatedLink).toBeVisible();
  88  | 
  89  |     // Delete habit
  90  |     const updatedCard = updatedLink.locator('..');
  91  |     const deleteButton = updatedCard.locator('button:has-text("Delete")');
  92  | 
  93  |     // Set up dialog handler BEFORE clicking
  94  |     let dialogHandled = false;
  95  |     page.once('dialog', dialog => {
  96  |       if (dialog.message().includes('E2E Test Habit Updated')) {
  97  |         dialogHandled = true;
  98  |         dialog.accept();
  99  |       } else {
  100 |         dialog.dismiss();
  101 |       }
  102 |     });
  103 | 
  104 |     await deleteButton.click();
  105 |     await page.waitForTimeout(1000); // Wait for deletion API call
  106 | 
  107 |     // If no dialog appeared, the API might have succeeded without confirmation
  108 |     // Verify deletion by checking the habit is gone
  109 |     await expect(page.locator('[href*="/habits/"]').filter({ hasText: 'E2E Test Habit Updated' })).toHaveCount(0, { timeout: 5000 });
  110 |   });
  111 | 
  112 |   // Test 4: Check in and undo check-in
  113 |   test('[4] User can check in for today and undo', async ({ page }) => {
  114 |     await page.locator('button:has-text("Demo Login")').click();
  115 |     await page.waitForURL('**/');
  116 |     await page.waitForTimeout(1500);
  117 | 
  118 |     // Find first habit card - could be either checked or unchecked
  119 |     const habitCards = page.locator('[href*="/habits/"]');
  120 |     const count = await habitCards.count();
  121 | 
  122 |     if (count === 0) {
  123 |       // Skip if no habits (this is OK - test passes, just no habits to check)
  124 |       expect(count).toBeGreaterThanOrEqual(0);
  125 |       return;
  126 |     }
  127 | 
  128 |     // Try to find a check-in button
  129 |     const checkInButton = page.locator('button:has-text("Check in Today")').first();
  130 |     const hasCheckIn = await checkInButton.isVisible({ timeout: 2000 }).catch(() => false);
  131 | 
  132 |     if (hasCheckIn) {
  133 |       // Check in
  134 |       await checkInButton.click();
  135 |       await page.waitForTimeout(1000);
  136 | 
  137 |       // Should change to "Done Today"
  138 |       const doneButton = page.locator('button:has-text("Done Today")').first();
  139 |       await expect(doneButton).toBeVisible({ timeout: 5000 });
  140 | 
  141 |       // Undo check-in
  142 |       await doneButton.click();
  143 |       await page.waitForTimeout(1000);
  144 | 
  145 |       // Should return to "Check in Today"
  146 |       await expect(page.locator('button:has-text("Check in Today")').first()).toBeVisible({ timeout: 5000 });
  147 |     }
  148 |   });
  149 | 
  150 |   // Test 5: Streaks display correctly
```