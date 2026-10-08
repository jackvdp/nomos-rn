# NOMOS API — endpoint index

_Generated from `nomos-openapi.json` (OpenAPI 3.0, Nomos v2.0). 550 operations across 517 paths._
_Every operation also requires the four `x-*` header schemes; ops marked 🔒 additionally require a bearer JWT._

## Admin - Public Signup Tokens
- 🔒 `GET /api/admin/public-signup-token/token-history` — Get last 3 months of public signup tokens for a role
- 🔒 `POST /api/admin/public-signup-token/generate` — Generate a new public signup token for a specific role
- 🔒 `POST /api/admin/public-signup-token/regenerate/{id}` — Regenerate a public signup token (replaces existing one)
- 🔒 `DELETE /api/admin/public-signup-token/revoke/{id}` — Revoke a public signup token manually

## Admin-Analytics
- 🔒 `GET /api/activity-logs/recent-activity/user` — Get most recent activity per user
- 🔒 `GET /api/activity-logs/recent-activity/admin` — Get most recent activity per user
- 🔒 `GET /api/activity-logs/recent-activity/all` — Get most recent activity per user
- 🔒 `GET /api/activity-logs/user-analytics/organizations` — Get child organizations for the analytics filter dropdown
- 🔒 `GET /api/activity-logs/user-analytics/user-activity` — Get daily user signups based on date range
- 🔒 `GET /api/activity-logs/user-analytics/user-stats` — Get total, active and new signup users
- 🔒 `GET /api/activity-logs/user-analytics/user-engagement` — Get user engagement stats
- 🔒 `GET /api/activity-logs/user-analytics/user-recent-activity` — Get recent activity of users in the given date range
- 🔒 `GET /api/activity-logs/course-analytics` — Get analytics data for courses
- 🔒 `GET /api/activity-logs/event-analytics` — Get analytics data for events

## Admin-Auth
- 🔒 `GET /api/admin/auth/organizations` — AuthController_organizations
- 🔒 `POST /api/admin/auth/switch-organization` — AuthController_switchOrganization
- `POST /api/admin/auth/login` — Login to the application
- `POST /api/admin/auth/sso/google` — Authenticate using Google OIDC
- `POST /api/admin/auth/forgot-password` — Initiate forgot password
- `POST /api/admin/auth/verify-otp` — Verify OTP and login user
- `POST /api/admin/auth/verify-reset-password-token` — Verify reset password token
- `POST /api/admin/auth/reset-password` — Reset password
- 🔒 `POST /api/admin/auth/change-password` — Change password
- `POST /api/admin/auth/refresh-token` — Refresh access token
- 🔒 `POST /api/admin/auth/logout` — Logout and revoke the current session
- `POST /api/admin/auth/create-password` — Create password using token
- `POST /api/admin/auth/resend-otp` — Resend OTP to a user email
- `POST /api/admin/auth/public-signup` — Public signup using token

## Admin-Badges
- 🔒 `POST /api/admin/badges/add-badge` — Add a parent-owned badge
- 🔒 `GET /api/admin/badges/fetch-all` — Fetch parent-owned badges
- 🔒 `GET /api/admin/badges/fetch/{id}` — Fetch parent-owned badge by ID
- 🔒 `PUT /api/admin/badges/update/{id}` — Update parent-owned badge
- 🔒 `PUT /api/admin/badges/update-status/{id}` — Update parent-owned badge status
- 🔒 `PATCH /api/admin/badges/sync-tenant-badges` — Sync badges to a direct child tenant
- 🔒 `DELETE /api/admin/badges/soft-delete/{id}` — Soft delete parent-owned badge

## Admin-Banners
- 🔒 `POST /api/admin/banners` — Create a new banner
- 🔒 `GET /api/admin/banners/{id}` — Get banner by ID
- 🔒 `PATCH /api/admin/banners/{id}` — Update a banner
- 🔒 `DELETE /api/admin/banners/{id}` — Delete banner
- 🔒 `PATCH /api/admin/banners/{id}/toggle-active-status` — Toggle active status of banner

## Admin-Category
- 🔒 `POST /api/category/add/{moduleId}` — Create a new category
- 🔒 `GET /api/category/get-category-modules` — Get all category modules
- 🔒 `GET /api/category/get-all` — Get all categories with pagination, filter, and search
- 🔒 `GET /api/category/active` — Get all active categories (User-facing)
- 🔒 `GET /api/category/module/{moduleId}` — Get categories by module name
- 🔒 `GET /api/category/admin/module/{moduleId}` — Get categories by module name (Admin)
- 🔒 `GET /api/category/get-by-id/{id}` — Get a category by ID
- 🔒 `POST /api/category/update-sequence` — Update category sequence within a module
- 🔒 `PATCH /api/category/update/{id}` — Update a category by ID
- 🔒 `PATCH /api/category/toggle/{id}` — Toggle isActive status of a category
- 🔒 `DELETE /api/category/delete/{id}` — Delete a category by ID
- 🔒 `POST /api/category/categories-seed` — Seed fixed category modules

## Admin-Certificate
- 🔒 `POST /api/certificate` — Create certificate
- 🔒 `GET /api/certificate` — CertificateController_findAll
- 🔒 `GET /api/certificate/{id}` — CertificateController_findOne
- 🔒 `PATCH /api/certificate/{id}` — CertificateController_update
- 🔒 `DELETE /api/certificate/{id}` — CertificateController_remove
- 🔒 `POST /api/certificate/{id}/public-share` — Generate a public share link for a certificate
- 🔒 `DELETE /api/certificate/{id}/public-share` — Revoke a public share link for a certificate

## Admin-Certificate-Attributes
- 🔒 `POST /api/certificate-attributes` — Create certificate attributes in bulk
- 🔒 `GET /api/certificate-attributes/{certificateId}` — AttributeController_findByCertificateId
- 🔒 `DELETE /api/certificate-attributes/{certificateId}` — AttributeController_deleteByCertificateId

## Admin-Challenge-Submissions
- 🔒 `POST /api/admin/challenges-submissions/submit-challenge` — Submit challenge (User)
- 🔒 `GET /api/admin/challenges-submissions/admin/submitted-challenges` — Get all submitted challenges (Admin)
- 🔒 `GET /api/admin/challenges-submissions/admin/submitted-challenge/{id}` — Get single submission by ID (Admin)
- 🔒 `POST /api/admin/challenges-submissions/admin/moderate-challenge` — Approve/Reject submission (Admin)

## Admin-Challenges
- 🔒 `POST /api/admin/challenges/admin/add-challenge` — Create a new challenge (Admin only)
- 🔒 `GET /api/admin/challenges/admin/challenges` — Get all challenges (Admin)
- 🔒 `GET /api/admin/challenges/challenges` — Get all challenges (Public)
- 🔒 `GET /api/admin/challenges/challenge/{id}` — Get challenge by ID
- 🔒 `GET /api/admin/challenges/challenge/slug/{slug}` — Get challenge by slug
- 🔒 `GET /api/admin/challenges/get-submitted-challenges` — Get submitted challenges by user ID
- 🔒 `PUT /api/admin/challenges/admin/update-challenge/{id}` — Update a challenge by ID (Admin only)
- 🔒 `PUT /api/admin/challenges/admin/update-challenge-status/{id}` — Update challenge active status (Admin)
- 🔒 `DELETE /api/admin/challenges/admin/delete-challenge/{id}` — Soft delete a challenge (Admin)

