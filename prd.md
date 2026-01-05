Backend Product Requirement Document (PRD): MarketReplica B2B Marketplace
1. Technical Stack & Infrastructure
1.1 Technology Stack

Framework: NestJS (TypeScript)
Database: MySQL 8.0+
Cache Layer: Redis 6.0+
ORM: TypeORM
Authentication: JWT (JSON Web Tokens)
File Storage: AWS S3 / Local Storage (configurable)
Real-time: Socket.io (for chat and notifications)
Job Queue: Bull (Redis-based)
Email Service: SendGrid / AWS SES
SMS Service: Twilio
WhatsApp: Twilio WhatsApp Business API

1.2 Architecture Patterns

Modular Monolith Architecture
Repository Pattern
Service Layer Pattern
CQRS for complex queries
Event-driven for notifications


3. Redis Cache Schema Design
3.1 Cache Keys Structure
typescript// User Sessions
`session:${userId}` // TTL: 24 hours
// Value: { userId, email, role, lastActivity, permissions }

// Product Cache
`product:${productId}` // TTL: 1 hour
`product:slug:${slug}` // TTL: 1 hour

// Category Cache
`category:${categoryId}` // TTL: 6 hours
`category:tree` // TTL: 12 hours (entire category hierarchy)

// Search Results
`search:${hash(query+filters)}` // TTL: 15 minutes

// Supplier Profile
`supplier:${supplierId}:profile` // TTL: 1 hour
`supplier:${supplierId}:stats` // TTL: 5 minutes

// Buy Lead Cache
`lead:${leadId}` // TTL: 30 minutes
`lead:active:${categoryId}` // TTL: 10 minutes (list of active leads)

// Rate Limiting
`ratelimit:${userId}:${action}` // TTL: varies by action
`ratelimit:ip:${ipAddress}:${action}` // TTL: varies by action

// Notification Queue
`notification:queue:${userId}` // List type
`notification:pending:${notificationId}` // Hash type

// Search Suggestions (Auto-complete)
`suggestions:product` // Sorted Set, TTL: 24 hours
`suggestions:category` // Sorted Set, TTL: 24 hours

// Online Users (Real-time)
`online:users` // Sorted Set with timestamp scores

// Lead Distribution Queue
`lead:distribution:pending` // List of lead IDs pending distribution

// Popular Products
`products:popular:daily` // Sorted Set by view count
`products:popular:weekly` // Sorted Set by view count

// Supplier Trust Score
`supplier:${supplierId}:trustscore` // TTL: 1 hour

4. API Endpoints Specification
4.1 Authentication Module
POST /api/v1/auth/register
Register a new user (buyer or supplier)
typescriptRequest Body:
{
  "email": "string",
  "phone": "string",
  "password": "string",
  "role": "buyer" | "supplier",
  "firstName": "string",
  "lastName": "string",
  "companyName": "string" // optional for buyers
}

Response: 201 Created
{
  "success": true,
  "data": {
    "user": {
      "id": "string",
      "email": "string",
      "role": "string"
    },
    "accessToken": "string",
    "refreshToken": "string"
  }
}
POST /api/v1/auth/login
User login
typescriptRequest Body:
{
  "email": "string",
  "password": "string"
}

Response: 200 OK
{
  "success": true,
  "data": {
    "user": {...},
    "accessToken": "string",
    "refreshToken": "string"
  }
}
POST /api/v1/auth/refresh-token
Refresh access token
POST /api/v1/auth/logout
Logout user
POST /api/v1/auth/forgot-password
Request password reset
POST /api/v1/auth/reset-password
Reset password with token
POST /api/v1/auth/verify-email
Verify email with OTP/token
POST /api/v1/auth/verify-phone
Verify phone with OTP

4.2 User Profile Module
GET /api/v1/users/profile
Get current user profile
PUT /api/v1/users/profile
Update user profile
typescriptRequest Body:
{
  "firstName": "string",
  "lastName": "string",
  "companyName": "string",
  "companyType": "string",
  "gstNumber": "string",
  "address": {...},
  "website": "string"
}
POST /api/v1/users/profile/logo
Upload company logo (multipart/form-data)
GET /api/v1/users/:userId/public-profile
Get public profile of a user (supplier)

