Personal Expense Tracker
Task: Create a full-stack web app using Claude Code.
Goal: Deliver a working MVP that demonstrates end-to-end product implementation (frontend + backend + persistence + tests) with Claude Code assistance. Developer chooses stack, database, UI library, and hosting approach (local run is required)
Business scenario: A user tracks personal spending across categories to control a monthly budget, quickly find transactions, and identify overspending trends.	

1) Core rules
The application supports multiple users
Each user sees only their own data
There is no sharing of any kind (no invites, no public links, no shared budgets)
Technology choices (stack, DB, UI library) are up to the developer, but the app must run locally

2) Functional requirements
2.1) Accounts and authentication (SSO only)
Authentication must be implemented via SSO only
The app must support both providers:
Google OAuth / OpenID Connect
GitHub OAuth
The app must support logout
Authentication must persist across page refresh
On first successful SSO sign-in, the backend must create a local user record automatically
The backend must persist at least the following user profile data:
Provider
provider_user_id
email if provided by the provider
display_name
avatar_url as optional
Account linking between Google and GitHub is not required
If the same person signs in with Google and GitHub, these may be treated as separate accounts unless the developer explicitly implements linking and documents it
2.2) Categories
A category represents how the user groups expenses.
A user can create a category
A user can rename a category
A user can delete a category
Category name must be unique per user
Deleting a category must be handled explicitly by one of these approaches:
Block deletion if transactions exist in the category
Allow deletion and reassign transactions to a default category (for example, “Uncategorized”)
The chosen approach must be documented in README
2.3) Transactions (expenses)
Each transaction belongs to exactly one user and must include:
Title (short description)
Amount
Currency (single currency is acceptable for MVP, but it must be explicit in the UI)
Transaction date
Category
Notes
Transaction operations:
Create a transaction
Edit any transaction field
Delete a transaction
Validation rules:
Amount must be greater than 0
Transaction date must be a valid date
Title must be non-empty
2.4) Monthly budget
A user can set a monthly budget amount for a selected month
The app calculates:
Total spent for the selected month
Remaining budget (budget minus spent)
Budget usage percentage
If no budget is set for a month, the UI must show a clear “No budget set” state instead of misleading numbers
2.5) Search and filters
Search transactions by title and notes
Filter transactions by category
Filter transactions by date range: this month, last month, custom range
Filter transactions by amount range: min/max
        
        2.6) Real-time communication (WebSocket budget alerts)
The app must include two-way communication using WebSocket.
Server → client behavior:
The backend must push real-time budget threshold alerts over WebSocket
Alerts are calculated for the current calendar month only
Required thresholds:
50%
80%
100%
A threshold alert must fire once per threshold per month
Alerts must be generated:
When the WebSocket connection opens
After a transaction is created, updated, or deleted
If no monthly budget is set for the current calendar month, threshold alerts must not be generated

Client → server behavior:
The client must send at least one meaningful WebSocket message to the server
Acceptable examples:
Subscribe
Ack
The chosen message type and payload format must be documented in README
The message must affect server behavior in some meaningful way, for example:
subscribing to budget alerts
acknowledging an alert as read

UI behavior for alerts:
Budget alerts must be visible in the UI
Acceptable presentation:
toast notifications
alert banner
notification panel

3) UI requirements (modern, styled, responsive, interactive)
Authentication entry screen with:
Continue with Google
Continue with GitHub
Main dashboard screen that shows for a selected month:
Total spent
Budget amount
Remaining budget
Budget usage percentage
Transactions screen or section with:
Transactions list or table
Search input
Filter controls (category, date range, amount range)
Create/Edit transaction UI (modal, drawer, or separate page is acceptable)
Categories management UI (page or modal)
Visible real-time budget alerts while connected to WebSocket
Responsive behavior for narrow screens:
Table-to-cards is acceptable
Horizontal scroll is acceptable
To make “modern, nice, styled, responsive, interactive” checkable, the UI must also include:
Consistent spacing and typography across major screens
Visible hover and focus states for interactive elements
Clear empty states for:
No transactions
No categories
No search results
No budget set
At least one visible loading state on a main screen or major data block
Client-side validation feedback for transaction create/edit forms
Light theme only. Dark mode is not required