## Admin-Comments
- 🔒 `POST /api/comments/add-comment` — Create a new comment
- 🔒 `GET /api/comments/get-comment-by-type/{id}` — Get comments by target entity (Post or Topic) ID
- 🔒 `GET /api/comments/get-comment-by-id/{id}` — Get a comment by its ID
- 🔒 `PUT /api/comments/update-comment/{id}` — Update an existing comment by ID
- 🔒 `POST /api/comments/toggle-comment-like/{commentId}` — Toggle like or dislike on a comment by ID
- 🔒 `DELETE /api/comments/delete-event-by-id/{id}` — Delete a comment by ID

## Admin-Connections
- 🔒 `POST /api/connections/send-request` — Send a connection request
- 🔒 `POST /api/connections/unsend-request` — Unsend a connection request
- 🔒 `DELETE /api/connections/remove` — Remove an existing connection
- 🔒 `PATCH /api/connections/respond` — Accept or reject a connection request
- 🔒 `GET /api/connections/requests/{id}` — View incoming connection requests for a user
- 🔒 `GET /api/connections/my/{id}` — View current user connections
- 🔒 `GET /api/connections/all-accepted` — View all accepted connections in the system
- 🔒 `GET /api/connections/all-networks` — Get all active network users except the current user
- 🔒 `GET /api/connections/network-profile/{id}` — Get the profile of a user in the network

## Admin-Custom Module Control
- 🔒 `GET /api/admin/custom-modules-control` — Get paginated list of all module access controls
- 🔒 `GET /api/admin/custom-modules-control/{moduleId}/users` — Get all users with module access status
- 🔒 `POST /api/admin/custom-modules-control/{moduleId}/access` — Grant or revoke module access for users and roles

## Admin-Custom-Modules
- 🔒 `POST /api/admin/custom-modules/add-module` — Create a new custom module
- 🔒 `GET /api/admin/custom-modules/get-all-custom-module` — Get all custom modules
- 🔒 `GET /api/admin/custom-modules/get-by-id/{id}` — Get a custom module by ID
- 🔒 `PATCH /api/admin/custom-modules/update-by-id/{id}` — Update a custom module by ID
- 🔒 `PATCH /api/admin/custom-modules/update-custom-module-sequence` — Update custom module sequences
- 🔒 `GET /api/admin/custom-modules/get-login-user-sidebar` — CustomModulesController_getLoginUserSidebar
- 🔒 `PATCH /api/admin/custom-modules/update-custom-module-status/{id}` — Toggle enable/disable custom module
- 🔒 `GET /api/admin/custom-modules/{moduleId}/user-visibility` — List visible or hidden users for a custom module
- 🔒 `PATCH /api/admin/custom-modules/{moduleId}/user-visibility/{userId}` — Hide or show a user for a custom module
- 🔒 `DELETE /api/admin/custom-modules/delete-by-id/{id}` — Soft delete a custom module by ID
- 🔒 `POST /api/admin/custom-modules/seed-fixed-module` — Seed fixed modules

## Admin-Custom-Modules-Articles
- 🔒 `POST /api/admin/custom-module-article/create-article/{moduleId}` — Create a custom or single article for a module
- 🔒 `GET /api/admin/custom-module-article/get-by-id/{id}` — Get a single or custom article by ID and type
- 🔒 `GET /api/admin/custom-module-article/get-all-articles/{moduleId}` — Get all articles by module ID
- 🔒 `PATCH /api/admin/custom-module-article/update-article/{id}` — Update an article by ID and module type
- 🔒 `PATCH /api/admin/custom-module-article/pin-archive-article/{id}` — Toggle pinned state for an archive article
- 🔒 `DELETE /api/admin/custom-module-article/delete-article/{id}` — Delete an article by ID and type

## Admin-Dashboard
- 🔒 `GET /api/admin/dashboard/overview` — Get dashboard overview stats

## Admin-Events
- 🔒 `POST /api/events/add-event/{categoryId}` — Create a new event
- 🔒 `PATCH /api/events/update-events/{id}` — Update an existing event
- 🔒 `GET /api/events/all-events` — Get All Events
- 🔒 `GET /api/events/admin-events` — Get All Admin Events (Active + Inactive)
- 🔒 `GET /api/events/past-events` — Get Past Events
- 🔒 `GET /api/events/search-with-filter` — Search and Filter Events with Pagination
- 🔒 `GET /api/events/get-by-id/{id}` — Get Event by ID
- 🔒 `GET /api/events/get-by-slug/{slug}` — Get Event by Slug
- 🔒 `PATCH /api/events/status/{id}` — Update Event Status
- 🔒 `PATCH /api/events/{id}/toggle-pin` — Toggle pin status of an event
- 🔒 `GET /api/events/attendees/{id}` — Get attendees for an event
- 🔒 `POST /api/events/attend/{eventId}` — Attend an event
- 🔒 `DELETE /api/events/delete/{id}` — Soft Delete Event

## Admin-Feed
- 🔒 `POST /api/post/add-post` — Add Post
- 🔒 `GET /api/post` — Get all posts with pagination
- 🔒 `GET /api/post/fetch/{id}` — Get post with ID
- 🔒 `GET /api/post/fetch-by-slug` — Get post with Slug
- 🔒 `PATCH /api/post/{id}` — Update a post by ID
- 🔒 `DELETE /api/post/{id}` — Delete a post by ID (soft delete)

## Admin-Forum
- 🔒 `POST /api/forums/add-forum/{id}` — Add a forum to a specific category
- 🔒 `GET /api/forums/get-all` — Get all forums with pagination
- 🔒 `GET /api/forums/get-all-forums` — Get all forums

## Admin-Help
- 🔒 `POST /api/help/create-faq` — Create a new FAQ
- 🔒 `GET /api/help/faqs-all-faqs` — Get all Help FAQs with pagination
- 🔒 `GET /api/help/get-by-id/{id}` — Get a Help FAQ by ID
- 🔒 `PATCH /api/help/update-faq/{id}` — Update a Help FAQ by ID
- 🔒 `PATCH /api/help/update-fqa-sequence` — Update FAQ sequences in bulk
- 🔒 `POST /api/help/send-help-query` — Send a help query
- 🔒 `DELETE /api/help/delete-faq/{id}` — Delete a Help FAQ by ID

## Admin-Home
- 🔒 `GET /api/admin/home` — Get admin dashboard data
- 🔒 `GET /api/home` — Get all dashboards for users
- 🔒 `POST /api/admin/filter-home` — Filter dashboards based on criteria
- 🔒 `GET /api/admin/home/{id}` — Get a specific dashboard by ID
- 🔒 `POST /api/admin/add-home` — Add a new dashboard
- 🔒 `PUT /api/admin/update-home-sequence` — Bulk update dashboard sequences
- 🔒 `PATCH /api/admin/update-home/{id}` — Update a specific dashboard by ID
- 🔒 `PUT /api/admin/update-home-status/{id}` — Update dashboard active status
- 🔒 `PUT /api/admin/delete-home/{id}` — Soft delete a dashboard by ID