4.3 Category Module
GET /api/v1/categories
Get category tree
typescriptResponse: 200 OK
{
  "success": true,
  "data": {
    "categories": [
      {
        "id": "string",
        "name": "string",
        "slug": "string",
        "level": 1,
        "children": [...]
      }
    ]
  }
}
GET /api/v1/categories/:categoryId
Get category details with subcategories
GET /api/v1/categories/:categoryId/products
Get products in a category (with pagination)
GET /api/v1/categories/search
Search categories by keyword

4.4 Product Module
POST /api/v1/products [Supplier Only]
Create a new product
typescriptRequest Body:
{
  "name": "string",
  "categoryId": "string",
  "description": "string",
  "specifications": {...},
  "minOrderQuantity": number,
  "unit": "string",
  "price": number,
  "priceType": "fixed" | "negotiable" | "rfq",
  "stockStatus": "string"
}

Response: 201 Created
GET /api/v1/products/:productId
Get product details
typescriptResponse: 200 OK
{
  "success": true,
  "data": {
    "product": {
      "id": "string",
      "name": "string",
      "description": "string",
      "price": number,
      "supplier": {
        "id": "string",
        "companyName": "string",
        "trustScore": number,
        "isVerified": boolean
      },
      "images": [...],
      "videos": [...],
      "specifications": {...}
    }
  }
}
PUT /api/v1/products/:productId [Supplier Only]
Update product details
DELETE /api/v1/products/:productId [Supplier Only]
Delete product (soft delete)
GET /api/v1/products
Search/List products with filters
typescriptQuery Parameters:
- q: string (search query)
- categoryId: string
- city: string
- state: string
- minPrice: number
- maxPrice: number
- sortBy: "relevance" | "price_asc" | "price_desc" | "newest"
- page: number
- limit: number

Response: 200 OK
{
  "success": true,
  "data": {
    "products": [...],
    "pagination": {
      "total": number,
      "page": number,
      "limit": number,
      "totalPages": number
    },
    "filters": {
      "categories": [...],
      "cities": [...],
      "priceRange": {...}
    }
  }
}
POST /api/v1/products/:productId/images [Supplier Only]
Upload product images (multipart/form-data)
DELETE /api/v1/products/:productId/images/:imageId [Supplier Only]
Delete product image
POST /api/v1/products/:productId/videos [Supplier Only]
Add product video (upload or URL)
POST /api/v1/products/bulk-upload [Supplier Only]
Bulk upload products via CSV/Excel
GET /api/v1/products/:productId/similar
Get similar products
POST /api/v1/products/:productId/view
Track product view (analytics)

4.5 Buy Leads (RFQ) Module
POST /api/v1/leads [Buyer Only]
Create a new buy lead
typescriptRequest Body:
{
  "productName": "string",
  "categoryId": "string",
  "description": "string",
  "quantity": number,
  "unit": "string",
  "budgetMin": number,
  "budgetMax": number,
  "deliveryLocation": "string",
  "city": "string",
  "state": "string",
  "requiredByDate": "date"
}

Response: 201 Created
{
  "success": true,
  "data": {
    "lead": {
      "id": "string",
      "uuid": "string",
      ...
    },
    "distributionCount": number
  }
}
GET /api/v1/leads/:leadId [Authenticated]
Get lead details
GET /api/v1/leads/my-leads [Buyer Only]
Get buyer's own leads
typescriptQuery Parameters:
- status: "open" | "closed" | "expired"
- page: number
- limit: number
**Continue4 JanGET /api/v1/leads/available** [Supplier Only]
Get leads available for supplier (matched by category/location)
typescriptQuery Parameters:
- categoryId: string
- isPurchased: boolean
- page: number
- limit: number

