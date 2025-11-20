import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters long')
});

export async function POST(request) {
  try {
    const body = await request.json();

    const validationResult = loginSchema.safeParse(body);
    if (!validationResult.success) {
      return Response.json(
        { error: 'Validation failed', details: validationResult.error.flatten() },
        { status: 400 }
      );
    }

    const { email, password } = validationResult.data;

    const { data: users, error: fetchError } = await supabase
      .from('users')
      .select('id, email, password_hash, first_name, last_name')
      .eq('email', email)
      .single();

    if (fetchError || !users) {
      return Response.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, users.password_hash);
    if (!isPasswordValid) {
      return Response.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      { 
        userId: users.id,
        email: users.email
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    const { password_hash, ...userWithoutPassword } = users;

    return Response.json({
      message: 'Login successful',
      token,
      user: userWithoutPassword
    }, { status: 200 });

  } catch (error) {
    console.error('Login error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}