## Admin-Key-Bundle
- 🔒 `PUT /api/admin/key-bundle/update` — Update or create key bundle for current user
- 🔒 `GET /api/admin/key-bundle/my` — Get current user key bundle
- 🔒 `GET /api/admin/key-bundle/user/{userId}` — Get key bundle by user ID

## Admin-Label
- 🔒 `POST /api/label/add/{moduleId}` — Create a new label
- 🔒 `GET /api/label/get-label-modules` — Get all label modules
- 🔒 `GET /api/label/get-all` — Get all labels with pagination, filter, and search
- 🔒 `GET /api/label/active` — Get all active labels (User-facing)
- 🔒 `GET /api/label/module/{moduleId}` — Get labels by module name
- 🔒 `GET /api/label/admin/module/{moduleId}` — Get labels by module name (Admin)
- 🔒 `GET /api/label/get-by-id/{id}` — Get a label by ID
- 🔒 `POST /api/label/update-sequence` — Update label sequence within a module
- 🔒 `PATCH /api/label/update/{id}` — Update a label by ID
- 🔒 `PATCH /api/label/toggle/{id}` — Toggle isActive status of a label
- 🔒 `DELETE /api/label/delete/{id}` — Delete a label by ID
- 🔒 `POST /api/label/labels-seed` — Seed fixed label modules

## Admin-Likes
- 🔒 `POST /api/likes/toggle-like/{id}` — Toggle like/unlike on a target entity (post, topic, or news)

## Admin-Login-History
- 🔒 `GET /api/login-history/get-user-login-history` — Get user login history

## Admin-Media-Store
- 🔒 `POST /api/media-store/save-media` — Upload file and save metadata (unique fileName)
- 🔒 `GET /api/media-store/get-by-id/{id}` — Get media file by ID
- 🔒 `GET /api/media-store/get-all` — Get all media files with filtering, sorting, and pagination
- 🔒 `DELETE /api/media-store/delete/{id}` — Delete media file by ID

## Admin-News
- 🔒 `POST /api/admin/news/run-feed` — Manually trigger the news feed sync
- 🔒 `GET /api/admin/news` — Get paginated news list
- 🔒 `GET /api/admin/news/regions` — Get distinct article country/regions
- 🔒 `GET /api/admin/news/{id}` — Get news by ID
- 🔒 `GET /api/admin/news/slug/{slug}` — Get news by slug
- 🔒 `POST /api/admin/add-news` — Create a news item
- 🔒 `PUT /api/admin/update-news/{id}` — Update news by ID
- 🔒 `PATCH /api/admin/update-news-status/{id}` — Toggle pinned status of news
- 🔒 `PATCH /api/admin/toggle-isread/{id}` — Set isRead news by ID
- 🔒 `DELETE /api/admin/delete-news/{id}` — Soft delete news by ID

## Admin-Organizations
- 🔒 `POST /api/admin/organizations` — Create a child tenant organization
- 🔒 `GET /api/admin/organizations` — List tenant organizations for this tenant
- 🔒 `GET /api/admin/organizations/domains/{id}/sso-settings` — Get SSO settings for a child organization domain
- 🔒 `PATCH /api/admin/organizations/domains/{id}/sso-settings` — Create or update SSO settings for a child organization domain
- 🔒 `GET /api/admin/organizations/{id}/theme-settings` — OrganizationsController_getChildOrganizationThemeSettings
- 🔒 `PUT /api/admin/organizations/{id}/theme-settings` — OrganizationsController_updateChildOrganizationThemeSettings
- 🔒 `PUT /api/admin/organizations/parent/{id}/theme-settings` — OrganizationsController_updateParentOrganizationThemeSettings
- 🔒 `GET /api/admin/organizations/{id}` — Get a child tenant organization by ID
- 🔒 `PUT /api/admin/organizations/{id}` — Update a child tenant organization by ID
- 🔒 `DELETE /api/admin/organizations/{id}` — Soft delete a child tenant organization by ID
- 🔒 `PATCH /api/admin/organizations/{id}/change-status` — Toggle active status of a child tenant organization by ID
- 🔒 `PUT /api/admin/organizations/{id}/restore-customer` — Restore a soft-deleted child tenant organization
- 🔒 `DELETE /api/admin/organizations/{id}/hard-delete` — Hard delete a child tenant organization by ID

## Admin-Permissions
- 🔒 `GET /api/admin/permissions/sync` — Sync permissions for the current tenant
- 🔒 `GET /api/admin/permissions/all-permissions-with-pagination` — Get all permissions with pagination
- 🔒 `GET /api/admin/permissions` — Get all permissions
- 🔒 `GET /api/admin/permissions/{id}` — Get the permission by id
- 🔒 `POST /api/admin/permissions/add-permissions` — Create multiple permissions
- 🔒 `POST /api/admin/permissions/add-permission` — Create a single permission
- 🔒 `POST /api/admin/permissions/update-permission/{id}` — Update a permission
- 🔒 `POST /api/admin/permissions/update-permission-status/{id}` — Update permission status by ID
- 🔒 `POST /api/admin/permissions/delete-permission/{id}` — Delete a permission by ID
- 🔒 `POST /api/admin/permissions/sync-permissions` — Seed permissions for the current organization

## Admin-Roles
- 🔒 `POST /api/Admin/roles/add-role` — Add a new role
- 🔒 `GET /api/Admin/roles/fetch-all` — Fetch all roles
- 🔒 `GET /api/Admin/roles/role-by-id/{id}` — Fetch role by ID
- 🔒 `GET /api/Admin/roles/roles-with-user` — Fetch roles with associated users
- 🔒 `PATCH /api/Admin/roles/assign-permissions-role/{id}` — Assign permissions to a role
- 🔒 `PATCH /api/Admin/roles/update-role-status/{id}` — Update role status
- 🔒 `PATCH /api/Admin/roles/update-role/{id}` — Update an existing role
- 🔒 `DELETE /api/Admin/roles/delete-role/{id}` — Delete a role by ID

## Admin-Topic
- 🔒 `GET /api/topic/top-topics` — Get the top five topics accessible to the current user
- 🔒 `POST /api/topic/add-topic/{forumId}` — Create a new topic in a forum
- 🔒 `GET /api/topic/get-all-topic-with-forum/{forumId}` — Get all topics with pagination
- 🔒 `GET /api/topic/get-all-topic` — Get all topics with pagination
- 🔒 `GET /api/topic/get-by-id/{id}` — Get topic by ID
- 🔒 `POST /api/topic/topic-read/{id}` — Mark a topic as read by the authenticated user
- 🔒 `PATCH /api/topic/update/{id}` — Update a topic by ID
- 🔒 `PATCH /api/topic/update-category/{topicId}/{categoryId}` — Update the category of a specific topic
- 🔒 `DELETE /api/topic/delete-by-id/{id}` — Soft delete a topic by ID

## Admin-User-Badges
- `GET /api/admin/user-badges/display` — Fetch available badges for display
- `GET /api/admin/user-badges/fetch/{userId}` — Fetch user badges