Response: 200 OK
{
  "success": true,
  "data": {
    "leads": [
      {
        "id": "string",
        "productName": "string",
        "quantity": number,
        "city": "string",
        "isPurchased": boolean,
        "distributionScore": number,
        "postedAt": "timestamp"
      }
    ]
  }
}
POST /api/v1/leads/:leadId/purchase [Supplier Only]
Purchase access to a lead
typescriptResponse: 200 OK
{
  "success": true,
  "data": {
    "lead": {...}, // Full lead details
    "buyerContact": {
      "name": "string",
      "phone": "string",
      "email": "string"
    }
  }
}
PUT /api/v1/leads/:leadId/status [Buyer Only]
Update lead status (close/cancel)
POST /api/v1/leads/:leadId/respond [Supplier Only]
Respond to a lead with quote
typescriptRequest Body:
{
  "message": "string",
  "quotedPrice": number,
  "quotedQuantity": number,
  "deliveryTime": "string",
  "attachments": [...]
}
GET /api/v1/leads/:leadId/responses [Buyer Only]
Get all responses for a lead
PUT /api/v1/leads/distributions/:distributionId/status [Supplier Only]
Update lead distribution status (contacted, quoted, closed, irrelevant)

4.6 Communication Module
GET /api/v1/conversations
Get user's conversations list
typescriptQuery Parameters:
- search: string
- page: number
- limit: number

Response: 200 OK
{
  "success": true,
  "data": {
    "conversations": [
      {
        "id": "string",
        "otherUser": {...},
        "lastMessage": "string",
        "lastMessageAt": "timestamp",
        "unreadCount": number
      }
    ]
  }
}
GET /api/v1/conversations/:conversationId
Get conversation details with message history
POST /api/v1/conversations
Create a new conversation
typescriptRequest Body:
{
  "recipientId": "string",
  "productId": "string", // optional
  "leadId": "string", // optional
  "message": "string"
}
POST /api/v1/conversations/:conversationId/messages
Send a message in conversation
typescriptRequest Body:
{
  "message": "string",
  "attachments": [...] // optional
}
PUT /api/v1/conversations/:conversationId/read
Mark conversation as read
POST /api/v1/conversations/:conversationId/archive
Archive conversation

4.7 Verification Module
POST /api/v1/verifications/apply [Supplier Only]
Apply for supplier verification
typescriptRequest Body:
{
  "verificationType": "basic" | "trustseal" | "premium",
  "documents": [
    {
      "type": "gst_certificate",
      "url": "string"
    },
    {
      "type": "pan_card",
      "url": "string"
    }
  ]
}
GET /api/v1/verifications/my-verifications [Supplier Only]
Get supplier's verification status
GET /api/v1/verifications/pending [Admin Only]
Get pending verifications
PUT /api/v1/verifications/:verificationId/approve [Admin Only]
Approve verification
PUT /api/v1/verifications/:verificationId/reject [Admin Only]
Reject verification with reason

4.8 Rating & Review Module
POST /api/v1/ratings [Buyer Only]
Submit supplier rating
typescriptRequest Body:
{
  "supplierId": "string",
  "leadId": "string",
  "rating": 1-5,
  "review": "string",
  "responseTimeRating": 1-5,
  "productQualityRating": 1-5,
  "communicationRating": 1-5
}
GET /api/v1/ratings/supplier/:supplierId
Get supplier ratings
typescriptQuery Parameters:
- page: number
- limit: number
- sortBy: "newest" | "highest" | "lowest"
GET /api/v1/ratings/pending-approval [Admin Only]
Get ratings pending approval
PUT /api/v1/ratings/:ratingId/approve [Admin Only]
Approve rating

4.9 Notification Module
GET /api/v1/notifications
Get user notifications
typescriptQuery Parameters:
- isRead: boolean
- type: string
- page: number
- limit: number

