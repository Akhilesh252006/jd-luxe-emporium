-- Add status column to orders table if it doesn't have proper status tracking
ALTER TABLE orders 
ALTER COLUMN status TYPE text;

-- Update default status
ALTER TABLE orders 
ALTER COLUMN status SET DEFAULT 'pending';

-- Add user_id column to orders to link orders to users
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

-- Update RLS policies to allow users to view their own orders
CREATE POLICY "Users can view their own orders" 
ON orders 
FOR SELECT 
USING (auth.uid() = user_id);

-- Allow admins to update order status
CREATE POLICY "Admins can update order status" 
ON orders 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  )
);