## Admin-Users
- 🔒 `POST /api/admin/users/{userId}/reset-course-completions` — Reset all course enrollments, progress, rewards and Course Certificate VCs for a user
- 🔒 `POST /api/admin/users/{userId}/resend-credential-onboarding` — Resend a fresh VC onboarding link to a user
- 🔒 `GET /api/admin/users/{userId}/credential-onboarding-prefill` — UserController_getCredentialOnboardingPrefill
- 🔒 `POST /api/admin/users` — Create a new user
- 🔒 `GET /api/admin/users` — Get all users
- `POST /api/admin/users/create-external-user` — Create a user from external applications
- 🔒 `POST /api/admin/users/toggle-secret-key` — Toggle secret key activation status
- 🔒 `PATCH /api/admin/users/generate-secrets` — Generate new appId and appSecret for a user
- 🔒 `GET /api/admin/users/bulk-upload/template` — Download CSV template for bulk user upload
- 🔒 `POST /api/admin/users/bulk-upload` — Bulk upload users from a CSV file
- 🔒 `GET /api/admin/users/bulk-upload/{jobId}/status` — Get bulk user upload job status
- 🔒 `GET /api/admin/users/profile` — Get the logged in user
- 🔒 `PUT /api/admin/users/profile` — Update the logged in user
- 🔒 `GET /api/admin/users/{id}` — Get the user by id
- 🔒 `PATCH /api/admin/users/{id}` — Update the logged in user
- 🔒 `PUT /api/admin/users/{id}` — Update user by id
- 🔒 `DELETE /api/admin/users/{id}` — Delete User
- 🔒 `PATCH /api/admin/users/{id}/toggle-active-status` — Toggle active status for a user
- 🔒 `PATCH /api/admin/users/{id}/toggle-blocked-status` — Toggle blocked status for a user
- 🔒 `PATCH /api/admin/users/toggle-mfa` — Toggle MFA status for a user
- 🔒 `PATCH /api/admin/users/toggle-ispublic` — Toggle ispublic status for a user
- 🔒 `PATCH /api/admin/users/toggle-online-status` — Toggle user Online Status
- 🔒 `PATCH /api/admin/users/accept-policy` — Update acceptPolicy for authenticated user

## Admin-course
- 🔒 `POST /api/course/add-course/{categoryId}` — Create a new course in a specific category
- 🔒 `GET /api/course/get-all-courses` — Get all courses with filters and pagination
- 🔒 `GET /api/course/get-by-id/{id}` — Get a course by its ID
- 🔒 `GET /api/course/get-by-slug/{slug}` — Get a course by its slug
- 🔒 `PATCH /api/course/update-course/{courseId}` — Update an existing course
- 🔒 `POST /api/course/submit-review/{courseId}` — Submit or update a course review
- 🔒 `GET /api/course/average-rating/{courseId}` — Get average rating for a course
- 🔒 `POST /api/course/enroll/{courseId}` — Enroll a user into a course by courseId and userId
- 🔒 `GET /api/course/get-course-attendies/{courseId}` — Get a course Attendees by course ID
- 🔒 `DELETE /api/course/delete-course/{id}` — Delete a course by its ID
- 🔒 `GET /api/course/user-course-quiz-with-responses/{courseId}` — Get a course quiz with responses for a user

## Admin-course-lessons
- 🔒 `POST /api/courses-lessons/create-lessons/{courseContentId}` — Create a new lesson for a given course content
- 🔒 `GET /api/courses-lessons/get-all-lessons/{courseContentId}` — Get all lessons for a specific course content (paginated)
- 🔒 `GET /api/courses-lessons/lesson-by-id/{id}` — Get a course lesson by its unique ID
- 🔒 `GET /api/courses-lessons/lesson-slug/{slug}` — Get a course lesson by its slug
- 🔒 `PATCH /api/courses-lessons/update-course-lesson/{id}` — Update an existing course lesson by ID
- 🔒 `PATCH /api/courses-lessons/update-sequence/{courseContentId}` — Update the sequence order of lessons
- 🔒 `POST /api/courses-lessons/mark-lesson-completed/{lessonId}` — Mark a lesson as completed
- 🔒 `DELETE /api/courses-lessons/delete-by-id/{lessonId}` — Delete a course lesson by its ID

## Admin-course-materials
- 🔒 `POST /api/course-materials/add-course-material` — Add a new course material to a course
- 🔒 `GET /api/course-materials/get-all-course-materials/{attachableId}` — Get all course materials for a specific course
- 🔒 `GET /api/course-materials/get-course-material-by-id/{materialId}` — Get a specific course material by its ID
- 🔒 `PATCH /api/course-materials/update-course-material/{materialId}` — Update an existing course material
- 🔒 `DELETE /api/course-materials/delete-course-material/{materialId}` — Soft delete a course material by its ID

## Admin-courses-contents
- 🔒 `POST /api/courses-contents/add-course-content/{courseId}` — Create a new course content
- 🔒 `GET /api/courses-contents/get-all-material-with-id/{courseId}` — Get all course contents by course ID
- 🔒 `GET /api/courses-contents/get-by-id/{id}` — Get a course content by its ID
- 🔒 `GET /api/courses-contents/get-by-slug/{slug}` — Get a course content by its slug
- 🔒 `PUT /api/courses-contents/update-course-content/{id}` — Update a course content by its ID
- 🔒 `PUT /api/courses-contents/update-sequence/{courseId}` — Update the sequence of multiple course contents
- 🔒 `DELETE /api/courses-contents/delete-by-id/{id}` — Delete a course content by its ID

## Admin-daily-challenges
- 🔒 `POST /api/daily-challenges/create` — Create a new Daily Challenge
- 🔒 `GET /api/daily-challenges/get-todays-challenge` — Get today’s daily challenge for the user based on their timezone
- 🔒 `GET /api/daily-challenges/admin/get-all-daily-challenges` — Get all daily challenges (Admin)
- 🔒 `PATCH /api/daily-challenges/update/{id}` — Update a daily challenge (Admin)
- 🔒 `DELETE /api/daily-challenges/delete/{id}` — Delete daily challenge and all related records

## Admin-quiz
- 🔒 `POST /api/admin/quiz/create-quiz-with-identifier` — Create a new quiz with identifier
- 🔒 `GET /api/admin/quiz/get-all-quizzes` — Get all quizzes by context
- 🔒 `POST /api/admin/quiz/assign-quiz/{quizId}/{contextId}` — Assign quiz to lesson or daily challenge
- 🔒 `GET /api/admin/quiz/get-by-id/{id}` — Get quiz details by ID
- 🔒 `PATCH /api/admin/quiz/update-quiz/{id}` — Update a quiz by ID
- 🔒 `DELETE /api/admin/quiz/delete-by-id/{id}` — Delete a quiz by ID
- 🔒 `GET /api/admin/quiz/download-quiz-template` — Download XLSX quiz template for bulk upload

## Admin-quiz-question-options
- 🔒 `POST /api/admin/quiz-question-options/create-option/{questionId}` — Add an option to a quiz question
- 🔒 `POST /api/admin/quiz-question-options/create-bulk-options/{questionId}` — Bulk create quiz options for a question
- 🔒 `PATCH /api/admin/quiz-question-options/update-option/{optionId}` — Update a quiz option
- 🔒 `PATCH /api/admin/quiz-question-options/update-sequence` — Update sequence of quiz question options
- 🔒 `DELETE /api/admin/quiz-question-options/delete-option/{id}` — Soft delete a quiz option

