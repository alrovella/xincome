# **Web Application**

This project is a modern web application built using **Next.js** in a monorepo structure with **Turborepo**. It features a **PostgreSQL** database managed through **Prisma** and utilizes **shadcn** for the UI components.

---

## **Features**
- **Next.js**: Server-side rendering and static site generation.
- **Turborepo**: Efficient monorepo management.
- **PostgreSQL**: Database managed through Prisma ORM.
- **shadcn**: UI components.
- **TailwindCSS**: Styling.
- **React Query**: State management and server-side data fetching.
- **Zustand**: Client-side state management.
- Integration with:
  - **MercadoPago**: Payment gateway.
  - **Clerk**: Authentication.
- Developer-friendly with **TypeScript** and **ESLint**.

---

## **Tech Stack**
- **Framework**: Next.js  
- **Monorepo Management**: Turborepo  
- **Database**: PostgreSQL with Prisma  
- **Styling**: TailwindCSS, shadcn UI  
- **Authentication**: Clerk  
- **Payment Gateway**: MercadoPago  
- **State Management**: React Query, Zustand  
- **Forms**: React Hook Form with Zod validation  

---

## **Setup**

### **Prerequisites**
- Node.js (>= 18)  
- PostgreSQL (configured and running)  

### **Installation**
1. **Clone the repository**  
   ```bash
   git clone <repository-url>
   cd <repository-root>
   ```

2. **Install dependencies**  
   ```bash
   npm install
   ```

3. **Set up environment variables**  
   Create a `.env` file with the following content:  
   ```
   DATABASE_URL=postgresql://user:password@localhost:5432/database_name
   ```

4. **Run database migrations**  
   ```bash
   npx prisma migrate dev
   ```

5. **Start the development server**  
   ```bash
   npm run dev
   ```  
   App will run at: [http://localhost:3000](http://localhost:3000)

---

## **Useful Commands**
- **Production**:  
  - Create build: `npm run build`  
  - Start in production mode: `npm run start`  
- **Lint**:  
  ```bash
  npm run lint
  ```

---

## **Monorepo Structure**
- **`apps/web`**: Main web application.  
- **`packages/ui`**: Shared UI components.  
- **`packages/database`**: Database and Prisma schema.  
- **`packages/eslint-config`**: Shared ESLint configuration.  
- **`packages/typescript-config`**: Shared TypeScript configuration.  

---

## **Troubleshooting**
- Ensure PostgreSQL is running and the `DATABASE_URL` in `.env` is correct.  
- If issues persist with `@repo/*` packages, verify their linkage in the monorepo.  

---

## **Contribution**
- Fork the repository and submit a pull request.  

---

## **License**
This project is under the **MIT License**.
