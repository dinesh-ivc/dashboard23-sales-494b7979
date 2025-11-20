import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { createUserSchema } from '@/lib/validation'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function POST(request) {
  try {
    const body = await request.json()

    // Validate input
    const validatedData = createUserSchema.parse(body)

    const { email, password, name } = validatedData

    // Check if user already exists
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single()

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      )
    }

    if (fetchError && fetchError.code !== 'PGRST116') {
      throw new Error(fetchError.message)
    }

    // Hash password
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    // Insert new user
    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          email,
          password: hashedPassword,
          name,
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single()

    if (error) {
      throw new Error(error.message)
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = data

    return NextResponse.json(
      { 
        message: 'User created successfully',
        user: userWithoutPassword
      },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}