## Admin-quiz-question-responses
- 🔒 `POST /api/admin/quiz-question-responses/submit-response/{quizId}` — Submit multiple question responses for a quiz
- 🔒 `GET /api/admin/quiz-question-responses/get-responses` — Get quiz responses by user, quiz and context identifier

## Admin-quiz-questions
- 🔒 `POST /api/admin/quiz-questions/create-question-with-options/{quizId}` — Create a new quiz question
- 🔒 `GET /api/admin/quiz-questions/get-question-by-id/{id}` — Get quiz question by ID
- 🔒 `GET /api/admin/quiz-questions/get-all-questions/{quizId}` — Get all questions for a specific quiz
- 🔒 `PATCH /api/admin/quiz-questions/update-question-sequence` — Update sequence/order of quiz questions
- 🔒 `PATCH /api/admin/quiz-questions/toggle-required/{id}` — Toggle the required status of a quiz question
- 🔒 `PATCH /api/admin/quiz-questions/update-quiz-question/{id}` — Update quiz question text by ID
- 🔒 `DELETE /api/admin/quiz-questions/delete-by-id/{id}` — Delete quiz question by ID
- 🔒 `GET /api/admin/quiz-questions/download-quiz-template` — Download XLSX quiz template for bulk upload

## Admin-rewards
- 🔒 `POST /api/admin/rewards/add-rewards` — Create a new reward
- 🔒 `POST /api/admin/rewards/update-rewards/{id}` — Update an existing reward
- 🔒 `GET /api/admin/rewards/get-all` — Get all rewards with pagination
- 🔒 `GET /api/admin/rewards/get-all-admin-rewards` — Get all active rewards with pagination
- 🔒 `GET /api/admin/rewards/get-by-id/{id}` — Get reward by ID
- 🔒 `GET /api/admin/rewards/get-by-slug/{slug}` — Get reward by slug
- 🔒 `PATCH /api/admin/rewards/update-status/{id}` — Update the active status of a reward
- 🔒 `POST /api/admin/rewards/claim-reward/{id}` — Claim a reward by ID
- 🔒 `DELETE /api/admin/rewards/delete-by-id/{id}` — Soft delete a reward by its ID
- 🔒 `POST /api/admin/rewards/provider/create` — Create external reward provider
- 🔒 `GET /api/admin/rewards/provider/get-all` — Get all reward providers with pagination
- 🔒 `PATCH /api/admin/rewards/provider/update/{id}` — Update external reward provider
- 🔒 `PATCH /api/admin/rewards/provider/toggle-status/{id}` — Toggle active/inactive status of a provider
- 🔒 `POST /api/admin/rewards/provider/health` — Test a webhook endpoint
- 🔒 `DELETE /api/admin/rewards/provider/delete/{id}` — Delete reward provider

## Admin-share
- 🔒 `POST /api/share/add-share/{id}` — Create a share for a Post or Topic
- `GET /api/share/get-share/{id}` — Get a share entry by its Share ID
- `GET /api/share/get-share-news/{id}` — Get a share entry by its Share ID

## App
- `GET /api/health-check` — AppController_healthCheck

## External-daily-challenges
- `POST /api/external/daily-challenges/upload-url` — Generate a presigned S3 upload URL for daily challenge media
- `POST /api/external/daily-challenges/bulk-create` — Create multiple daily challenges from an uploaded JSON file using only app-key and app-secret

## File Upload
- 🔒 `POST /api/files-upload/{folder}` — Upload multiple files to S3

## Gateway
- 🔒 `GET /api/gateway/user/{id}` — Get one user from the current tenant
- 🔒 `GET /api/gateway/users/key-profile/{id}` — Get a user key profile from the current user
- 🔒 `GET /api/gateway/my-connections` — Get accepted connections for a user
- 🔒 `GET /api/gateway/users` — Get selected users from the current tenant

## HandCash
- `GET /api/handcash/redirect-url` — Redirect user to HandCash Connect login
- `GET /api/handcash/redirect` — Handle callback from HandCash Connect
- `POST /api/handcash/verify` — Verify or authenticate a HandCash user
- 🔒 `GET /api/handcash/connect-wallet` — Connect HandCash wallet and get balance + collection inventory
- 🔒 `GET /api/handcash/disconnect-wallet` — Disconnect HandCash wallet
- `GET /api/handcash/transactions` — Fetch HandCash transaction history
- `GET /api/handcash/inventory` — Fetch HandCash inventory items with pagination
- `GET /api/handcash/inventory/by-collection` — Get inventory for current domain collectionId (filters match GetItemsFilter)

## Identity - Credential Requests
- 🔒 `POST /api/identity/credential-requests/workforce` — Send a workforce credential request to a user. Tenant and issuer are resolved server-side.
- 🔒 `GET /api/identity/credential-requests/workforce/prefill/{subjectUserId}` — Get the latest stored workforce credential claim and wallet DID for a user.
- 🔒 `GET /api/identity/credential-requests` — List credential requests for admins.
- 🔒 `GET /api/identity/credential-requests/{id}` — Get credential request detail for admins.
- 🔒 `POST /api/identity/credential-requests/{id}/cancel` — Cancel a pending credential request.
- 🔒 `GET /api/identity/me/credential-requests` — List credential requests for the logged-in user.
- 🔒 `GET /api/identity/me/onboarding-invites` — List pending credential onboarding invites for the logged-in user.
- 🔒 `GET /api/identity/me/credential-requests/{id}` — Get logged-in user credential request detail including QR and tx_code.

## Identity - Credentials
- 🔒 `GET /api/identity/credentials/{credentialId}` — Fetch a stored issued credential by ID
- 🔒 `POST /api/identity/credentials/{credentialId}/revoke` — Revoke an issued credential
- 🔒 `POST /api/identity/credentials/verify` — Verify a credential signature, issuer trust, and optional stored credential status

## Identity - DID Documents
- `GET /api/identity/did/resolve/{did}` — Resolve a DID document from the current tenant identity registry
- `GET /api/identity/did/documents/{did}` — Fetch a public DID document from the current tenant identity registry

## Identity - Health
- `GET /api/identity/health` — Read safe identity module health/configuration information

## Identity - Issuers
- 🔒 `POST /api/identity/issuers` — Create a tenant issuer profile with did:web and a KMS-backed signing key

## Identity - OpenID4VP
- 🔒 `POST /api/identity/openid4vp/requests` — Create an OpenID4VP proof request QR for wallet presentation
- 🔒 `GET /api/identity/openid4vp/requests/{requestId}/status` — Get OpenID4VP request status and verified result

## Identity - OpenID4VP Public
- `GET /api/identity/openid4vp/public/tenants/{origin}/{baseOrigin}/{portalType}/requests/{requestId}` — Public wallet-facing OpenID4VP request object
- `GET /api/identity/openid4vp/public/tenants/{origin}/{baseOrigin}/{portalType}/children/{childTenantId}/requests/{requestId}` — Public wallet-facing child organization OpenID4VP request object
- `POST /api/identity/openid4vp/public/tenants/{origin}/{baseOrigin}/{portalType}/responses` — Public wallet-facing OpenID4VP presentation response endpoint
- `POST /api/identity/openid4vp/public/tenants/{origin}/{baseOrigin}/{portalType}/children/{childTenantId}/responses` — Public wallet-facing child organization OpenID4VP presentation response endpoint
- `POST /api/identity/openid4vp/public/tenants/{origin}/{baseOrigin}/{portalType}/login/requests` — Create a pre-login OpenID4VP request for VC login
- `GET /api/identity/openid4vp/public/tenants/{origin}/{baseOrigin}/{portalType}/login/requests/{requestId}/status` — Get pre-login OpenID4VP status
- `POST /api/identity/openid4vp/public/tenants/{origin}/{baseOrigin}/{portalType}/login/requests/{requestId}/exchange` — Exchange verified VC login request for Nomos auth tokens

