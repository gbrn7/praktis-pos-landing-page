# CMS Praktis POS dengan Autentikasi, SQLite & shadcn/ui Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Membangun sistem manajemen konten (CMS) internal di rute `/admin` dengan autentikasi single-admin cookie session, database lokal SQLite via Drizzle ORM, komponen shadcn/ui (Sidebar, Switch, Table, Dialog), fitur Hide/Show Section, upload gambar lokal, serta integrasi langsung ke landing page publik dengan revalidasi instan.

**Architecture:** Database SQLite disimpan di `data/cms.db` dengan schema Drizzle ORM dan inisialisasi otomatis (*auto-seed*) dari data statis saat pertama kali server membaca database. Keamanan autentikasi menggunakan enkripsi `bcryptjs` dan signed token `jose` pada HTTP-Only cookie yang diproteksi lewat Next.js `middleware.ts`. Antarmuka CMS menggunakan shadcn/ui dengan Server Actions / Route Handlers yang memicu `revalidatePath('/')` sehingga landing page publik selalu sinkron secara instan.

**Tech Stack:** Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, SQLite (`better-sqlite3`), Drizzle ORM (`drizzle-orm`, `drizzle-kit`), `bcryptjs`, `jose`, `lucide-react`, `@radix-ui/react-slot`, `@radix-ui/react-switch`, `@radix-ui/react-dialog`, `class-variance-authority`.

## Global Constraints
- Database file path: `data/cms.db`
- Upload storage directory: `public/uploads/`
- Cookie session name: `cms_session`
- Default admin credentials: username `admin`, initial password `admin123`
- Section keys for visibility toggle: `'hero'`, `'social_proof'`, `'hardware'`, `'features'`, `'demo_banner'`, `'faq'`, `'cta_banner'`, `'floating_wa'`
- Preserved existing functionality: Landing page must render seamlessly with graceful fallback to default constants if database query fails.

---

### Task 1: Install Dependencies & Setup shadcn/ui Core Foundation

**Files:**
- Modify: `package.json`
- Create: `src/lib/utils.ts`
- Create: `src/components/ui/button.tsx`
- Create: `src/components/ui/input.tsx`
- Create: `src/components/ui/textarea.tsx`
- Create: `src/components/ui/card.tsx`
- Create: `src/components/ui/switch.tsx`
- Create: `src/components/ui/badge.tsx`
- Create: `src/components/ui/dialog.tsx`
- Create: `src/components/ui/table.tsx`
- Create: `src/components/ui/sidebar.tsx`

**Interfaces:**
- Produces: `cn(...inputs)` helper from `src/lib/utils.ts`
- Produces: Standard shadcn/ui components (`Button`, `Input`, `Textarea`, `Card`, `Switch`, `Badge`, `Dialog`, `Table`, `SidebarProvider`, `Sidebar`, `SidebarTrigger`)

- [ ] **Step 1: Install runtime & dev dependencies**

Run:
```bash
npm install better-sqlite3 drizzle-orm bcryptjs jose class-variance-authority @radix-ui/react-slot @radix-ui/react-switch @radix-ui/react-dialog
npm install -D drizzle-kit @types/better-sqlite3 @types/bcryptjs
```

- [ ] **Step 2: Create utility `src/lib/utils.ts`**

```typescript
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

- [ ] **Step 3: Create shadcn base UI components**

Create `src/components/ui/button.tsx`:
```typescript
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
  {
    variants: {
      variant: {
        default: 'bg-[#E0511F] text-white shadow hover:bg-[#C94213]',
        destructive: 'bg-red-600 text-white shadow-sm hover:bg-red-700',
        outline: 'border border-[#E7E7EE] dark:border-[#232326] bg-transparent hover:bg-[#F4F4F5] dark:hover:bg-[#1E1E22]',
        secondary: 'bg-[#EDF0F4] dark:bg-[#222226] text-[#080808] dark:text-[#FFFFFF] hover:bg-[#E2E6EA] dark:hover:bg-[#2C2C32]',
        ghost: 'hover:bg-[#F4F4F5] dark:hover:bg-[#1E1E22]',
        link: 'text-[#E0511F] underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-8',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
```

Create `src/components/ui/input.tsx`:
```typescript
import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-9 w-full rounded-lg border border-[#E7E7EE] dark:border-[#232326] bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[#A1A1AA] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#E0511F] disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
```

Create `src/components/ui/textarea.tsx`:
```typescript
import * as React from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'flex min-h-[80px] w-full rounded-lg border border-[#E7E7EE] dark:border-[#232326] bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-[#A1A1AA] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#E0511F] disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';

export { Textarea };
```

Create `src/components/ui/card.tsx`:
```typescript
import * as React from 'react';
import { cn } from '@/lib/utils';

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'rounded-2xl border border-[#E7E7EE] dark:border-[#232326] bg-[#FFFFFF] dark:bg-[#141416] text-[#000000] dark:text-[#FFFFFF] shadow-sm',
        className
      )}
      {...props}
    />
  )
);
Card.displayName = 'Card';

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col space-y-1.5 p-6', className)} {...props} />
  )
);
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn('font-bold text-lg leading-none tracking-tight', className)} {...props} />
  )
);
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn('text-xs sm:text-sm text-[#525252] dark:text-[#A1A1AA]', className)} {...props} />
  )
);
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
  )
);
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center p-6 pt-0', className)} {...props} />
  )
);
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
```

Create `src/components/ui/switch.tsx`:
```typescript
'use client';

