import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create demo user
  const hashedPassword = await bcrypt.hash('Demo1234', 10);
  
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@financeflow.com' },
    update: {},
    create: {
      email: 'demo@financeflow.com',
      name: 'Demo User',
      password: hashedPassword,
    },
  });

  console.log('✅ Created demo user:', demoUser.email);

  // Create transactions for the past 6 months with MORE variety
  const now = new Date();
  const transactions = [];

  // Detailed income data with more variety
  const incomeData = [
    // Regular salary (monthly)
    { amount: 5500, category: 'Salary', description: 'Full-time salary - Tech Company', monthsAgo: 0, day: 28 },
    { amount: 5500, category: 'Salary', description: 'Full-time salary - Tech Company', monthsAgo: 1, day: 28 },
    { amount: 5500, category: 'Salary', description: 'Full-time salary - Tech Company', monthsAgo: 2, day: 28 },
    { amount: 5500, category: 'Salary', description: 'Full-time salary - Tech Company', monthsAgo: 3, day: 28 },
    { amount: 5300, category: 'Salary', description: 'Full-time salary - Tech Company', monthsAgo: 4, day: 28 },
    { amount: 5300, category: 'Salary', description: 'Full-time salary - Tech Company', monthsAgo: 5, day: 28 },
    
    // Bonus
    { amount: 2000, category: 'Salary', description: 'Q4 Performance Bonus', monthsAgo: 1, day: 15 },
    
    // Freelance projects (irregular)
    { amount: 1200, category: 'Freelance', description: 'Website redesign - Local business', monthsAgo: 0, day: 15 },
    { amount: 850, category: 'Freelance', description: 'Logo design project', monthsAgo: 0, day: 22 },
    { amount: 1500, category: 'Freelance', description: 'E-commerce development', monthsAgo: 1, day: 10 },
    { amount: 650, category: 'Freelance', description: 'Mobile app consultation', monthsAgo: 2, day: 18 },
    { amount: 900, category: 'Freelance', description: 'UI/UX design work', monthsAgo: 3, day: 8 },
    { amount: 2200, category: 'Freelance', description: 'Full-stack development project', monthsAgo: 4, day: 25 },
    { amount: 750, category: 'Freelance', description: 'WordPress customization', monthsAgo: 5, day: 12 },
    
    // Investments
    { amount: 185, category: 'Investment', description: 'AAPL stock dividends', monthsAgo: 0, day: 5 },
    { amount: 120, category: 'Investment', description: 'Index fund dividends', monthsAgo: 0, day: 10 },
    { amount: 95, category: 'Investment', description: 'Bond interest payment', monthsAgo: 1, day: 15 },
    { amount: 175, category: 'Investment', description: 'Stock dividends - Tech portfolio', monthsAgo: 2, day: 5 },
    { amount: 250, category: 'Investment', description: 'Cryptocurrency trading profit', monthsAgo: 3, day: 20 },
    { amount: 140, category: 'Investment', description: 'Savings account interest', monthsAgo: 4, day: 1 },
    
    // Side business
    { amount: 450, category: 'Other', description: 'Online course sales', monthsAgo: 0, day: 12 },
    { amount: 580, category: 'Other', description: 'Online course sales', monthsAgo: 1, day: 14 },
    { amount: 320, category: 'Other', description: 'Affiliate marketing commission', monthsAgo: 2, day: 8 },
    { amount: 680, category: 'Other', description: 'Digital product sales', monthsAgo: 3, day: 22 },
    { amount: 410, category: 'Other', description: 'Consulting fees', monthsAgo: 4, day: 16 },
    
    // Refunds/cashback
    { amount: 45, category: 'Other', description: 'Credit card cashback', monthsAgo: 0, day: 3 },
    { amount: 120, category: 'Other', description: 'Product return refund', monthsAgo: 1, day: 7 },
    { amount: 65, category: 'Other', description: 'Insurance reimbursement', monthsAgo: 3, day: 19 },
  ];

  // EXTENSIVE expense data with realistic variety
  const expenseData = [
    // ===== HOUSING =====
    { amount: 1850, category: 'Housing', description: 'Monthly rent - Downtown apartment', monthsAgo: 0, day: 1 },
    { amount: 1850, category: 'Housing', description: 'Monthly rent - Downtown apartment', monthsAgo: 1, day: 1 },
    { amount: 1850, category: 'Housing', description: 'Monthly rent - Downtown apartment', monthsAgo: 2, day: 1 },
    { amount: 1850, category: 'Housing', description: 'Monthly rent - Downtown apartment', monthsAgo: 3, day: 1 },
    { amount: 1850, category: 'Housing', description: 'Monthly rent - Downtown apartment', monthsAgo: 4, day: 1 },
    { amount: 1850, category: 'Housing', description: 'Monthly rent - Downtown apartment', monthsAgo: 5, day: 1 },
    { amount: 85, category: 'Housing', description: 'Renters insurance', monthsAgo: 0, day: 5 },
    { amount: 250, category: 'Housing', description: 'Security deposit top-up', monthsAgo: 3, day: 10 },
    
    // ===== UTILITIES =====
    { amount: 145, category: 'Utilities', description: 'Electricity - Winter heating', monthsAgo: 0, day: 8 },
    { amount: 138, category: 'Utilities', description: 'Electricity bill', monthsAgo: 1, day: 8 },
    { amount: 125, category: 'Utilities', description: 'Electricity bill', monthsAgo: 2, day: 8 },
    { amount: 110, category: 'Utilities', description: 'Electricity bill', monthsAgo: 3, day: 8 },
    { amount: 95, category: 'Utilities', description: 'Electricity - Summer', monthsAgo: 4, day: 8 },
    { amount: 102, category: 'Utilities', description: 'Electricity bill', monthsAgo: 5, day: 8 },
    { amount: 65, category: 'Utilities', description: 'Water & sewage', monthsAgo: 0, day: 12 },
    { amount: 68, category: 'Utilities', description: 'Water & sewage', monthsAgo: 1, day: 12 },
    { amount: 62, category: 'Utilities', description: 'Water & sewage', monthsAgo: 2, day: 12 },
    { amount: 85, category: 'Utilities', description: 'Internet - Fiber 1Gbps', monthsAgo: 0, day: 15 },
    { amount: 85, category: 'Utilities', description: 'Internet - Fiber 1Gbps', monthsAgo: 1, day: 15 },
    { amount: 85, category: 'Utilities', description: 'Internet - Fiber 1Gbps', monthsAgo: 2, day: 15 },
    { amount: 85, category: 'Utilities', description: 'Internet - Fiber 1Gbps', monthsAgo: 3, day: 15 },
    { amount: 55, category: 'Utilities', description: 'Mobile phone plan', monthsAgo: 0, day: 5 },
    { amount: 55, category: 'Utilities', description: 'Mobile phone plan', monthsAgo: 1, day: 5 },
    { amount: 55, category: 'Utilities', description: 'Mobile phone plan', monthsAgo: 2, day: 5 },
    { amount: 55, category: 'Utilities', description: 'Mobile phone plan', monthsAgo: 3, day: 5 },
    { amount: 35, category: 'Utilities', description: 'Trash collection', monthsAgo: 0, day: 20 },
    
    // ===== GROCERIES (weekly shopping) =====
    { amount: 145, category: 'Groceries', description: 'Whole Foods - Weekly shopping', monthsAgo: 0, day: 3 },
    { amount: 132, category: 'Groceries', description: 'Trader Joes - Weekly shopping', monthsAgo: 0, day: 10 },
    { amount: 156, category: 'Groceries', description: 'Costco - Bulk shopping', monthsAgo: 0, day: 17 },
    { amount: 128, category: 'Groceries', description: 'Local market - Fresh produce', monthsAgo: 0, day: 24 },
    { amount: 138, category: 'Groceries', description: 'Whole Foods - Weekly shopping', monthsAgo: 1, day: 2 },
    { amount: 145, category: 'Groceries', description: 'Safeway - Weekly shopping', monthsAgo: 1, day: 9 },
    { amount: 122, category: 'Groceries', description: 'Farmers market', monthsAgo: 1, day: 16 },
    { amount: 165, category: 'Groceries', description: 'Costco - Monthly stock-up', monthsAgo: 1, day: 23 },
    { amount: 141, category: 'Groceries', description: 'Grocery shopping', monthsAgo: 2, day: 5 },
    { amount: 135, category: 'Groceries', description: 'Grocery shopping', monthsAgo: 2, day: 12 },
    { amount: 148, category: 'Groceries', description: 'Grocery shopping', monthsAgo: 2, day: 19 },
    { amount: 129, category: 'Groceries', description: 'Grocery shopping', monthsAgo: 2, day: 26 },
    { amount: 152, category: 'Groceries', description: 'Grocery shopping', monthsAgo: 3, day: 7 },
    { amount: 138, category: 'Groceries', description: 'Grocery shopping', monthsAgo: 3, day: 14 },
    { amount: 144, category: 'Groceries', description: 'Grocery shopping', monthsAgo: 3, day: 21 },
    { amount: 131, category: 'Groceries', description: 'Grocery shopping', monthsAgo: 4, day: 4 },
    { amount: 147, category: 'Groceries', description: 'Grocery shopping', monthsAgo: 4, day: 11 },
    { amount: 136, category: 'Groceries', description: 'Grocery shopping', monthsAgo: 4, day: 18 },
    { amount: 28, category: 'Groceries', description: 'Quick grocery run', monthsAgo: 0, day: 6 },
    { amount: 42, category: 'Groceries', description: 'Asian supermarket', monthsAgo: 0, day: 14 },
    { amount: 35, category: 'Groceries', description: 'Quick grocery run', monthsAgo: 1, day: 11 },
    
    // ===== DINING OUT (variety of meals) =====
    { amount: 85, category: 'Dining', description: 'Italian restaurant - Date night', monthsAgo: 0, day: 7 },
    { amount: 45, category: 'Dining', description: 'Lunch with colleagues', monthsAgo: 0, day: 11 },
    { amount: 22, category: 'Dining', description: 'Coffee shop - Work session', monthsAgo: 0, day: 13 },
    { amount: 68, category: 'Dining', description: 'Sushi restaurant', monthsAgo: 0, day: 15 },
    { amount: 35, category: 'Dining', description: 'Chipotle - Quick lunch', monthsAgo: 0, day: 18 },
    { amount: 120, category: 'Dining', description: 'Fine dining - Celebration', monthsAgo: 0, day: 21 },
    { amount: 28, category: 'Dining', description: 'Pizza delivery', monthsAgo: 0, day: 25 },
    { amount: 52, category: 'Dining', description: 'Brunch with friends', monthsAgo: 0, day: 27 },
    { amount: 95, category: 'Dining', description: 'Steakhouse dinner', monthsAgo: 1, day: 5 },
    { amount: 38, category: 'Dining', description: 'Thai restaurant', monthsAgo: 1, day: 9 },
    { amount: 25, category: 'Dining', description: 'Starbucks', monthsAgo: 1, day: 12 },
    { amount: 72, category: 'Dining', description: 'Mexican restaurant', monthsAgo: 1, day: 16 },
    { amount: 42, category: 'Dining', description: 'Lunch meeting', monthsAgo: 1, day: 19 },
    { amount: 18, category: 'Dining', description: 'Coffee and pastry', monthsAgo: 1, day: 22 },
    { amount: 110, category: 'Dining', description: 'Birthday dinner celebration', monthsAgo: 2, day: 8 },
    { amount: 48, category: 'Dining', description: 'Vietnamese restaurant', monthsAgo: 2, day: 14 },
    { amount: 32, category: 'Dining', description: 'Subway sandwich', monthsAgo: 2, day: 18 },
    { amount: 88, category: 'Dining', description: 'Seafood restaurant', monthsAgo: 3, day: 10 },
    { amount: 55, category: 'Dining', description: 'Brunch buffet', monthsAgo: 3, day: 17 },
    { amount: 29, category: 'Dining', description: 'Fast food', monthsAgo: 4, day: 6 },
    { amount: 65, category: 'Dining', description: 'Indian cuisine', monthsAgo: 4, day: 13 },
    { amount: 42, category: 'Dining', description: 'Ramen shop', monthsAgo: 5, day: 9 },
    
    // ===== TRANSPORTATION =====
    { amount: 285, category: 'Transportation', description: 'Gasoline - Chevron', monthsAgo: 0, day: 5 },
    { amount: 275, category: 'Transportation', description: 'Gasoline - Shell', monthsAgo: 0, day: 18 },
    { amount: 295, category: 'Transportation', description: 'Gasoline - BP', monthsAgo: 1, day: 4 },
    { amount: 268, category: 'Transportation', description: 'Gasoline - Costco', monthsAgo: 1, day: 22 },
    { amount: 290, category: 'Transportation', description: 'Gasoline', monthsAgo: 2, day: 7 },
    { amount: 275, category: 'Transportation', description: 'Gasoline', monthsAgo: 2, day: 21 },
    { amount: 280, category: 'Transportation', description: 'Gasoline', monthsAgo: 3, day: 10 },
    { amount: 285, category: 'Transportation', description: 'Gasoline', monthsAgo: 3, day: 25 },
    { amount: 265, category: 'Transportation', description: 'Gasoline', monthsAgo: 4, day: 8 },
    { amount: 125, category: 'Transportation', description: 'Car insurance - Monthly', monthsAgo: 0, day: 1 },
    { amount: 125, category: 'Transportation', description: 'Car insurance - Monthly', monthsAgo: 1, day: 1 },
    { amount: 125, category: 'Transportation', description: 'Car insurance - Monthly', monthsAgo: 2, day: 1 },
    { amount: 125, category: 'Transportation', description: 'Car insurance - Monthly', monthsAgo: 3, day: 1 },
    { amount: 85, category: 'Transportation', description: 'Oil change & service', monthsAgo: 0, day: 12 },
    { amount: 450, category: 'Transportation', description: 'Tire replacement', monthsAgo: 2, day: 15 },
    { amount: 320, category: 'Transportation', description: 'Brake pad replacement', monthsAgo: 4, day: 20 },
    { amount: 45, category: 'Transportation', description: 'Car wash & detailing', monthsAgo: 0, day: 9 },
    { amount: 35, category: 'Transportation', description: 'Car wash', monthsAgo: 1, day: 14 },
    { amount: 28, category: 'Transportation', description: 'Parking fee - downtown', monthsAgo: 0, day: 16 },
    { amount: 18, category: 'Transportation', description: 'Bridge toll', monthsAgo: 0, day: 22 },
    { amount: 65, category: 'Transportation', description: 'Uber rides', monthsAgo: 0, day: 20 },
    { amount: 42, category: 'Transportation', description: 'Lyft to airport', monthsAgo: 1, day: 8 },
    { amount: 25, category: 'Transportation', description: 'City parking', monthsAgo: 2, day: 11 },
    
    // ===== ENTERTAINMENT & SUBSCRIPTIONS =====
    { amount: 16.99, category: 'Entertainment', description: 'Netflix Premium', monthsAgo: 0, day: 3 },
    { amount: 16.99, category: 'Entertainment', description: 'Netflix Premium', monthsAgo: 1, day: 3 },
    { amount: 16.99, category: 'Entertainment', description: 'Netflix Premium', monthsAgo: 2, day: 3 },
    { amount: 16.99, category: 'Entertainment', description: 'Netflix Premium', monthsAgo: 3, day: 3 },
    { amount: 14.99, category: 'Entertainment', description: 'Spotify Premium', monthsAgo: 0, day: 5 },
    { amount: 14.99, category: 'Entertainment', description: 'Spotify Premium', monthsAgo: 1, day: 5 },
    { amount: 14.99, category: 'Entertainment', description: 'Spotify Premium', monthsAgo: 2, day: 5 },
    { amount: 14.99, category: 'Entertainment', description: 'Spotify Premium', monthsAgo: 3, day: 5 },
    { amount: 19.99, category: 'Entertainment', description: 'YouTube Premium', monthsAgo: 0, day: 7 },
    { amount: 19.99, category: 'Entertainment', description: 'YouTube Premium', monthsAgo: 1, day: 7 },
    { amount: 19.99, category: 'Entertainment', description: 'YouTube Premium', monthsAgo: 2, day: 7 },
    { amount: 8.99, category: 'Entertainment', description: 'Disney+ subscription', monthsAgo: 0, day: 10 },
    { amount: 8.99, category: 'Entertainment', description: 'Disney+ subscription', monthsAgo: 1, day: 10 },
    { amount: 8.99, category: 'Entertainment', description: 'Disney+ subscription', monthsAgo: 2, day: 10 },
    { amount: 11.99, category: 'Entertainment', description: 'Audible subscription', monthsAgo: 0, day: 12 },
    { amount: 11.99, category: 'Entertainment', description: 'Audible subscription', monthsAgo: 1, day: 12 },
    { amount: 225, category: 'Entertainment', description: 'Concert tickets - Taylor Swift', monthsAgo: 0, day: 14 },
    { amount: 85, category: 'Entertainment', description: 'Theater tickets', monthsAgo: 1, day: 18 },
    { amount: 45, category: 'Entertainment', description: 'Movie theater - IMAX', monthsAgo: 0, day: 19 },
    { amount: 38, category: 'Entertainment', description: 'Movie theater', monthsAgo: 1, day: 21 },
    { amount: 32, category: 'Entertainment', description: 'Movie night', monthsAgo: 2, day: 15 },
    { amount: 120, category: 'Entertainment', description: 'Video games - PlayStation Store', monthsAgo: 0, day: 22 },
    { amount: 65, category: 'Entertainment', description: 'Xbox Game Pass Ultimate', monthsAgo: 1, day: 9 },
    { amount: 180, category: 'Entertainment', description: 'Amusement park tickets', monthsAgo: 2, day: 20 },
    { amount: 95, category: 'Entertainment', description: 'Museum membership annual', monthsAgo: 3, day: 5 },
    { amount: 55, category: 'Entertainment', description: 'Bowling night with friends', monthsAgo: 3, day: 16 },
    { amount: 75, category: 'Entertainment', description: 'Escape room activity', monthsAgo: 4, day: 12 },
    { amount: 28, category: 'Entertainment', description: 'Book purchase - Amazon', monthsAgo: 0, day: 8 },
    
    // ===== SHOPPING =====
    { amount: 285, category: 'Shopping', description: 'Winter jacket - North Face', monthsAgo: 0, day: 6 },
    { amount: 125, category: 'Shopping', description: 'Running shoes - Nike', monthsAgo: 0, day: 11 },
    { amount: 85, category: 'Shopping', description: 'Casual clothes - H&M', monthsAgo: 0, day: 18 },
    { amount: 650, category: 'Shopping', description: 'MacBook accessories - Apple Store', monthsAgo: 1, day: 5 },
    { amount: 420, category: 'Shopping', description: 'Noise-cancelling headphones - Sony', monthsAgo: 1, day: 14 },
    { amount: 185, category: 'Shopping', description: 'Smart watch band & accessories', monthsAgo: 1, day: 22 },
    { amount: 95, category: 'Shopping', description: 'Office chair cushion & desk mat', monthsAgo: 2, day: 8 },
    { amount: 240, category: 'Shopping', description: 'Kitchen appliances - Instant Pot', monthsAgo: 2, day: 16 },
    { amount: 65, category: 'Shopping', description: 'Home decor - Target', monthsAgo: 2, day: 24 },
    { amount: 380, category: 'Shopping', description: 'Winter wardrobe - Nordstrom', monthsAgo: 3, day: 10 },
    { amount: 145, category: 'Shopping', description: 'Shoes - Adidas', monthsAgo: 3, day: 19 },
    { amount: 75, category: 'Shopping', description: 'Sunglasses - Ray-Ban', monthsAgo: 4, day: 7 },
    { amount: 220, category: 'Shopping', description: 'Bedding & linens - Bed Bath & Beyond', monthsAgo: 4, day: 15 },
    { amount: 52, category: 'Shopping', description: 'Phone case & screen protector', monthsAgo: 5, day: 9 },
    { amount: 88, category: 'Shopping', description: 'Backpack - Herschel', monthsAgo: 5, day: 18 },
    { amount: 38, category: 'Shopping', description: 'Cosmetics - Sephora', monthsAgo: 0, day: 13 },
    { amount: 125, category: 'Shopping', description: 'Skincare products', monthsAgo: 1, day: 17 },
    { amount: 45, category: 'Shopping', description: 'Fragrance - Ulta', monthsAgo: 2, day: 12 },
    
    // ===== HEALTHCARE & FITNESS =====
    { amount: 89, category: 'Healthcare', description: 'Gym membership - 24 Hour Fitness', monthsAgo: 0, day: 1 },
    { amount: 89, category: 'Healthcare', description: 'Gym membership - 24 Hour Fitness', monthsAgo: 1, day: 1 },
    { amount: 89, category: 'Healthcare', description: 'Gym membership - 24 Hour Fitness', monthsAgo: 2, day: 1 },
    { amount: 89, category: 'Healthcare', description: 'Gym membership - 24 Hour Fitness', monthsAgo: 3, day: 1 },
    { amount: 150, category: 'Healthcare', description: 'Doctor visit - Annual checkup', monthsAgo: 0, day: 10 },
    { amount: 85, category: 'Healthcare', description: 'Dentist - Cleaning', monthsAgo: 1, day: 15 },
    { amount: 65, category: 'Healthcare', description: 'Pharmacy - Prescriptions', monthsAgo: 0, day: 8 },
    { amount: 42, category: 'Healthcare', description: 'Vitamins & supplements', monthsAgo: 0, day: 14 },
    { amount: 38, category: 'Healthcare', description: 'Over-the-counter medicine', monthsAgo: 1, day: 12 },
    { amount: 95, category: 'Healthcare', description: 'Eye exam & prescription', monthsAgo: 2, day: 20 },
    { amount: 285, category: 'Healthcare', description: 'Prescription glasses - Warby Parker', monthsAgo: 2, day: 28 },
    { amount: 120, category: 'Healthcare', description: 'Physical therapy session', monthsAgo: 3, day: 9 },
    { amount: 75, category: 'Healthcare', description: 'Massage therapy', monthsAgo: 3, day: 22 },
    { amount: 55, category: 'Healthcare', description: 'Yoga class package', monthsAgo: 4, day: 5 },
    { amount: 185, category: 'Healthcare', description: 'Medical insurance copay', monthsAgo: 0, day: 3 },
    { amount: 48, category: 'Healthcare', description: 'Protein powder & workout supplements', monthsAgo: 0, day: 16 },
    { amount: 35, category: 'Healthcare', description: 'First aid supplies', monthsAgo: 1, day: 20 },
    
    // ===== EDUCATION & PERSONAL DEVELOPMENT =====
    { amount: 299, category: 'Other', description: 'Udemy course bundle - Web development', monthsAgo: 0, day: 4 },
    { amount: 49, category: 'Other', description: 'LinkedIn Learning subscription', monthsAgo: 0, day: 6 },
    { amount: 49, category: 'Other', description: 'LinkedIn Learning subscription', monthsAgo: 1, day: 6 },
    { amount: 49, category: 'Other', description: 'LinkedIn Learning subscription', monthsAgo: 2, day: 6 },
    { amount: 125, category: 'Other', description: 'Professional books - Amazon', monthsAgo: 0, day: 9 },
    { amount: 85, category: 'Other', description: 'Conference ticket - Tech summit', monthsAgo: 1, day: 11 },
    { amount: 450, category: 'Other', description: 'Coding bootcamp workshop', monthsAgo: 2, day: 14 },
    { amount: 65, category: 'Other', description: 'Online certification exam', monthsAgo: 3, day: 18 },
    
    // ===== PERSONAL CARE =====
    { amount: 65, category: 'Other', description: 'Haircut & styling', monthsAgo: 0, day: 12 },
    { amount: 60, category: 'Other', description: 'Haircut', monthsAgo: 2, day: 15 },
    { amount: 70, category: 'Other', description: 'Haircut & color', monthsAgo: 4, day: 10 },
    { amount: 45, category: 'Other', description: 'Nail salon', monthsAgo: 0, day: 17 },
    { amount: 42, category: 'Other', description: 'Manicure', monthsAgo: 1, day: 19 },
    { amount: 85, category: 'Other', description: 'Spa day', monthsAgo: 3, day: 8 },
    
    // ===== PETS =====
    { amount: 125, category: 'Other', description: 'Pet supplies - Petco', monthsAgo: 0, day: 5 },
    { amount: 85, category: 'Other', description: 'Dog food & treats', monthsAgo: 0, day: 20 },
    { amount: 95, category: 'Other', description: 'Vet checkup', monthsAgo: 1, day: 13 },
    { amount: 180, category: 'Other', description: 'Pet grooming & boarding', monthsAgo: 2, day: 22 },
    { amount: 65, category: 'Other', description: 'Pet toys & accessories', monthsAgo: 3, day: 16 },
    
    // ===== GIFTS & DONATIONS =====
    { amount: 150, category: 'Other', description: 'Birthday gift for friend', monthsAgo: 0, day: 19 },
    { amount: 220, category: 'Other', description: 'Anniversary gift', monthsAgo: 1, day: 24 },
    { amount: 85, category: 'Other', description: 'Wedding gift', monthsAgo: 2, day: 18 },
    { amount: 100, category: 'Other', description: 'Charity donation - Red Cross', monthsAgo: 0, day: 15 },
    { amount: 50, category: 'Other', description: 'Charity donation - Local food bank', monthsAgo: 2, day: 10 },
    { amount: 75, category: 'Other', description: 'Holiday gifts', monthsAgo: 3, day: 25 },
    
    // ===== TRAVEL & VACATION =====
    { amount: 850, category: 'Other', description: 'Flight tickets - Round trip', monthsAgo: 1, day: 8 },
    { amount: 1200, category: 'Other', description: 'Hotel booking - 5 nights', monthsAgo: 1, day: 9 },
    { amount: 320, category: 'Other', description: 'Vacation activities & tours', monthsAgo: 1, day: 12 },
    { amount: 185, category: 'Other', description: 'Vacation dining expenses', monthsAgo: 1, day: 13 },
    { amount: 95, category: 'Other', description: 'Souvenirs & gifts', monthsAgo: 1, day: 14 },
    { amount: 450, category: 'Other', description: 'Weekend getaway - Airbnb', monthsAgo: 3, day: 20 },
    { amount: 125, category: 'Other', description: 'Car rental - 3 days', monthsAgo: 3, day: 21 },
    
    // ===== HOME & GARDEN =====
    { amount: 185, category: 'Other', description: 'Home improvement - Hardware store', monthsAgo: 0, day: 11 },
    { amount: 95, category: 'Other', description: 'Garden supplies & plants', monthsAgo: 0, day: 23 },
    { amount: 145, category: 'Other', description: 'Furniture assembly service', monthsAgo: 1, day: 16 },
    { amount: 250, category: 'Other', description: 'Air purifier', monthsAgo: 2, day: 9 },
    { amount: 75, category: 'Other', description: 'Cleaning supplies', monthsAgo: 0, day: 7 },
    { amount: 120, category: 'Other', description: 'Professional house cleaning', monthsAgo: 0, day: 28 },
    { amount: 120, category: 'Other', description: 'Professional house cleaning', monthsAgo: 2, day: 28 },
    
    // ===== MISCELLANEOUS =====
    { amount: 45, category: 'Other', description: 'Dry cleaning', monthsAgo: 0, day: 10 },
    { amount: 38, category: 'Other', description: 'Laundry service', monthsAgo: 1, day: 15 },
    { amount: 85, category: 'Other', description: 'Storage unit rental', monthsAgo: 0, day: 1 },
    { amount: 85, category: 'Other', description: 'Storage unit rental', monthsAgo: 1, day: 1 },
    { amount: 85, category: 'Other', description: 'Storage unit rental', monthsAgo: 2, day: 1 },
    { amount: 25, category: 'Other', description: 'Post office - Shipping', monthsAgo: 0, day: 14 },
    { amount: 35, category: 'Other', description: 'Bank fees', monthsAgo: 1, day: 30 },
    { amount: 180, category: 'Other', description: 'Legal consultation', monthsAgo: 2, day: 17 },
    { amount: 95, category: 'Other', description: 'Accountant - Tax preparation', monthsAgo: 4, day: 15 },
  ];

  // Create income transactions
  for (const item of incomeData) {
    const date = new Date(now);
    date.setMonth(date.getMonth() - item.monthsAgo);
    date.setDate(item.day);

    transactions.push(
      prisma.transaction.create({
        data: {
          userId: demoUser.id,
          amount: item.amount,
          type: 'INCOME',
          category: item.category,
          description: item.description,
          date: date,
        },
      })
    );
  }

  // Create expense transactions
  for (const item of expenseData) {
    const date = new Date(now);
    date.setMonth(date.getMonth() - item.monthsAgo);
    date.setDate(item.day);

    transactions.push(
      prisma.transaction.create({
        data: {
          userId: demoUser.id,
          amount: item.amount,
          type: 'EXPENSE',
          category: item.category,
          description: item.description,
          date: date,
        },
      })
    );
  }

  await Promise.all(transactions);
  console.log(`✅ Created ${transactions.length} transactions`);

  // Create budgets for current month
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  const budgets = [
    { category: 'Housing', amount: 2000 },
    { category: 'Utilities', amount: 400 },
    { category: 'Groceries', amount: 600 },
    { category: 'Dining', amount: 300 },
    { category: 'Transportation', amount: 600 },
    { category: 'Entertainment', amount: 200 },
    { category: 'Shopping', amount: 400 },
    { category: 'Healthcare', amount: 300 },
    { category: 'Other', amount: 500 },
  ];

  for (const budget of budgets) {
    await prisma.budget.upsert({
      where: {
        userId_category_month_year: {
          userId: demoUser.id,
          category: budget.category,
          month: currentMonth,
          year: currentYear,
        },
      },
      update: {},
      create: {
        userId: demoUser.id,
        category: budget.category,
        amount: budget.amount,
        month: currentMonth,
        year: currentYear,
      },
    });
  }

  console.log(`✅ Created ${budgets.length} budgets`);

  // Create recurring transactions
  const recurringTransactions = [
    {
      amount: 1850,
      type: 'EXPENSE',
      category: 'Housing',
      description: 'Monthly rent payment',
      frequency: 'MONTHLY',
      startDate: new Date(now.getFullYear(), now.getMonth(), 1),
      status: 'ACTIVE',
    },
    {
      amount: 5500,
      type: 'INCOME',
      category: 'Salary',
      description: 'Monthly salary from Tech Company',
      frequency: 'MONTHLY',
      startDate: new Date(now.getFullYear(), now.getMonth(), 28),
      status: 'ACTIVE',
    },
    {
      amount: 125,
      type: 'EXPENSE',
      category: 'Transportation',
      description: 'Car insurance premium',
      frequency: 'MONTHLY',
      startDate: new Date(now.getFullYear(), now.getMonth(), 1),
      status: 'ACTIVE',
    },
    {
      amount: 89,
      type: 'EXPENSE',
      category: 'Healthcare',
      description: '24 Hour Fitness membership',
      frequency: 'MONTHLY',
      startDate: new Date(now.getFullYear(), now.getMonth(), 1),
      status: 'ACTIVE',
    },
    {
      amount: 85,
      type: 'EXPENSE',
      category: 'Utilities',
      description: 'Internet service - Fiber 1Gbps',
      frequency: 'MONTHLY',
      startDate: new Date(now.getFullYear(), now.getMonth(), 15),
      status: 'ACTIVE',
    },
    {
      amount: 55,
      type: 'EXPENSE',
      category: 'Utilities',
      description: 'Mobile phone plan',
      frequency: 'MONTHLY',
      startDate: new Date(now.getFullYear(), now.getMonth(), 5),
      status: 'ACTIVE',
    },
    {
      amount: 16.99,
      type: 'EXPENSE',
      category: 'Entertainment',
      description: 'Netflix Premium subscription',
      frequency: 'MONTHLY',
      startDate: new Date(now.getFullYear(), now.getMonth(), 3),
      status: 'ACTIVE',
    },
    {
      amount: 14.99,
      type: 'EXPENSE',
      category: 'Entertainment',
      description: 'Spotify Premium subscription',
      frequency: 'MONTHLY',
      startDate: new Date(now.getFullYear(), now.getMonth(), 5),
      status: 'ACTIVE',
    },
    {
      amount: 19.99,
      type: 'EXPENSE',
      category: 'Entertainment',
      description: 'YouTube Premium subscription',
      frequency: 'MONTHLY',
      startDate: new Date(now.getFullYear(), now.getMonth(), 7),
      status: 'ACTIVE',
    },
    {
      amount: 11.99,
      type: 'EXPENSE',
      category: 'Entertainment',
      description: 'Audible subscription',
      frequency: 'MONTHLY',
      startDate: new Date(now.getFullYear(), now.getMonth(), 12),
      status: 'ACTIVE',
    },
    {
      amount: 49,
      type: 'EXPENSE',
      category: 'Other',
      description: 'LinkedIn Learning professional development',
      frequency: 'MONTHLY',
      startDate: new Date(now.getFullYear(), now.getMonth(), 6),
      status: 'ACTIVE',
    },
    {
      amount: 85,
      type: 'EXPENSE',
      category: 'Other',
      description: 'Storage unit rental',
      frequency: 'MONTHLY',
      startDate: new Date(now.getFullYear(), now.getMonth(), 1),
      status: 'ACTIVE',
    },
    {
      amount: 120,
      type: 'EXPENSE',
      category: 'Other',
      description: 'Professional house cleaning service',
      frequency: 'BIWEEKLY',
      startDate: new Date(now.getFullYear(), now.getMonth(), 14),
      status: 'ACTIVE',
    },
    {
      amount: 500,
      type: 'EXPENSE',
      category: 'Other',
      description: 'Student loan payment',
      frequency: 'MONTHLY',
      startDate: new Date(now.getFullYear(), now.getMonth(), 10),
      status: 'PAUSED',
    },
    {
      amount: 200,
      type: 'INCOME',
      category: 'Investment',
      description: 'Rental property income',
      frequency: 'MONTHLY',
      startDate: new Date(now.getFullYear(), now.getMonth(), 1),
      status: 'ACTIVE',
    },
  ];

  for (const recurring of recurringTransactions) {
    await prisma.recurringTransaction.create({
      data: {
        userId: demoUser.id,
        ...recurring,
      },
    });
  }

  console.log(`✅ Created ${recurringTransactions.length} recurring transactions`);

  // Create AI chat conversations
  const conversations = [
    {
      role: 'USER',
      content: 'How much did I spend on dining out last month?',
      createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    },
    {
      role: 'AI',
      content: 'Based on your transaction history, you spent $455 on dining out last month. This includes 8 restaurant visits ranging from quick lunches ($25-45) to fine dining experiences ($95-120). Your largest dining expense was $120 for a birthday dinner celebration.',
      createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
    },
    {
      role: 'USER',
      content: 'What are my biggest expense categories?',
      createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    },
    {
      role: 'AI',
      content: 'Your top 3 expense categories this month are: 1) Housing at $1,935 (rent + insurance), 2) Transportation at $843 (gas, insurance, maintenance), and 3) Groceries at $601. Together, these represent about 55% of your total monthly expenses.',
      createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
    },
    {
      role: 'USER',
      content: 'Am I staying within my budget?',
      createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    },
    {
      role: 'AI',
      content: 'You\'re doing well! You\'re currently within budget for most categories. However, you\'re at 92% of your Entertainment budget and 88% of your Dining budget. Consider reducing discretionary spending in these areas for the remainder of the month.',
      createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
    },
  ];

  for (const message of conversations) {
    await prisma.conversation.create({
      data: {
        userId: demoUser.id,
        ...message,
      },
    });
  }

  console.log(`✅ Created ${conversations.length} AI conversation messages`);

  console.log('🎉 Seeding completed with extensive demo data!');
  console.log('📊 Demo account details:');
  console.log('   Email: demo@financeflow.com');
  console.log('   Password: Demo1234');
  console.log(`   Transactions: ${transactions.length} (6 months of detailed data)`);
  console.log(`   Budgets: ${budgets.length} active budgets`);
  console.log(`   Recurring: ${recurringTransactions.length} recurring transactions`);
  console.log(`   AI Chats: ${conversations.length} messages`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
  
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@financeflow.com' },
    update: {},
    create: {
      email: 'demo@financeflow.com',
      name: 'Demo User',
      password: hashedPassword,
    },
  });

  console.log('✅ Created demo user:', demoUser.email);

  // Create transactions for the past 3 months
  const now = new Date();
  const transactions = [];

  // Income transactions
  const incomeData = [
    { amount: 5000, category: 'Salary', description: 'Monthly salary', monthsAgo: 0 },
    { amount: 5000, category: 'Salary', description: 'Monthly salary', monthsAgo: 1 },
    { amount: 5000, category: 'Salary', description: 'Monthly salary', monthsAgo: 2 },
    { amount: 800, category: 'Freelance', description: 'Web development project', monthsAgo: 0 },
    { amount: 1200, category: 'Freelance', description: 'Consulting work', monthsAgo: 1 },
    { amount: 150, category: 'Investment', description: 'Stock dividends', monthsAgo: 0 },
    { amount: 200, category: 'Investment', description: 'Interest income', monthsAgo: 2 },
  ];

  // Expense transactions
  const expenseData = [
    // Housing
    { amount: 1500, category: 'Housing', description: 'Monthly rent', monthsAgo: 0 },
    { amount: 1500, category: 'Housing', description: 'Monthly rent', monthsAgo: 1 },
    { amount: 1500, category: 'Housing', description: 'Monthly rent', monthsAgo: 2 },
    { amount: 120, category: 'Utilities', description: 'Electricity bill', monthsAgo: 0 },
    { amount: 110, category: 'Utilities', description: 'Electricity bill', monthsAgo: 1 },
    { amount: 80, category: 'Utilities', description: 'Water bill', monthsAgo: 0 },
    
    // Food
    { amount: 450, category: 'Groceries', description: 'Weekly groceries', monthsAgo: 0 },
    { amount: 380, category: 'Groceries', description: 'Weekly groceries', monthsAgo: 1 },
    { amount: 420, category: 'Groceries', description: 'Weekly groceries', monthsAgo: 2 },
    { amount: 85, category: 'Dining', description: 'Restaurant dinner', monthsAgo: 0 },
    { amount: 45, category: 'Dining', description: 'Lunch with colleagues', monthsAgo: 0 },
    { amount: 120, category: 'Dining', description: 'Weekend brunch', monthsAgo: 1 },
    
    // Transportation
    { amount: 250, category: 'Transportation', description: 'Gas for car', monthsAgo: 0 },
    { amount: 280, category: 'Transportation', description: 'Gas for car', monthsAgo: 1 },
    { amount: 60, category: 'Transportation', description: 'Public transit pass', monthsAgo: 0 },
    { amount: 150, category: 'Transportation', description: 'Car maintenance', monthsAgo: 2 },
    
    // Entertainment
    { amount: 15, category: 'Entertainment', description: 'Netflix subscription', monthsAgo: 0 },
    { amount: 15, category: 'Entertainment', description: 'Netflix subscription', monthsAgo: 1 },
    { amount: 75, category: 'Entertainment', description: 'Concert tickets', monthsAgo: 0 },
    { amount: 45, category: 'Entertainment', description: 'Movie night', monthsAgo: 1 },
    { amount: 120, category: 'Entertainment', description: 'Gaming subscription', monthsAgo: 2 },
    
    // Shopping
    { amount: 200, category: 'Shopping', description: 'Clothing purchase', monthsAgo: 0 },
    { amount: 350, category: 'Shopping', description: 'Electronics', monthsAgo: 1 },
    { amount: 80, category: 'Shopping', description: 'Books and supplies', monthsAgo: 2 },
    
    // Health
    { amount: 150, category: 'Healthcare', description: 'Gym membership', monthsAgo: 0 },
    { amount: 150, category: 'Healthcare', description: 'Gym membership', monthsAgo: 1 },
    { amount: 85, category: 'Healthcare', description: 'Doctor visit', monthsAgo: 2 },
    { amount: 45, category: 'Healthcare', description: 'Pharmacy', monthsAgo: 0 },
    
    // Other
    { amount: 50, category: 'Other', description: 'Haircut', monthsAgo: 0 },
    { amount: 100, category: 'Other', description: 'Pet supplies', monthsAgo: 1 },
    { amount: 200, category: 'Other', description: 'Home improvements', monthsAgo: 2 },
  ];

  // Create income transactions
  for (const item of incomeData) {
    const date = new Date(now);
    date.setMonth(date.getMonth() - item.monthsAgo);
    date.setDate(Math.floor(Math.random() * 28) + 1);

    transactions.push(
      prisma.transaction.create({
        data: {
          userId: demoUser.id,
          amount: item.amount,
          type: 'INCOME',
          category: item.category,
          description: item.description,
          date: date,
        },
      })
    );
  }

  // Create expense transactions
  for (const item of expenseData) {
    const date = new Date(now);
    date.setMonth(date.getMonth() - item.monthsAgo);
    date.setDate(Math.floor(Math.random() * 28) + 1);

    transactions.push(
      prisma.transaction.create({
        data: {
          userId: demoUser.id,
          amount: item.amount,
          type: 'EXPENSE',
          category: item.category,
          description: item.description,
          date: date,
        },
      })
    );
  }

  await Promise.all(transactions);
  console.log(`✅ Created ${transactions.length} transactions`);

  // Create budgets for current month
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  const budgets = [
    { category: 'Housing', amount: 1600 },
    { category: 'Groceries', amount: 500 },
    { category: 'Dining', amount: 200 },
    { category: 'Transportation', amount: 350 },
    { category: 'Entertainment', amount: 150 },
    { category: 'Shopping', amount: 300 },
    { category: 'Healthcare', amount: 200 },
    { category: 'Utilities', amount: 150 },
  ];

  for (const budget of budgets) {
    await prisma.budget.upsert({
      where: {
        userId_category_month_year: {
          userId: demoUser.id,
          category: budget.category,
          month: currentMonth,
          year: currentYear,
        },
      },
      update: {},
      create: {
        userId: demoUser.id,
        category: budget.category,
        amount: budget.amount,
        month: currentMonth,
        year: currentYear,
      },
    });
  }

  console.log(`✅ Created ${budgets.length} budgets`);
  console.log('🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