4) Backend requirements
Provide an HTTP API that supports all UI flows
Enforce authorization for every category/transaction/budget operation
Enforce authorization on WebSocket connections and budget alert delivery
Validate inputs and return clear error responses for invalid requests
Implement Google and GitHub SSO securely
Persist data in a database chosen by the developer
Document required environment variables for Google OAuth and GitHub OAuth in README

5) Quality requirements
Include automated tests covering at least:
SSO login success path in test mode using a mock or stub provider response
Create category and create transaction
Authorization: user cannot access another user’s categories/transactions/budgets
Budget threshold WebSocket alerts for 50%, 80%, and 100%
Basic error handling must be visible in the UI
Tests must not depend on real Google or GitHub network calls
The project must start locally with documented commands

6) Deliverables
Gitlab repository with frontend and backend source code
README that includes:
How to run backend and frontend locally
How to run tests
Short description of API
Explanation of category deletion behavior (block vs reassign)
How to configure Google OAuth credentials
How to configure GitHub OAuth credentials
WebSocket message format and budget alert rules

7) Optional deliverable
Containerization via Dockerfile and/or docker-compose
If containerization is skipped because it is blocked on the developer’s machine, this must be noted in README


8) Acceptance checklist
A user can sign in with Google and GitHub
A local user record is created automatically on first successful SSO sign-in
A user can create categories and transactions
A user can set a monthly budget and see totals, remaining budget, and usage percentage
A user can search and filter transactions
Data is private per user (no cross-account access)
While connected, the app receives real-time budget alerts for 50%, 80%, and 100% thresholds for the current calendar month
The WebSocket flow includes at least one client → server message that changes server behavior
App runs locally from README instructions
Tests pass locally

9) Additional notes for the developer
GitHub may not always provide email depending on user settings, so identity should rely on provider + provider_user_id
If the user edits or deletes transactions after crossing a threshold, alerts should still follow the “once per threshold per month” rule and not spam repeatedly


Habit Tracker with Streaks
Task: Create a full-stack web app using Claude Code.
Goal: Deliver a working MVP that demonstrates end-to-end product implementation (frontend + backend + persistence + tests) with Claude Code assistance. Developer chooses stack, database, UI library, and hosting approach (local run is required)
Business scenario: A user wants to build consistent routines and needs a simple system to track daily habits, see current and best streaks, and review progress on a weekly/monthly calendar.

1) Core rules
The application supports multiple users
Each user sees only their own data
There is no sharing of any kind (no invites, no public links, no shared habits)
Technology choices (stack, DB, UI library) are up to the developer, but the app must run locally

2) Functional requirements
2.1) Accounts and authentication
Authentication must be implemented via SSO only
The app must support both providers:
Google OAuth / OpenID Connect
GitHub OAuth
The app must support logout
Authentication must persist across page refresh
On first successful SSO sign-in, the backend must create a local user record automatically
The backend must persist at least the following user profile data:
provider
provider_user_id
email if provided by the provider
display_name
avatar_url as optional
Account linking between Google and GitHub is not required 
If the same person signs in with Google and GitHub, these may be treated as separate accounts unless the developer explicitly implements linking and documents it

2.2) Habits
A habit represents a routine the user wants to track
Habit fields (minimum):
Name
Description/notes
Start date
Status: Active, Paused, Archived
Habit operations:
Create a habit
Edit any habit fields
Change status (Active ↔ Paused, Active/Paused → Archived)
Delete a habit (optional, but allowed only for the owner)
Business rules:
Only Active habits can be checked-in
Paused and Archived habits cannot receive new check-ins
Archived habits are read-only
A deleted habit must also remove its check-in history or deletion must be blocked until the habit is archived first. The chosen approach must be documented in README

2.3) Daily check-ins
A check-in records that a user completed a habit on a specific date.
Check-in rules:
One check-in per habit per date
A user can add a check-in for today
A user can remove (undo) a check-in for today
Backfilling past dates is not required
Future-date check-ins are not allowed

2.4) Streaks and progress
The system must calculate and display for each habit
Current streak (consecutive days up to today)
Best streak (maximum consecutive days historically)
Total check-ins (count)
Streak calculation requirements
A streak is based on consecutive calendar days with no gaps
If a required day is missed, the current streak resets
Paused status does not preserve the streak in the MVP. If the user pauses the habit and stops checking in, the streak is broken by the gap
Best streak must remain as the maximum streak achieved historically