import * as React from 'react';
import * as SwitchPrimitives from '@radix-ui/react-switch';
import { cn } from '@/lib/utils';

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      'peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E0511F] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-[#E0511F] data-[state=unchecked]:bg-[#D4D4D8] dark:data-[state=unchecked]:bg-[#27272A]',
      className
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        'pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0'
      )}
    />
  </SwitchPrimitives.Root>
));
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
```

Create `src/components/ui/badge.tsx`:
```typescript
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-[#FFF0EB] dark:bg-[#2B150B] text-[#E0511F]',
        secondary: 'border-transparent bg-[#EDF0F4] dark:bg-[#222226] text-[#080808] dark:text-[#FFFFFF]',
        destructive: 'border-transparent bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
        outline: 'border-[#E7E7EE] dark:border-[#232326] text-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
```

Create `src/components/ui/dialog.tsx`:
```typescript
'use client';

import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = DialogPrimitive.Portal;
const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'fixed inset-0 z-50 bg-black/60 backdrop-blur-xs data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      className
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        'fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-[#E7E7EE] dark:border-[#232326] bg-[#FFFFFF] dark:bg-[#141416] p-6 shadow-xl duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] rounded-2xl max-h-[90vh] overflow-y-auto',
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none cursor-pointer">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col space-y-1.5 text-center sm:text-left', className)} {...props} />
);
DialogHeader.displayName = 'DialogHeader';

const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', className)} {...props} />
);
DialogFooter.displayName = 'DialogFooter';

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn('text-lg font-bold leading-none tracking-tight', className)}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn('text-xs text-[#525252] dark:text-[#A1A1AA]', className)}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
```

Create `src/components/ui/table.tsx`:
```typescript
import * as React from 'react';
import { cn } from '@/lib/utils';

const Table = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(
  ({ className, ...props }, ref) => (
    <div className="relative w-full overflow-auto">
      <table ref={ref} className={cn('w-full caption-bottom text-sm', className)} {...props} />
    </div>
  )
);
Table.displayName = 'Table';

const TableHeader = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <thead ref={ref} className={cn('[&_tr]:border-b border-[#E7E7EE] dark:border-[#232326]', className)} {...props} />
  )
);
TableHeader.displayName = 'TableHeader';

const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <tbody ref={ref} className={cn('[&_tr:last-child]:border-0', className)} {...props} />
  )
);
TableBody.displayName = 'TableBody';

const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn(
        'border-b border-[#E7E7EE] dark:border-[#232326] transition-colors hover:bg-[#F8F9FA] dark:hover:bg-[#18181B]',
        className
      )}
      {...props}
    />
  )
);
TableRow.displayName = 'TableRow';

const TableHead = React.forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <th
      ref={ref}
      className={cn(
        'h-10 px-4 text-left align-middle text-xs font-semibold text-[#525252] dark:text-[#A1A1AA]',
        className
      )}
      {...props}
    />
  )
);
TableHead.displayName = 'TableHead';

const TableCell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <td ref={ref} className={cn('p-4 align-middle [&:has([role=checkbox])]:pr-0', className)} {...props} />
  )
);
TableCell.displayName = 'TableCell';

