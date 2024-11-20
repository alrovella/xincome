# Database Schema Documentation

This document describes the database schema for a business management system that handles multiple companies, their products, services, and appointments.

## Core Features

- Multi-company support
- Product inventory management
- Sales and purchase tracking
- Appointment scheduling
- Payment processing
- Customer and supplier management

## Main Models

### Company Management
- `Company`: Central entity that represents a business
- `CompanyPlan`: Subscription plans with different feature sets
- `CompanyCategory`: Categories to classify different types of businesses
- `CompanyOptions`: Configuration options for each company
- `User`: System users associated with companies

### Product Management
- `Product`: Products with pricing, stock management, and categorization
- `ProductCategory`: Categories for organizing products
- `ProductSize`: Size variants for products
- `ProductImage`: Product images storage

### Sales & Purchases
- `Sale`: Sales transactions with items and payment tracking
- `SaleItem`: Individual items in a sale
- `Purchase`: Purchase transactions from suppliers
- `PurchaseItem`: Individual items in a purchase
- `Supplier`: Product suppliers information
- `Customer`: Customer information and history

### Financial Management
- `BankAccount`: Company bank accounts
- `BankAccountTransaction`: Financial movements
- `Payment`: Payment records for sales, purchases, and appointments
- `PaymentMethod`: Available payment methods
- `CompanyPaymentMethod`: Payment methods enabled for each company

### Appointment System
- `Appointment`: Customer appointments/bookings
- `Service`: Services offered by the company
- `Schedule`: Scheduling configuration
- `BusinessHour`: Operating hours
- `ScheduleService`: Services available in each schedule

## Key Relationships

- Each `Company` can have multiple:
  - Products
  - Categories
  - Sales
  - Purchases
  - Customers
  - Appointments
  - Users
  - Bank accounts

- Each `Sale`/`Purchase`:
  - Contains multiple items
  - Links to payments
  - Associates with a customer/supplier
  - Records financial transactions

- Appointment system:
  - Links customers with services
  - Manages schedules and business hours
  - Tracks payments
  - Supports multiple scheduling configurations

## Enums

- `SaleVia`: Sales channels (PERSONAL, WEB, ML)
- `PaymentType`: Payment classifications (COBRANZA, PAGO)
- `AppointmentStatus`: Status tracking (NO_CONFIRMADO, CONFIRMADO, CANCELADO)
- `ChargeStatus`: Payment status (NO_COBRADO, COBRADO_PARCIALMENTE, COBRADO)
- `WebServicesVisibility`: Web display options (NO_MOSTRAR, SOLO_SERVICIOS, SERVICIOS_CON_PRECIOS)

## Notable Features

- Soft delete support (`deleted` field) for various entities
- Cascade deletion for company-related records
- Comprehensive datetime tracking (createdAt/updatedAt)
- Multiple indexing strategies for performance
- Support for both physical products and services
- Flexible payment and financial tracking system

## Database Configuration

The schema uses PostgreSQL as the database provider and supports both direct URL and pooled connections through environment variables:
- `POSTGRES_PRISMA_URL`
- `POSTGRES_PRISMA_URL_DIRECT`