2.5) Search and filters
Search habits by name and description
Filter habits by status: 
Active
Paused
Archived
Filter habits by “completed today” vs “not completed today” (for Active habits)

2.6) Real-time communication (WebSocket streak milestone notifications)

The app must include two-way communication using WebSocket.
Server → client behavior:
The backend must push streak milestone notifications over WebSocket
Required milestones:
3 days
7 days
30 days
Milestones are evaluated when the WebSocket connection opens
A milestone notification must be sent once per habit per milestone
If a habit has already triggered a milestone notification before, reconnecting must not resend the same milestone notification
If no milestone has been reached, no notification should be sent

Client → server behavior:
The client must send at least one meaningful WebSocket message to the server
Acceptable examples:
subscribe
Ack
The chosen message type and payload format must be documented in README
The message must affect server behavior in some meaningful way, for example:
subscribing to milestone notifications
acknowledging a notification as read

UI behavior for notifications:
Milestone notifications must be visible in the UI
Acceptable presentation:
toast notifications
alert banner
notification panel

3) UI requirements (modern, styled, responsive, interactive)
Authentication entry screen with:
Continue with Google
Continue with GitHub
Main screen with:
Habit list
Current streak per habit
Best streak per habit
Total check-ins per habit
Today check-in / undo controls
Search input
Filter controls
Habit create / edit UI (modal, drawer, or separate page is acceptable)
Habit details screen or section with:
habit information
check-in history for the current month
streak summary
Visible real-time milestone notifications while connected to WebSocket
Responsive behavior for narrow screens:
list-to-cards is acceptable
compact mobile layout is acceptable
To make “modern, nice, styled, responsive, interactive” checkable, the UI must also include:
Consistent spacing and typography across major screens
Visible hover and focus states for interactive elements
Clear empty states for:
no habits
no search results
no check-ins yet
At least one visible loading state on a main screen or major data block
Client-side validation feedback for habit create / edit forms
Light theme only. Dark mode is not required

4) Backend requirements
Provide an HTTP API that supports all UI flows
Enforce authorization for every habit and check-in operation
Enforce authorization on WebSocket connections and milestone notification delivery
Validate inputs and return clear error responses for invalid requests
Implement Google and GitHub SSO securely
Document required environment variables for Google OAuth and GitHub OAuth in README
Persist data in a database chosen by the developer
Store dates consistently and document the chosen timezone approach in README

5) Quality requirements
Include automated tests covering at least
SSO login success path in test mode using a mock or stub provider response
Create habit and create today check-in
Prevent duplicate check-in for the same habit/date
Authorization: user cannot access another user’s habits/check-ins
WebSocket milestone notifications for 3, 7, and 30 days
Basic error handling must be visible in the UI 
Tests must not depend on real Google or GitHub network calls
The project must start locally with documented commands

6) Deliverables
Git repository with frontend and backend source code
README that includes
How to run backend and frontend locally
How to run tests
Short API description (README section is enough)
How to configure Google OAuth credentials
How to configure GitHub OAuth credentials
WebSocket message format and milestone notification rules
Notes about streak calculation and timezone handling

7) Optional deliverable:
Containerization via Dockerfile and/or docker-compose
If containerization is skipped because it is blocked on the developer’s machine, this must be noted in README

8) Acceptance checklist
A user can sign in with Google and GitHub
A local user record is created automatically on first successful SSO sign-in
A user can create, edit, and delete habits
A user can check in a habit for today and undo that check-in
The app shows current streak, best streak, and total check-ins
A user can search and filter habits
Data is private per user and cannot be accessed cross-account
While connected, the app receives real-time milestone notifications for 3-day, 7-day, and 30-day streaks
The same habit milestone notification is not repeated on every reconnect
The WebSocket flow includes at least one client → server message that changes server behavior
App runs locally from README instructions
Tests pass locally	


9) Additional notes for the developer
GitHub may not always provide email depending on user settings, so identity should rely on provider + provider_user_id
Because the streak is strict and daily, the handling of “today” and timezone must be clearly documented
If the user removes today’s check-in, the current streak must be recalculated correctly
Paused and Archived statuses must not allow new check-ins