export { Table, TableHeader, TableBody, TableHead, TableRow, TableCell };
```

Create `src/components/ui/sidebar.tsx` with clean responsive sidebar primitives.

- [ ] **Step 4: Verify installation and build**

Run: `npm run lint`
Expected: 0 errors.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json src/lib/utils.ts src/components/ui/
git commit -m "feat(ui): install dependencies and add shadcn ui primitives"
```

---

### Task 2: Database Layer & Drizzle Schema with Auto-Seed

**Files:**
- Create: `drizzle.config.ts`
- Create: `src/lib/db/schema.ts`
- Create: `src/lib/db/index.ts`
- Create: `src/lib/db/seed.ts`

**Interfaces:**
- Produces: `db` client instance from `src/lib/db/index.ts`
- Produces: Schema objects (`admins`, `sectionSettings`, `siteSettings`, `hardwareItems`, `hardwareBonuses`, `features`, `faqs`)
- Produces: `ensureDatabaseSeeded()` function in `src/lib/db/seed.ts`

- [ ] **Step 1: Create `drizzle.config.ts`**

```typescript
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/lib/db/schema.ts',
  out: './drizzle',
  dialect: 'sqlite',
  dbCredentials: {
    url: './data/cms.db',
  },
});
```

- [ ] **Step 2: Create `src/lib/db/schema.ts`**

```typescript
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const admins = sqliteTable('admins', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  username: text('username').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  createdAt: integer('created_at').notNull().default(sql`(unixepoch())`),
  updatedAt: integer('updated_at').notNull().default(sql`(unixepoch())`),
});

export const sectionSettings = sqliteTable('section_settings', {
  sectionKey: text('section_key').primaryKey(), // 'hero', 'social_proof', 'hardware', 'features', 'demo_banner', 'faq', 'cta_banner', 'floating_wa'
  label: text('label').notNull(),
  isVisible: integer('is_visible').notNull().default(1),
  displayOrder: integer('display_order').notNull().default(0),
});

export const siteSettings = sqliteTable('site_settings', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  heroPill: text('hero_pill').notNull().default('Mesin Kasir Praktis POS • Paket Siap Pakai'),
  heroHeadline: text('hero_headline').notNull(),
  heroSubtitle: text('hero_subtitle').notNull(),
  waNumber: text('wa_number').notNull().default('6281234567890'),
  waTemplate: text('wa_template').notNull(),
  liveDemoUrl: text('live_demo_url').notNull(),
  demoBannerTitle: text('demo_banner_title').notNull(),
  demoBannerDesc: text('demo_banner_desc').notNull(),
  ctaBannerTitle: text('cta_banner_title').notNull(),
  ctaBannerDesc: text('cta_banner_desc').notNull(),
  updatedAt: integer('updated_at').notNull().default(sql`(unixepoch())`),
});

export const hardwareItems = sqliteTable('hardware_items', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  category: text('category').notNull(),
  spec: text('spec').notNull(),
  description: text('description').notNull(),
  iconName: text('icon_name').notNull().default('Tablet'),
  imageUrl: text('image_url'),
  displayOrder: integer('display_order').notNull().default(0),
  isActive: integer('is_active').notNull().default(1),
});

export const hardwareBonuses = sqliteTable('hardware_bonuses', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  text: text('text').notNull(),
  displayOrder: integer('display_order').notNull().default(0),
});

export const features = sqliteTable('features', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  tagline: text('tagline').notNull(),
  description: text('description').notNull(),
  iconName: text('icon_name').notNull().default('ShoppingCart'),
  badge: text('badge'),
  benefits: text('benefits').notNull(), // JSON string array
  displayOrder: integer('display_order').notNull().default(0),
  isActive: integer('is_active').notNull().default(1),
});

export const faqs = sqliteTable('faqs', {
  id: text('id').primaryKey(),
  question: text('question').notNull(),
  answer: text('answer').notNull(),
  displayOrder: integer('display_order').notNull().default(0),
  isActive: integer('is_active').notNull().default(1),
});
```

- [ ] **Step 3: Create `src/lib/db/index.ts`**

Initialize SQLite database directory `data/` and export database connection:
```typescript
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema';
import fs from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'cms.db');
const sqlite = new Database(dbPath);
sqlite.pragma('journal_mode = WAL');

export const db = drizzle(sqlite, { schema });
```

- [ ] **Step 4: Create `src/lib/db/seed.ts`**

Auto-seed function populating initial admin (`admin` / `admin123`), 8 section visibility records, initial `site_settings`, `hardware_items`, `features`, and `faqs` from existing `src/data/` files if tables are empty.