Response: 200 OK
{
  "success": true,
  "data": {
    "notifications": [
      {
        "id": "string",
        "type": "string",
        "title": "string",
        "message": "string",
        "data": {...},
        "isRead": boolean,
        "createdAt": "timestamp"
      }
    ],
    "unreadCount": number
  }
}
PUT /api/v1/notifications/:notificationId/read
Mark notification as read
PUT /api/v1/notifications/read-all
Mark all notifications as read
DELETE /api/v1/notifications/:notificationId
Delete notification
PUT /api/v1/notifications/preferences
Update notification preferences
typescriptRequest Body:
{
  "emailNotifications": boolean,
  "smsNotifications": boolean,
  "whatsappNotifications": boolean,
  "types": {
    "newLead": boolean,
    "leadResponse": boolean,
    "newMessage": boolean,
    "productApproval": boolean
  }
}

4.10 Subscription & Payment Module
GET /api/v1/subscriptions/plans
Get available subscription plans
POST /api/v1/subscriptions/subscribe
Subscribe to a plan
typescriptRequest Body:
{
  "planType": "basic" | "premium" | "enterprise",
  "billingCycle": "monthly" | "yearly"
}

Response: 201 Created
{
  "success": true,
  "data": {
    "subscription": {...},
    "paymentLink": "string" // Payment gateway URL
  }
}
GET /api/v1/subscriptions/my-subscription
Get current subscription details
POST /api/v1/subscriptions/cancel
Cancel subscription
GET /api/v1/payments/history
Get payment history
POST /api/v1/payments/webhook
Payment gateway webhook (verify signature)

4.11 Promotion Module
POST /api/v1/promotions [Supplier Only]
Create promoted listing
typescriptRequest Body:
{
  "productId": "string",
  "promotionType": "featured" | "top_search" | "category_top",
  "dailyBudget": number,
  "duration": number, // days
  "startsAt": "date"
}
GET /api/v1/promotions/my-promotions [Supplier Only]
Get supplier's promotions
PUT /api/v1/promotions/:promotionId/pause [Supplier Only]
Pause promotion
PUT /api/v1/promotions/:promotionId/resume [Supplier Only]
Resume promotion
GET /api/v1/promotions/:promotionId/stats [Supplier Only]
Get promotion analytics

4.12 Search & Discovery Module
GET /api/v1/search/suggestions
Get search auto-suggestions
typescriptQuery Parameters:
- q: string (partial query)
- type: "products" | "categories" | "suppliers"

Response: 200 OK
{
  "success": true,
  "data": {
    "suggestions": ["string", ...]
  }
}
GET /api/v1/search/trending
Get trending searches
POST /api/v1/search/log
Log search activity (for analytics)

4.13 Analytics & Dashboard Module
GET /api/v1/dashboard/buyer [Buyer Only]
Get buyer dashboard data
typescriptResponse: 200 OK
{
  "success": true,
  "data": {
    "activeLeads": number,
    "totalResponses": number,
    "savedSuppliers": number,
    "recentActivity": [...]
  }
}
GET /api/v1/dashboard/supplier [Supplier Only]
Get supplier dashboard data
typescriptResponse: 200 OK
{
  "success": true,
  "data": {
    "totalProducts": number,
    "productViews": number,
    "leadsPurchased": number,
    "activeConversations": number,
    "trustScore": number,
    "analytics": {
      "viewsThisMonth": number,
      "inquiriesThisMonth": number
    }
  }
}
GET /api/v1/analytics/products/:productId [Supplier Only]
Get product analytics
GET /api/v1/analytics/leads/:leadId [Buyer Only]
Get lead analytics

4.14 Admin Module
GET /api/v1/admin/dashboard
Admin dashboard overview
GET /api/v1/admin/users
List all users with filters
PUT /api/v1/admin/users/:userId/status
Update user status (suspend/activate)
GET /api/v1/admin/products/pending
Get products pending approval
PUT /api/v1/admin/products/:productId/approve
Approve product
PUT /api/v1/admin/products/:productId/reject
Reject product
GET /api/v1/admin/reports/spam
Get spam reports
GET /api/v1/admin/analytics/overview
Platform-wide analytics

5. Backend Implementation Steps
Phase 1: Foundation Setup (Week 1-2)
Step 1.1: Project Initialization
bash# Create NestJS project
nest new marketreplica-backend

