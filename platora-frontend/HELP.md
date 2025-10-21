# Project Structure for Frontend of Platora

```text
/app
├─ layout.tsx              # Global layout (Navbar, Footer, ThemeProvider)
├─ globals.css             # Tailwind base styles
├─ page.tsx                # Landing page (general info, call-to-action)

├─ auth/                   # Authentication (secure login/signup)
│   ├─ login/page.tsx
│   ├─ signup/page.tsx
│   └─ profile/page.tsx

├─ customer/               # Customer-facing module
│   ├─ restaurants/page.tsx    # Browse restaurants
│   ├─ restaurant/[id]/page.tsx # Menu for a restaurant
│   ├─ cart/page.tsx            # Cart + checkout UI
│   ├─ orders/page.tsx          # Order history
│   └─ track/[id]/page.tsx      # Live order tracking

├─ restaurant/             # Restaurant dashboard
│   ├─ dashboard/page.tsx       # Overview of orders & sales
│   ├─ menu/page.tsx            # Manage menu items
│   ├─ orders/page.tsx          # Accept/reject & update orders
│   └─ reports/page.tsx         # Sales & analytics

├─ delivery/               # Delivery agent module
│   ├─ dashboard/page.tsx       # Assigned deliveries
│   └─ order/[id]/page.tsx      # Update status (Picked → Delivered)

├─ admin/                  # Admin panel
│   ├─ dashboard/page.tsx       # Overview stats
│   ├─ users/page.tsx           # Manage all users (CRUD)
│   ├─ restaurants/page.tsx     # Manage restaurants
│   ├─ deliveries/page.tsx      # Assign/reassign delivery agents
│   └─ reports/page.tsx         # Global analytics

├─ payments/               # Payment & billing
│   ├─ checkout/page.tsx        # Payment form
│   └─ invoice/[id]/page.tsx    # Download/print invoice

/components
├─ ui/                     # shadcn/ui generated components
├─ navbar.tsx
├─ footer.tsx
├─ auth-form.tsx
├─ restaurant-card.tsx
├─ menu-item-card.tsx
├─ cart-sheet.tsx
├─ order-status-badge.tsx
├─ data-table.tsx          # Generic table (for admin, reports, etc.)
└─ charts/                 # For analytics
├─ sales-chart.tsx
├─ best-sellers-chart.tsx
└─ trends-chart.tsx

/lib
├─ utils.ts                # Helpers (formatting, currency, etc.)
├─ auth.ts                 # Role-based access (client-side guards)
├─ dummy-data.ts           # Temporary mock data for frontend
└─ types.ts                # TypeScript types (User, Order, MenuItem, etc.)

/store
├─ cart.ts                 # Zustand store for cart
├─ user.ts                 # Zustand/Auth store for user session
└─ order.ts                # Track real-time order status
```