- [ ] **Step 5: Test Database connection & seeding**

Run a scratch script to verify tables are created and seeded properly.
Expected: Database `data/cms.db` contains 8 sections, default site settings, hardware items, features, faqs, and default admin.

- [ ] **Step 6: Commit**

```bash
git add drizzle.config.ts src/lib/db/
git commit -m "feat(db): setup sqlite with drizzle schema and auto-seeding"
```

---

### Task 3: Authentication & Middleware Route Protection

**Files:**
- Create: `src/lib/auth.ts`
- Create: `src/app/api/auth/login/route.ts`
- Create: `src/app/api/auth/logout/route.ts`
- Create: `middleware.ts`

**Interfaces:**
- Produces: `verifyPassword`, `hashPassword`, `signSessionToken`, `verifySessionToken`, `getCurrentAdmin` in `src/lib/auth.ts`
- Route: `POST /api/auth/login` (validates username + password, sets `cms_session` cookie)
- Route: `POST /api/auth/logout` (clears cookie and redirects)
- Middleware: Intercepts `/admin/:path*`, redirects unauthenticated users to `/admin/login`.

- [ ] **Step 1: Create `src/lib/auth.ts`**

Implement password hashing with `bcryptjs`, and JWT token creation/verification using `jose` with `AUTH_SECRET` (fallback for dev).

- [ ] **Step 2: Create login API route `src/app/api/auth/login/route.ts`**

Handle POST requests with `{ username, password }`. Check admin in SQLite, compare hash, set HTTP-Only cookie `cms_session` upon success, return 401 if invalid.

- [ ] **Step 3: Create logout API route `src/app/api/auth/logout/route.ts`**

Handle POST requests, delete `cms_session` cookie, return success response.

- [ ] **Step 4: Create Next.js Middleware `middleware.ts`**

Protect `/admin/:path*` except `/admin/login`. If valid token, allow request. If missing/invalid, redirect to `/admin/login`. If valid token and accessing `/admin/login`, redirect to `/admin`.

- [ ] **Step 5: Verify auth routes and middleware**

Run: `npm run lint`
Expected: 0 errors.

- [ ] **Step 6: Commit**

```bash
git add src/lib/auth.ts src/app/api/auth/ middleware.ts
git commit -m "feat(auth): add password hashing, session tokens, and route middleware"
```

---

### Task 4: Admin Login Page & Layout with shadcn/ui Sidebar

**Files:**
- Create: `src/app/admin/login/page.tsx`
- Create: `src/app/admin/layout.tsx`
- Create: `src/app/admin/page.tsx` (Dashboard Overview)
- Create: `src/components/admin/AdminSidebar.tsx`
- Create: `src/components/admin/AdminNavbar.tsx`

**Interfaces:**
- Produces: Admin dashboard shell at `/admin`
- Produces: Login screen at `/admin/login`

- [ ] **Step 1: Create `src/app/admin/login/page.tsx`**

Build clean login interface using shadcn `Card`, `Input`, `Button`, and `Alert` error banner. Form submits to `/api/auth/login` with loading state.

- [ ] **Step 2: Create `src/components/admin/AdminSidebar.tsx`**

Sidebar navigation items:
- Dashboard (`/admin`)
- Kelola Section (`/admin/sections`)
- Paket Hardware (`/admin/hardware`)
- Teks & Kontak (`/admin/settings`)
- Fitur Unggulan (`/admin/features`)
- FAQ (`/admin/faqs`)
- Keamanan Akun (`/admin/security`)
- Shortcut "Buka Website Publik" (target="_blank")

- [ ] **Step 3: Create `src/components/admin/AdminNavbar.tsx` & `src/app/admin/layout.tsx`**

Include sidebar toggler, breadcrumbs, theme toggle, and logout button with action handler.

- [ ] **Step 4: Create `src/app/admin/page.tsx`**

Dashboard overview cards:
- Status Database SQLite: Connected & Active
- Status Visibilitas Section: X dari 8 aktif
- Total Produk Hardware: N item
- Total Pertanyaan FAQ: N item
- Quick Action buttons

- [ ] **Step 5: Test login flow in browser**

Verify accessing `/admin` redirects to `/admin/login`. Logging in with `admin` / `admin123` navigates to `/admin`.

- [ ] **Step 6: Commit**

```bash
git add src/app/admin/ src/components/admin/
git commit -m "feat(admin): build login page, admin layout, and dashboard overview"
```