# Install core dependencies
npm install @nestjs/typeorm typeorm mysql2
npm install @nestjs/config
npm install @nestjs/jwt @nestjs/passport passport passport-jwt
npm install bcrypt class-validator class-transformer
npm install redis ioredis
npm install @nestjs/bull bull
npm install @nestjs/websockets @nestjs/platform-socket.io
```

#### Step 1.2: Project Structure
```
src/
├── common/
│   ├── decorators/
│   ├── filters/
│   ├── guards/
│   ├── interceptors/
│   ├── pipes/
│   └── utils/
├── config/
│   ├── database.config.ts
│   ├── redis.config.ts
│   ├── jwt.config.ts
│   └── app.config.ts
├── modules/
│   ├── auth/
│   ├── users/
│   ├── categories/
│   ├── products/
│   ├── leads/
│   ├── conversations/
│   ├── notifications/
│   ├── payments/
│   ├── search/
│   └── admin/
├── shared/
│   ├── entities/
│   ├── repositories/
│   └── services/
├── app.module.ts
└── main.ts
Step 1.3: Configuration Setup
typescript// config/database.config.ts
export default () => ({
  database: {
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 3306,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: ['dist/**/*.entity{.ts,.js}'],
    synchronize: process.env.NODE_ENV === 'development',
    logging: process.env.NODE_ENV === 'development',
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    password: process.env.REDIS_PASSWORD,
  },
});

Phase 2: Core Modules Implementation (Week 3-5)
Step 2.1: Authentication Module

Implement JWT authentication
Email/Phone verification with OTP
Password reset flow
Session management with Redis
Rate limiting for auth endpoints

Step 2.2: User Management Module

User CRUD operations
Profile management
Role-based access control (RBAC)
User activity logging

Step 2.3: Category Module

Category tree structure
Caching with Redis
Category-based filtering


Phase 3: Product & Lead Management (Week 6-8)
Step 3.1: Product Module

Product CRUD with validation
Image/video upload (S3 integration)
Bulk upload processing (Queue)
Full-text search indexing
Product view tracking

Step 3.2: Buy Leads Module

Lead creation with validation
Lead Distribution Algorithm:

typescript  // Lead distribution logic
  async distributeLead(leadId: string) {
    const lead = await this.findLead(leadId);
    
    // Find matching suppliers
    const suppliers = await this.findMatchingSuppliers({
      categoryId: lead.categoryId,
      city: lead.city,
      state: lead.state,
      isActive: true,
      hasActiveSubscription: true
    });
    
    // Score suppliers based on:
    // - Category match (40%)
    // - Location proximity (30%)
    // - Trust score (20%)
    // - Response rate (10%)
    const scoredSuppliers = this.scoreSuppliers(suppliers, lead);
    
    // Distribute to top 5-10 suppliers
    const selectedSuppliers = scoredSuppliers.slice(0, 10);
    
    // Create distribution records
    await this.createDistributions(lead, selectedSuppliers);
    
    // Queue notifications
    await this.notificationService.notifySuppliers(selectedSuppliers, lead);
  }
Step 3.3: Lead Response Module

Quote submission
Response tracking
Buyer-supplier matching


Phase 4: Communication & Notifications (Week 9-10)
Step 4.1: Chat System

WebSocket implementation with Socket.io
Conversation management
Message delivery tracking
File attachments

Step 4.2: Notification System

Multi-channel notifications (Email, SMS, WhatsApp)
Notification preferences
Queue-based delivery with Bull
Template management

Notification Queue Implementation:
typescript// notifications/notifications.processor.ts
@Processor('notifications')
export class NotificationsProcessor {
  @Process('send-email')
  async sendEmail(job: Job) {
    const { userId, type, data } = job.data;
    // Send email logic
  }
  
  @Process('send-sms')
  async sendSMS(job: Job) {
    // SMS sending logic via Twilio
  }
  
  @Process('send-whatsapp')
  async sendWhatsApp(job: Job) {
    // WhatsApp messaging via Twilio
  }
}

Phase 5: Search & Discovery (Week 11-12)
Step 5.1: Search Implementation