## Identity - Public Credential Onboarding
- `GET /api/identity/onboarding/{token}` — Get public onboarding summary by token.
- `POST /api/identity/onboarding/{token}/kyc` — Mark public onboarding KYC as completed.
- `GET /api/identity/onboarding/{token}/credential-request` — Get the token-scoped credential request after KYC is complete.
- `POST /api/identity/onboarding/{token}/wallet-binding` — Bind onboarding to a wallet DID and create the credential request.

## Identity - Public DID Resolution
- `GET /api/identity/public/tenants/{origin}/{baseOrigin}/{portalType}/did-documents/{did}` — Fetch a public DID document without JWT or tenant headers using explicit public tenant routing fields
- `GET /api/identity/public/tenants/{origin}/{baseOrigin}/{portalType}/did-web/identity/issuers/{issuerSlug}/did.json` — Fetch a did:web-style issuer DID document without JWT or tenant headers using explicit public tenant routing fields
- `GET /api/identity/public/did-documents/{did}` — Fetch a public DID document using host-based tenant resolution. Intended for production host/domain routing.
- `GET /api/identity/public/did-web/identity/issuers/{issuerSlug}/did.json` — Fetch a did:web-style issuer DID document using host-based tenant resolution. Intended for production host/domain routing.

## Identity - Public Holder Binding
- `POST /api/identity/public/holder-binding/challenges` — Create a public holder proof-of-possession challenge for wallet/holder binding
- `POST /api/identity/public/holder-binding/verify-proof` — Verify holder proof-of-possession for a public challenge without issuing a credential

## Identity - Public OpenID4VCI Credential
- 🔒 `POST /api/identity/openid4vci/tenants/{origin}/{baseOrigin}/{portalType}/credential` — Issue a Verifiable Credential using an OpenID4VCI access token

## Identity - Public OpenID4VCI Metadata
- `GET /api/identity/openid4vci/tenants/{origin}/{baseOrigin}/{portalType}/.well-known/openid-credential-issuer` — Public OpenID4VCI credential issuer metadata for a Nomos tenant route
- `GET /api/identity/openid4vci/tenants/{origin}/{baseOrigin}/{portalType}/credential-issuer-metadata` — Public OpenID4VCI credential issuer metadata alias

## Identity - Public OpenID4VCI Token
- `POST /api/identity/openid4vci/tenants/{origin}/{baseOrigin}/{portalType}/token` — Exchange OpenID4VCI pre-authorized_code and optional tx_code for an access token

## Identity - Public Verification
- `GET /api/identity/public/tenants/{origin}/{baseOrigin}/{portalType}/status-lists/{statusListId}` — Fetch a public signed BitstringStatusListCredential without tenant headers or JWT
- `POST /api/identity/public/verifier/credential-status` — Public external verifier credential-status check using only the credential object

## Identity - Setup
- 🔒 `GET /api/identity/setup/workforce-issuer/status` — Check whether the current tenant has an active workforce credential issuer.
- 🔒 `POST /api/identity/setup/workforce-issuer` — Create the default active workforce credential issuer for the current tenant.

## Identity - Status Lists
- `POST /api/identity/status/verify-credential-status` — Externally verify a credential status using its signed BitstringStatusListCredential
- 🔒 `GET /api/identity/status/{tenantId}/{issuerId}/{purpose}/{listIndex}/metadata` — Fetch protected credential status-list metadata
- `GET /api/identity/status/{tenantId}/{issuerId}/{purpose}/{listIndex}` — Fetch a signed W3C BitstringStatusListCredential

## Identity - Trust Registry
- 🔒 `POST /api/identity/trust/issuers` — Add or update a trusted issuer by DID
- 🔒 `POST /api/identity/trust/issuers/by-profile` — Trust an existing active issuer profile
- 🔒 `POST /api/identity/trust/issuers/{issuerDid}/untrust` — Disable trust for an issuer DID

## Identity - Verifier
- 🔒 `POST /api/identity/verifier/stored-credential` — Verify a stored issued credential through the trust engine

## KYC
- 🔒 `POST /api/kyc/start` — Start a new KYC verification session
- 🔒 `GET /api/kyc/status` — Get current KYC verification status
- 🔒 `POST /api/kyc/upload-front` — Upload front of ID document
- 🔒 `POST /api/kyc/upload-back` — Upload back of ID document
- 🔒 `POST /api/kyc/upload-selfie` — Upload selfie for liveness and face match

## Membership
- 🔒 `GET /api/membership/plans` — Get active membership plans for the tenant
- 🔒 `GET /api/membership/me` — Get the current membership for the logged in user
- 🔒 `GET /api/membership/history` — Get membership history for the logged in user
- 🔒 `POST /api/membership/checkout-session` — Create a Stripe checkout session for a paid plan
- 🔒 `POST /api/membership/activate-free` — Activate a free membership plan or schedule fallback from a paid plan
- 🔒 `POST /api/membership/billing-portal-session` — Create a Stripe billing portal session
- 🔒 `POST /api/membership/upgrade` — Request an upgrade to a higher plan and wait for payment confirmation
- 🔒 `POST /api/membership/upgrade/cancel` — Cancel a pending membership upgrade before payment confirmation
- 🔒 `POST /api/membership/downgrade` — Downgrade the current membership to a lower plan
- 🔒 `POST /api/membership/downgrade/cancel` — Cancel a scheduled membership downgrade before it takes effect
- 🔒 `POST /api/membership/cancel` — Cancel the current membership at period end
- 🔒 `POST /api/membership/resume` — Resume the current membership before expiry
- 🔒 `GET /api/membership/admin/plans` — Get all membership plans for admin
- 🔒 `POST /api/membership/admin/plans` — Create a membership plan
- 🔒 `GET /api/membership/admin/plans/roles` — Get available roles for plan assignment
- 🔒 `PATCH /api/membership/admin/plans/{id}` — Update a membership plan
- 🔒 `DELETE /api/membership/admin/plans/{id}` — Delete a membership plan
- 🔒 `POST /api/membership/admin/plans/{id}/sync-stripe` — Sync a membership plan with Stripe product and price

## Messaging
- 🔒 `GET /api/messaging/session` — Create a messaging session for the current user