---

### Task 5: Section Visibility Management (Hide / Show Toggles)

**Files:**
- Create: `src/app/admin/sections/page.tsx`
- Create: `src/app/admin/sections/actions.ts`

**Interfaces:**
- Produces: Server action `toggleSectionVisibility(sectionKey: string, isVisible: boolean)`
- UI: List of all 8 sections with descriptions and shadcn `Switch` toggles.

- [ ] **Step 1: Create server action `src/app/admin/sections/actions.ts`**

Update `section_settings` in SQLite and call `revalidatePath('/')` and `revalidatePath('/admin/sections')`.

- [ ] **Step 2: Create interactive section list page `src/app/admin/sections/page.tsx`**

Render 8 section cards:
1. Hero Section
2. Social Proof & Metrik
3. Showcase Paket Hardware
4. Fitur Software Kasir
5. Banner Uji Coba Demo
6. Tanya Jawab / FAQ
7. Banner CTA Penutup
8. Floating WhatsApp Button

Each card features title, description, and shadcn `Switch` with optimistic updates and loading states.

- [ ] **Step 3: Test toggling visibility**

Toggle switch for a section, inspect SQLite database to confirm `is_visible` changed between 0 and 1.

- [ ] **Step 4: Commit**

```bash
git add src/app/admin/sections/
git commit -m "feat(sections): implement hide and show section toggles in CMS"
```

---

### Task 6: Local Image Upload API & Hardware Packages CMS

**Files:**
- Create: `src/app/api/upload/route.ts`
- Create: `src/app/admin/hardware/page.tsx`
- Create: `src/app/admin/hardware/actions.ts`

**Interfaces:**
- Route: `POST /api/upload` accepting multipart file, saving to `public/uploads/`
- Produces: CRUD actions for hardware items & bonuses in `actions.ts`

- [ ] **Step 1: Create local upload handler `src/app/api/upload/route.ts`**

Validate file format (image/png, image/jpeg, image/webp), max size 5MB. Ensure `public/uploads/` exists. Write file with sanitized unique name, return `{ url: '/uploads/[filename]' }`.

- [ ] **Step 2: Create hardware actions in `src/app/admin/hardware/actions.ts`**

Add, edit, delete hardware items and starter kit bonuses, with `revalidatePath('/')`.

- [ ] **Step 3: Create hardware management page `src/app/admin/hardware/page.tsx`**

- Table listing hardware items with thumbnail/icon, name, category, spec, and status.
- Modal Dialog with fields: Name, Category, Spec, Description, Icon, and File Upload dropzone with thumbnail preview.
- Bonus starter kit list management.

- [ ] **Step 4: Verify image upload and hardware update**

Upload a test image and verify file creation in `public/uploads/` and record in SQLite.

- [ ] **Step 5: Commit**

```bash
git add src/app/api/upload/ src/app/admin/hardware/
git commit -m "feat(hardware): add local image upload and hardware management"
```

---

### Task 7: Site Settings, Features, FAQs & Account Security Pages

**Files:**
- Create: `src/app/admin/settings/page.tsx` & `src/app/admin/settings/actions.ts`
- Create: `src/app/admin/features/page.tsx` & `src/app/admin/features/actions.ts`
- Create: `src/app/admin/faqs/page.tsx` & `src/app/admin/faqs/actions.ts`
- Create: `src/app/admin/security/page.tsx` & `src/app/admin/security/actions.ts`

**Interfaces:**
- Produces: Form for updating hero headlines, WhatsApp numbers, template messages, and demo URLs.
- Produces: CRUD for features and FAQs.
- Produces: Change username & password action for admin.

- [ ] **Step 1: Build Site Settings page (`/admin/settings`)**

Form to update `hero_pill`, `hero_headline`, `hero_subtitle`, `wa_number`, `wa_template`, `live_demo_url`, and banner texts.

- [ ] **Step 2: Build Features page (`/admin/features`)**

Table of features with Dialog to add/edit title, tagline, description, icon, and bullet point benefits.

- [ ] **Step 3: Build FAQs page (`/admin/faqs`)**

Table of FAQs with Dialog to add, edit, or delete questions and answers, and toggle active status.

- [ ] **Step 4: Build Security page (`/admin/security`)**

Form to change admin username and password with validation and success notification.

- [ ] **Step 5: Test updates across all settings pages**

Verify database mutations and password update function.

- [ ] **Step 6: Commit**

