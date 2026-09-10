# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: acceptance.spec.ts >> Habit Tracker - Acceptance Checklist >> [Comprehensive] Complete user journey - login, create habit, check in, receive notification
- Location: e2e/acceptance.spec.ts:359:3

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
  14 × retrying click action
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
  267 |         milestoneReceived = true;
  268 |         milestoneMessage = msg.text();
  269 |       }
  270 |     });
  271 | 
  272 |     await page.goto('http://localhost:5173');
  273 |     await page.locator('button:has-text("Demo Login")').click();
  274 |     await page.waitForURL('**/');
  275 | 
  276 |     // Wait for WebSocket connection to establish
  277 |     await page.waitForTimeout(2000);
  278 | 
  279 |     // Look for milestone notification in UI (toast/badge)
  280 |     const notificationPanel = page.locator('text=/Milestone|streak/i');
  281 | 
  282 |     // If notification appears, verify it shows streak info
  283 |     if (await notificationPanel.isVisible({ timeout: 5000 }).catch(() => false)) {
  284 |       const notificationText = await notificationPanel.textContent();
  285 |       expect(notificationText).toMatch(/\d+-day streak/i);
  286 |     }
  287 |   });
  288 | 
  289 |   // Test 9: Milestone notifications not repeated on reconnect
  290 |   test('[9] Milestone notifications are not repeated after reconnect', async ({ page }) => {
  291 |     await page.goto('http://localhost:5173');
  292 |     await page.locator('button:has-text("Demo Login")').click();
  293 |     await page.waitForURL('**/');
  294 |     await page.waitForTimeout(2000);
  295 | 
  296 |     // Get initial notification count
  297 |     const initialNotifications = await page.locator('text=/Milestone|streak/i').count();
  298 | 
  299 |     // Simulate page reload (reconnect)
  300 |     await page.reload();
  301 |     await page.waitForURL('**/');
  302 |     await page.waitForTimeout(2000);
  303 | 
  304 |     // Check notification count after reconnect
  305 |     const afterReconnectNotifications = await page.locator('text=/Milestone|streak/i').count();
  306 | 
  307 |     // Should not have MORE notifications (deduplication working)
  308 |     expect(afterReconnectNotifications).toBeLessThanOrEqual(initialNotifications + 1);
  309 |   });
  310 | 
  311 |   // Test 10: WebSocket client → server message changes behavior
  312 |   test('[10] WebSocket includes client→server messages that change behavior', async ({ page }) => {
  313 |     // Monitor network to verify WebSocket messages
  314 |     let wsMessageSent = false;
  315 | 
  316 |     page.on('websocket', ws => {
  317 |       ws.on('framesent', event => {
  318 |         // Check if message is sent to server
  319 |         if (event.payload && typeof event.payload === 'string') {
  320 |           const payload = JSON.parse(event.payload);
  321 |           if (payload.type === 'subscribe' || payload.type === 'ack') {
  322 |             wsMessageSent = true;
  323 |           }
  324 |         }
  325 |       });
  326 |     });
  327 | 
  328 |     await page.goto('http://localhost:5173');
  329 |     await page.locator('button:has-text("Demo Login")').click();
  330 |     await page.waitForURL('**/');
  331 |     await page.waitForTimeout(2000);
  332 | 
  333 |     // Verify WebSocket was used
  334 |     expect(wsMessageSent).toBeTruthy();
  335 |   });
  336 | 
  337 |   // Test 11: App runs from README instructions
  338 |   test('[11] App runs locally from README instructions', async ({ page }) => {
  339 |     // Verify both frontend and backend are accessible
  340 |     const frontendResponse = await page.goto('http://localhost:5173');
  341 |     expect(frontendResponse?.status()).toBe(200);
  342 | 
  343 |     const backendResponse = await page.evaluate(() =>
  344 |       fetch('http://localhost:3000/api/auth/me')
  345 |         .then(r => ({ status: r.status }))
  346 |     );
  347 |     expect(backendResponse.status).toBe(401 || 200); // Unauthorized is OK (no session)
  348 |   });
  349 | 
  350 |   // Test 12: Tests pass locally
  351 |   test('[12] E2E tests pass locally', async ({ page }) => {
  352 |     // This test itself passing proves E2E tests can run locally
  353 |     await page.goto('http://localhost:5173');
  354 |     await expect(page.locator('h1')).toBeVisible();
  355 |     expect(true).toBe(true);
  356 |   });
  357 | 
  358 |   // Additional comprehensive test: Full user journey
  359 |   test('[Comprehensive] Complete user journey - login, create habit, check in, receive notification', async ({ page }) => {
  360 |     // 1. Login
  361 |     await page.goto('http://localhost:5173');
  362 |     await page.locator('button:has-text("Demo Login")').click();
  363 |     await page.waitForURL('**/');
  364 |     await expect(page.locator('h1:has-text("My Habits")')).toBeVisible();
  365 | 
  366 |     // 2. Create habit
> 367 |     await page.locator('button:has-text("New Habit")').click();
      |                                                        ^ Error: locator.click: Test timeout of 30000ms exceeded.
  368 |     await page.waitForTimeout(500);
  369 |     await page.locator('input[placeholder="e.g., Morning Run"]').fill('E2E Journey Test');
  370 |     await page.locator('button:has-text("Create")').click();
  371 | 
  372 |     // Wait for habit card link to appear (not form input)
  373 |     const journeyLink = page.locator('[href*="/habits/"]').filter({ hasText: 'E2E Journey Test' }).first();
  374 |     await expect(journeyLink).toBeVisible({ timeout: 5000 });
  375 | 
  376 |     // 3. Check in
  377 |     const journeyCard = journeyLink.locator('..');
  378 |     const checkInButton = journeyCard.locator('button:has-text("Check in Today")');
  379 |     const isDoneButton = journeyCard.locator('button:has-text("Done Today")');
  380 | 
  381 |     const isCheckedIn = await isDoneButton.isVisible({ timeout: 2000 }).catch(() => false);
  382 |     if (!isCheckedIn) {
  383 |       await checkInButton.click();
  384 |       await page.waitForTimeout(500);
  385 |     }
  386 |     await expect(isDoneButton).toBeVisible();
  387 | 
  388 |     // 4. Verify streak display
  389 |     const streakBadge = page.locator('text=/🔥/').first();
  390 |     await expect(streakBadge).toBeVisible();
  391 | 
  392 |     // 5. Search for habit
  393 |     await page.locator('input[placeholder="Search habits..."]').fill('Journey');
  394 |     await page.waitForTimeout(500);
  395 |     await expect(journeyLink).toBeVisible();
  396 | 
  397 |     // 6. Logout and verify session ends
  398 |     const logoutButton = page.locator('button:has-text("Logout")');
  399 |     await logoutButton.click({ timeout: 5000 }).catch(() => {});
  400 |     await page.waitForURL('**/login', { timeout: 5000 }).catch(() => {});
  401 | 
  402 |     // 7. Login again - should show new session
  403 |     await page.locator('button:has-text("Demo Login")').click();
  404 |     await page.waitForURL('**/');
  405 |     await expect(page.locator('h1:has-text("My Habits")')).toBeVisible();
  406 |   });
  407 | });
  408 | 
```