Full-text search with MySQL
Caching search results
Search suggestions
Trending searches tracking

Search Algorithm:
typescriptasync searchProducts(query: SearchQueryDto) {
  const cacheKey = `search:${this.generateHash(query)}`;
  
  // Check cache
  const cached = await this.redis.get(cacheKey);
  if (cached) return JSON.parse(cached);
  
  // Build search query
  const queryBuilder = this.productRepository
    .createQueryBuilder('product')
    .leftJoinAndSelect('product.supplier', 'supplier')
    .leftJoinAndSelect('product.category', 'category')
    .where('product.status = :status', { status: 'active' });
  
  // Full-text search
  if (query.q) {
    queryBuilder.andWhere(
      'MATCH(product.name, product.description) AGAINST (:query IN NATURAL LANGUAGE MODE)',
      { query: query.q }
    );
  }
  
  // Apply filters
  if (query.categoryId) {
    queryBuilder.andWhere('product.categoryId = :categoryId', {
      categoryId: query.categoryId
    });
  }
  
  // Sorting
  switch (query.sortBy) {
    case 'price_asc':
      queryBuilder.orderBy('product.price', 'ASC');
      break;
    case 'price_desc':
      queryBuilder.orderBy('product.price', 'DESC');
      break;
    case 'newest':
      queryBuilder.orderBy('product.createdAt', 'DESC');
      break;
    default:
      // Relevance score for full-text search
      queryBuilder.orderBy('product.viewCount', 'DESC');
  }
  
  // Pagination
  const [products, total] = await queryBuilder
    .skip((query.page - 1) * query.limit)
    .take(query.limit)
    .getManyAndCount();
  
  const result = { products, total, page: query.page };
  
  // Cache results
  await this.redis.setex(cacheKey, 900, JSON.stringify(result));
  
  return result;
}

Phase 6: Payments & Subscriptions (Week 13-14)
Step 6.1: Subscription Management

Plan management
Subscription lifecycle
Feature access control
Usage tracking

Step 6.2: Payment Integration

Payment gateway integration (Razorpay/Stripe)
Webhook handling
Transaction logging
Invoice generation


Phase 7: Admin Panel & Analytics (Week 15-16)
Step 7.1: Admin Module

User management
Content moderation
Platform analytics
System health monitoring

Step 7.2: Analytics

User activity tracking
Product performance metrics
Lead conversion tracking
Revenue analytics


6. Additional Backend Components
6.1 Middleware & Guards
typescript// guards/roles.guard.ts
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    
    if (!requiredRoles) return true;
    
    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.some((role) => user.role === role);
  }
}
6.2 Error Handling
typescript// filters/http-exception.filter.ts
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();
    
    response.status(status).json({
      success: false,
      statusCode: status,
      timestamp: new Date().toISOString(),
      message: exceptionResponse['message'] || exception.message,
      errors: exceptionResponse['errors'] || null,
    });
  }
}
6.3 Validation Pipes
typescript// Use class-validator and class-transformer
export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  name: string;
  
  @IsNotEmpty()
  @IsUUID()
  categoryId: string;
  
  @IsOptional()
  @IsNumber()
  @Min(0)
  price: number;
  
  @IsEnum(PriceType)
  priceType: PriceType;
}

7. Background Jobs & Queues
7.1 Job Types
typescript// Lead Distribution Job
@Processor('leads')
export class LeadsProcessor {
  @Process('distribute-lead')
  async handleLeadDistribution(job: Job) {
    const { leadId } = job.data;
    await this.leadService.distributeLead(leadId);
  }
  
  @Process('expire-leads')
  @Cron('0 * * * *') // Every hour
  async expireOldLeads() {
    await this.leadService.expireOldLeads();
  }
}

// Notification Jobs
@Processor('notifications')
export class NotificationsProcessor {
  @Process({ name: 'send-batch', concurrency: 5 })
  async sendBatchNotifications(job: Job) {
    // Batch notification sending
  }
}

// Search Index Update
@Processor('search')
export class SearchProcessor {
  @Process('update-index')
  async updateSearchIndex(job: Job) {
    // Update search index for products
  }
}