```bash
git add src/app/admin/settings/ src/app/admin/features/ src/app/admin/faqs/ src/app/admin/security/
git commit -m "feat(cms): add settings, features, faqs, and security management pages"
```

---

### Task 8: Public Landing Page Integration & Dynamic Navbar

**Files:**
- Create: `src/lib/db/queries.ts`
- Modify: `src/app/page.tsx`
- Modify: `src/components/Navbar.tsx`
- Modify: `src/components/Hero.tsx`
- Modify: `src/components/HardwareShowcase.tsx`
- Modify: `src/components/FeatureGrid.tsx`
- Modify: `src/components/DemoBanner.tsx`
- Modify: `src/components/Faq.tsx`
- Modify: `src/components/CtaBanner.tsx`
- Modify: `src/components/Footer.tsx`
- Modify: `src/components/FloatingWhatsApp.tsx`

**Interfaces:**
- Produces: `getLandingPageData()` in `src/lib/db/queries.ts` returning `{ visibility, settings, hardwareItems, bonuses, features, faqs }`
- Modifies: `src/app/page.tsx` to conditionally render sections and pass dynamic settings.

- [ ] **Step 1: Create `src/lib/db/queries.ts`**

Implement `getLandingPageData()` with `try/catch` fallback to static constants in `src/data/` if database is unreadable.

- [ ] **Step 2: Update `src/app/page.tsx`**

Make `Home()` an async Server Component fetching `getLandingPageData()` and conditionally rendering sections:
```tsx
export default async function Home() {
  const { visibility, settings, hardwareItems, bonuses, features, faqs } = await getLandingPageData();

  return (
    <div className="min-h-screen bg-[#FDFDFD] dark:bg-[#0B0B0C] text-[#000000] dark:text-[#FFFFFF] transition-colors duration-200">
      <Navbar settings={settings} visibility={visibility} />
      <main>
        {visibility.hero && <Hero settings={settings} />}
        {visibility.social_proof && <SocialProof />}
        {visibility.hardware && <HardwareShowcase items={hardwareItems} bonuses={bonuses} settings={settings} />}
        {visibility.features && <FeatureGrid features={features} />}
        {visibility.demo_banner && <DemoBanner settings={settings} />}
        {visibility.faq && <Faq faqs={faqs} />}
        {visibility.cta_banner && <CtaBanner settings={settings} />}
      </main>
      <Footer settings={settings} visibility={visibility} />
      {visibility.floating_wa && <FloatingWhatsApp settings={settings} />}
    </div>
  );
}
```

- [ ] **Step 3: Update section components to accept props with default fallbacks**

Update `Navbar`, `Hero`, `HardwareShowcase`, `FeatureGrid`, `DemoBanner`, `Faq`, `CtaBanner`, `Footer`, and `FloatingWhatsApp` to consume dynamic props while keeping default props for backward compatibility. In `Navbar`, filter navigation links so hidden sections do not display menu links.

- [ ] **Step 4: Verify hide/show in public browser view**

Toggle section in `/admin/sections`, refresh public page, confirm section and menu link disappear/reappear.

- [ ] **Step 5: Commit**

```bash
git add src/lib/db/queries.ts src/app/page.tsx src/components/
git commit -m "feat(landing): integrate sqlite data and dynamic section visibility"
```

---

### Task 9: End-to-End Verification, Linter & Build Validation

**Files:**
- Test all endpoints and pages.

- [ ] **Step 1: Run Next.js linting**

Run: `npm run lint`
Expected: 0 errors and 0 warnings.

- [ ] **Step 2: Run Next.js production build**

Run: `npm run build`
Expected: Successful build with static & server routes.

- [ ] **Step 3: End-to-end smoke test**

1. Visit public landing page (`/`): confirm all sections render properly.
2. Visit `/admin`: verify redirect to `/admin/login`.
3. Login with `admin` / `admin123`: verify dashboard loads.
4. Toggle off "Showcase Paket Hardware" in `/admin/sections`: verify landing page removes the hardware section.
5. Re-enable "Showcase Paket Hardware": verify section reappears.
6. Edit WhatsApp phone number in `/admin/settings`: verify CTA buttons on landing page link to the new number.
7. Logout: verify redirect to `/admin/login` and session cookie removed.

- [ ] **Step 4: Final commit & cleanup**

```bash
git add .
git commit -m "chore: complete end-to-end verification of CMS with auth, sqlite, and shadcn"
```
