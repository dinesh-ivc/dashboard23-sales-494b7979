import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { z } from 'zod'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1)
})

export async function GET(request) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, name, created_at')
      .eq('id', decoded.userId)
      .single()

    if (error) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { email, password, name } = userSchema.parse(body)

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single()

    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const { data: newUser, error } = await supabase
      .from('users')
      .insert([
        {
          email,
          password: hashedPassword,
          name
        }
      ])
      .select('id, email, name, created_at')
      .single()

    if (error) {
      return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
    }

    // Generate JWT token
    const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    })

    return NextResponse.json({ user: newUser, token })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input data' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}