// Analytics Aggregation
@Processor('analytics')
export class AnalyticsProcessor {
  @Cron('0 0 * * *') // Daily at midnight
  @Process('aggregate-daily-stats')
  async aggregateDailyStats() {
    // Aggregate daily statistics
  }
}

8. Security Measures
8.1 Security Implementation
typescript// Rate Limiting
@Injectable()
export class RateLimitGuard implements CanActivate {
  constructor(private redis: Redis) {}
  
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const key = `ratelimit:${request.user?.id || request.ip}:${request.path}`;
    
    const requests = await this.redis.incr(key);
    if (requests === 1) {
      await this.redis.expire(key, 60); // 1 minute window
    }
    
    if (requests > 100) { // 100 requests per minute
      throw new ThrottlerException();
    }
    
    return true;
  }
}

// Input Sanitization
@Injectable()
export class SanitizationPipe implements PipeTransform {
  transform(value: any) {
    if (typeof value === 'string') {
      return sanitizeHtml(value, {
        allowedTags: [],
        allowedAttributes: {}
      });
    }
    return value;
  }
}

// SQL Injection Prevention (via TypeORM parameters)
// XSS Prevention (via sanitization)
// CSRF Protection (via tokens)

9. Testing Strategy
9.1 Test Coverage
typescript// Unit Tests
describe('ProductService', () => {
  it('should create a product', async () => {
    const dto = { name: 'Test Product', ... };
    const result = await service.create(dto);
    expect(result).toBeDefined();
  });
});

// Integration Tests
describe('Product API', () => {
  it('POST /products should create product', async () => {
    return request(app.getHttpServer())
      .post('/api/v1/products')
      .send(productData)
      .expect(201);
  });
});

// E2E Tests
describe('Lead Distribution Flow', () => {
  it('should distribute lead to matching suppliers', async () => {
    // Complete flow test
  });
});

10. Deployment & DevOps
10.1 Environment Setup
bash# .env.production
NODE_ENV=production
PORT=3000

# Database
DB_HOST=your-db-host
DB_PORT=3306
DB_USERNAME=your-username
DB_PASSWORD=your-password
DB_NAME=marketreplica

# Redis
REDIS_HOST=your-redis-host
REDIS_PORT=6379
REDIS_PASSWORD=your-redis-password

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h

# AWS S3
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
AWS_S3_BUCKET=your-bucket

# External Services
TWILIO_ACCOUNT_SID=your-sid
TWILIO_AUTH_TOKEN=your-token
SENDGRID_API_KEY=your-key

# Payment Gateway
RAZORPAY_KEY_ID=your-key
RAZORPAY_KEY_SECRET=your-secret
10.2 Docker Setup
dockerfile# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["node", "dist/main"]
yaml# docker-compose.yml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    depends_on:
      - mysql
      - redis
    environment:
      - NODE_ENV=production
  
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_DATABASE: marketreplica
      MYSQL_ROOT_PASSWORD: password
    volumes:
      - mysql_data:/var/lib/mysql
  
  redis:
    image: redis:6-alpine
    volumes:
      - redis_data:/data

volumes:
  mysql_data:
  redis_data:

11. Monitoring & Logging
typescript// Logger setup
import { Logger } from '@nestjs/common';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);
  
  async someMethod() {
    this.logger.log('Processing request');
    this.logger.error('Error occurred', trace);
    this.logger.warn('Warning message');
  }
}

// Health Check
@Controller('health')
export class HealthController {
  @Get()
  check() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: 'connected',
      redis: 'connected'
    };
  }
}

12. Performance Optimization
12.1 Database Optimization

Proper indexing on frequently queried columns
Query optimization with EXPLAIN
Connection pooling
Read replicas for scaling

12.2 Caching Strategy

Cache frequently accessed data (categories, popular products)
Cache search results
Use Redis for session management
Implement cache invalidation strategy

12.3 API Optimization

Response compression
Pagination for list endpoints
Field selection (allow clients to specify fields)
ETags for conditional requests