## Minter Integration
- 🔒 `POST /api/minter-integration/certificate/mint-requests` — Create a certificate wallet mint request in the certificate minter
- 🔒 `POST /api/minter-integration/token/nfts/create` — Create a token mint request in the token minter
- 🔒 `GET /api/minter-integration/certificate/forms/manage` — List tenant certificate minter templates through Nomos backend proxy
- 🔒 `POST /api/minter-integration/certificate/forms` — Create a tenant certificate minter template through Nomos backend proxy
- 🔒 `PATCH /api/minter-integration/certificate/forms/{templateId}` — Update a tenant certificate minter template through Nomos backend proxy
- 🔒 `DELETE /api/minter-integration/certificate/forms/{templateId}` — Delete a tenant certificate minter template through Nomos backend proxy
- 🔒 `GET /api/minter-integration/certificate/digital-signatures` — List tenant certificate minter signatures through Nomos backend proxy
- 🔒 `POST /api/minter-integration/certificate/digital-signatures` — Create a tenant certificate minter signature through Nomos backend proxy
- 🔒 `PATCH /api/minter-integration/certificate/digital-signatures/{signatureId}` — Update a tenant certificate minter signature through Nomos backend proxy
- 🔒 `DELETE /api/minter-integration/certificate/digital-signatures/{signatureId}` — Delete a tenant certificate minter signature through Nomos backend proxy
- 🔒 `PATCH /api/minter-integration/certificate/add-certificate-url` — Add a certificate URL to a tenant certificate minter signature through Nomos backend proxy
- 🔒 `POST /api/minter-integration/certificate/file-upload` — Upload a certificate template/signature asset through Nomos backend proxy
- 🔒 `GET /api/minter-integration/certificate/templates` — List certificate templates from the certificate minter
- 🔒 `GET /api/minter-integration/certificate/template-fields` — Get selected template fields from the certificate minter
- 🔒 `GET /api/minter-integration/token/collections` — List collections from the token minter
- 🔒 `POST /api/minter-integration/token/collections` — Create a tenant token minter collection through Nomos backend proxy
- 🔒 `POST /api/minter-integration/token/file-upload` — Upload a token collection asset through Nomos backend proxy
- 🔒 `PATCH /api/minter-integration/token/collections/{collectionId}` — Update a tenant token minter collection through Nomos backend proxy
- 🔒 `GET /api/minter-integration/external/tenant` — Get tenant details from the certificate minter
- 🔒 `GET /api/minter-integration/external/tenant/token` — Get tenant details from the token minter
- 🔒 `GET /api/minter-integration/reward-issuances` — List reward issuances for the current tenant
- 🔒 `POST /api/minter-integration/reward-issuances/retry-pending` — Retry pending or failed course reward issuances after wallet address becomes available

## NOMOS Credential Authenticator
- `GET /api/bsv-authenticator/redirect-url` — Fetch the NOMOS Credential wallet auth-provider start URL using tenant clientId stored in Buzzmint
- `GET /api/bsv-authenticator/start` — Redirect user to the NOMOS Credential wallet auth-provider start URL using tenant clientId stored in Buzzmint
- 🔒 `GET /api/bsv-authenticator/connect-destination` — Return onboarding URL for users without a Workforce VC, otherwise return normal wallet connect URL
- `GET /api/bsv-authenticator/login-url` — Generate wallet frontend login URL from NOMOS Credential authenticator using tenant clientId from Buzzmint DB
- `POST /api/bsv-authenticator/login-url` — Generate wallet frontend login URL from NOMOS Credential authenticator using tenant clientId from Buzzmint DB
- `POST /api/bsv-authenticator/exchange` — Exchange auth code for access and refresh tokens
- `POST /api/bsv-authenticator/verify` — Verify auth code and allow platform access without requiring collection NFT ownership
- 🔒 `POST /api/bsv-authenticator/connect` — Connect the authenticated Buzzmint account to a NOMOS Credential wallet, even when the wallet email differs
- 🔒 `POST /api/bsv-authenticator/disconnect` — Disconnect the authenticated Buzzmint account from its NOMOS Credential wallet
- `POST /api/bsv-authenticator/refresh` — Refresh access token
- `POST /api/bsv-authenticator/revoke` — Revoke token(s)

## New-Home
- 🔒 `GET /api/new-home` — Get all posts and news for home with pagination

## Notification-Preferences
- 🔒 `POST /api/notification-preferences/reset-to-defaults` — Resets the user notification preferences to the default state by deleting all their overrides.
- 🔒 `GET /api/notification-preferences` — Get the logged-in user notification preferences
- 🔒 `PATCH /api/notification-preferences/toggle-all` — Toggle the global notification setting for the user
- 🔒 `PATCH /api/notification-preferences/toggle` — Toggle a module or action notification preference
- 🔒 `PATCH /api/notification-preferences/bulk-toggle` — Toggle multiple module or action notification preferences at once

## Public-Certificates
- `GET /api/public/certificates/{shareToken}` — Get a public certificate by share token

## RabbitMQHealth
- `GET /api/rabbitmq/health` — RabbitMQHealthController_getHealth

## Superadmin-Auth
- `POST /api/super-admin/auth/login` — Login to the application
- `POST /api/super-admin/auth/forgot-password` — Initiate forgot password
- `POST /api/super-admin/auth/verify-reset-password-token` — Verify reset password token
- `POST /api/super-admin/auth/reset-password` — Reset password
- 🔒 `POST /api/super-admin/auth/change-password` — Change password
- 🔒 `POST /api/super-admin/auth/logout` — Logout and revoke the current session
- `POST /api/super-admin/auth/refresh-token` — Refresh access token

## Superadmin-Customers
- 🔒 `POST /api/super-admin/customers` — Create a new client portal
- 🔒 `GET /api/super-admin/customers` — Get a list of all client portals
- `POST /api/super-admin/customers/internal/wallet-client-id` — Internal: update tenant BSV wallet clientId and collectionId
- `POST /api/super-admin/customers/internal/admin-wallet-credential` — Internal: create or resolve the tenant admin sign-in VC offer
- 🔒 `POST /api/super-admin/customers/{id}/admin-wallet-onboarding/resend` — Retry combined tenant and wallet onboarding email
- `GET /api/super-admin/customers/all-tenants` — Get all tenants and child tenants data
- 🔒 `GET /api/super-admin/customers/get-customer/{id}` — Get client portal details by ID
- `GET /api/super-admin/customers/theme-settings` — Get theme settings for a customer based on domain
- 🔒 `PATCH /api/super-admin/customers/{id}/verify-customer` — Verify a client portal by ID
- 🔒 `PATCH /api/super-admin/customers/{id}/change-status` — Change status (activate/deactivate) of a client portal by ID
- 🔒 `DELETE /api/super-admin/customers/{id}` — Soft delete a client portal by ID
- 🔒 `PUT /api/super-admin/customers/{id}` — Update a customer by ID
- 🔒 `DELETE /api/super-admin/customers/{id}/hard-delete` — Hard delete a client portal by ID
- 🔒 `PUT /api/super-admin/customers/{id}/theme-settings` — Update theme settings for a client portal by ID
- 🔒 `PUT /api/super-admin/customers/{id}/restore-customer` — Restore a soft-deleted client portal by ID

## Superadmin-Domains
- 🔒 `GET /api/super-admin/domains` — Get all domains
- 🔒 `GET /api/super-admin/domains/{id}` — Get domain by ID
- 🔒 `PUT /api/super-admin/domains/{id}` — Update domain by ID
- 🔒 `DELETE /api/super-admin/domains/{id}` — Delete domain by domain ID
- 🔒 `GET /api/super-admin/domains/{id}/sso-settings` — Get SSO settings for a domain
- 🔒 `PATCH /api/super-admin/domains/{id}/sso-settings` — Create or update SSO settings for a domain
- 🔒 `GET /api/super-admin/domains/{id}/customer` — Get domain by customer ID
- 🔒 `PATCH /api/super-admin/domains/{id}/change-status` — Change domain status by domain ID
- 🔒 `POST /api/super-admin/domains/custom-domain/create` — Create a custom domain (request ACM & return CNAME)
- 🔒 `GET /api/super-admin/domains/custom-domain/get-by-id/{id}` — Fetch custom domain by ID
- 🔒 `GET /api/super-admin/domains/custom-domain/{id}/status` — Get/advance custom domain provisioning status
- 🔒 `GET /api/super-admin/domains/custom-domain/all` — List all custom domains
- 🔒 `GET /api/super-admin/domains/custom-domain/available` — List available custom base domains
- 🔒 `PATCH /api/super-admin/domains/disable-distribution/{id}` — Disable CloudFront distribution for a custom domain
- 🔒 `PATCH /api/super-admin/domains/enable-distribution/{id}` — Enable CloudFront distribution for a custom domain
- 🔒 `DELETE /api/super-admin/domains/custom/{id}` — Delete a custom domain by ID

## Superadmin-Permissions
- 🔒 `GET /api/super-admin/permissions/all-permissions-with-pagination` — Get all permissions with pagination
- 🔒 `GET /api/super-admin/permissions` — Get all permissions
- 🔒 `GET /api/super-admin/permissions/{id}` — Get permission by ID
- 🔒 `POST /api/super-admin/permissions/add-permissions` — Create multiple permissions
- 🔒 `POST /api/super-admin/permissions/add-permission` — Create a single permission
- 🔒 `POST /api/super-admin/permissions/update-permission/{id}` — Update a permission by ID
- 🔒 `POST /api/super-admin/permissions/update-permission-status/{id}` — Update the status of a permission
- 🔒 `POST /api/super-admin/permissions/sync-permissions` — Sync permissions for the Super-Admin
- 🔒 `POST /api/super-admin/permissions/delete-permission/{id}` — Delete a permission by ID

## Superadmin-Portals
- 🔒 `GET /api/super-admin/portals/get-counts-for-dashboard` — Get counts for dashboard

## Superadmin-Roles
- 🔒 `GET /api/super-admin/roles/fetch-all` — Fetch all roles
- 🔒 `GET /api/super-admin/roles/roles-with-user` — Fetch roles with associated users
- 🔒 `GET /api/super-admin/roles/role-by-id/{id}` — Fetch role by ID
- 🔒 `POST /api/super-admin/roles/add-role` — Add a new role
- 🔒 `PATCH /api/super-admin/roles/update-role/{id}` — Update an existing role
- 🔒 `PATCH /api/super-admin/roles/assign-permissions-role/{id}` — Assign permissions to a role
- 🔒 `PATCH /api/super-admin/roles/update-role-status/{id}` — Update role status
- 🔒 `PATCH /api/super-admin/roles/restore-role/{id}` — Restore a role by ID
- 🔒 `DELETE /api/super-admin/roles/delete-role/{id}` — Delete a role by ID

## Superadmin-Settings
- 🔒 `POST /api/super-admin/settings/add-setting` — Add a new setting
- 🔒 `GET /api/super-admin/settings/fetch-all` — Fetch all settings
- 🔒 `GET /api/super-admin/settings/fetch-editable` — Fetch editable settings
- 🔒 `GET /api/super-admin/settings/fetch/{id}` — Fetch setting by ID
- 🔒 `PUT /api/super-admin/settings/update/{id}` — Update setting by ID
- 🔒 `PUT /api/super-admin/settings/update-setting-value` — Update setting value by key
- 🔒 `DELETE /api/super-admin/settings/soft-delete/{id}` — Delete setting by ID

## Superadmin-Stripe-Webhooks-Ops
- 🔒 `POST /api/super-admin/stripe-webhooks-ops/replay` — Replay a failed Stripe webhook event for a tenant
- 🔒 `POST /api/super-admin/stripe-webhooks-ops/setup` — Set up Stripe credentials and webhook endpoint for a tenant

## Superadmin-Users
- 🔒 `GET /api/super-admin/users` — Get all users
- 🔒 `GET /api/super-admin/users/profile` — Get the logged in user
- 🔒 `PUT /api/super-admin/users/profile` — Update the logged in user
- 🔒 `GET /api/super-admin/users/{id}` — Get the user by id
- 🔒 `PUT /api/super-admin/users/{id}` — Update user by id
- 🔒 `DELETE /api/super-admin/users/{id}` — Delete User
- 🔒 `POST /api/super-admin/users/add-user/{roleId}` — Create a new user
- 🔒 `PATCH /api/super-admin/users/toggle-isActive/{id}` — Update the logged in user
- 🔒 `PATCH /api/super-admin/users/restore/{id}` — Restore a deleted user
- 🔒 `DELETE /api/super-admin/users/{id}/hard` — Hard Delete User

## Superadmin-faq
- 🔒 `POST /api/super-admin/faq/create-faq` — Create a new FAQ
- 🔒 `GET /api/super-admin/faq/get-all-faqs` — Get all Help FAQs with pagination
- 🔒 `GET /api/super-admin/faq/get-by-id/{id}` — Get a Help FAQ by ID
- 🔒 `PATCH /api/super-admin/faq/update-faq/{id}` — Update a Help FAQ by ID
- 🔒 `PATCH /api/super-admin/faq/update-fqa-sequence` — Update FAQ sequences in bulk
- 🔒 `DELETE /api/super-admin/faq/delete-faq/{id}` — Delete a Help FAQ by ID

## Verification
- 🔒 `POST /api/verification/sessions` — Create a verification session
- 🔒 `GET /api/verification/sessions/{sessionId}` — Get a verification session
- 🔒 `GET /api/verification/sessions/{sessionId}/status` — Get verification session status
- 🔒 `GET /api/verification/audit` — List verification audit history with filters and pagination
- 🔒 `GET /api/verification/audit/{auditId}` — Get an audit-safe verification audit record
- 🔒 `POST /api/verification/sessions/{sessionId}/cancel` — Cancel an active verification session

## Verification - Public
- `GET /api/verification/public/v/{reference}` — Resolve a public Nomos verification reference

## Wallet
- 🔒 `GET /api/wallet/frontend-url` — Get the Nomos Credential Wallet frontend URL
- 🔒 `GET /api/wallet/verifiable-credentials` — List Verifiable Credentials stored in the currently connected Nomos wallet
- 🔒 `GET /api/wallet/bsv/assets` — List assets for the currently connected NOMOS Credential wallet

## Web2 Certificates
- 🔒 `GET /api/certificate/web2/template-fields` — Get selected template fields from the certificate minter for WEB2
- 🔒 `POST /api/certificate/web2/reward-issuances/retry-pending` — Retry pending or failed course reward issuances for WEB2

## notification
- 🔒 `GET /api/notification` — NotificationController_getNotifications
- 🔒 `POST /api/notification/mark-all-read` — NotificationController_markAllRead
- 🔒 `POST /api/notification/mark-read` — NotificationController_markRead
- 🔒 `GET /api/notification/get-notification-modules` — Get notification modules menu items for logged in user
- 🔒 `POST /api/notification/sync-notification-modules` — Sync notification modules menu items for current portal

