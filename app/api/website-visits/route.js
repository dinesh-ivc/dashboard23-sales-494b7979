import { createClient } from '@supabase/supabase-js'
import { verifyToken } from '@/lib/jwt'
import { websiteVisitSchema } from '@/lib/validation'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function GET(request) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.split(' ')[1]
    const decoded = verifyToken(token)
    if (!decoded) {
      return Response.json({ error: 'Invalid token' }, { status: 401 })
    }

    const { data, error } = await supabase
      .from('website_visits')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      return Response.json({ error: error.message }, { status: 500 })
    }

    return Response.json(data, { status: 200 })
  } catch (error) {
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.split(' ')[1]
    const decoded = verifyToken(token)
    if (!decoded) {
      return Response.json({ error: 'Invalid token' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = websiteVisitSchema.parse(body)

    const { data, error } = await supabase
      .from('website_visits')
      .insert([validatedData])
      .select()
      .single()

    if (error) {
      return Response.json({ error: error.message }, { status: 500 })
    }

    return Response.json(data, { status: 201 })
  } catch (error) {
    if (error.name === 'ZodError') {
      return Response.json({ error: 'Invalid data', details: error.errors }, { status: 400 })
    }
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.split(' ')[1]
    const decoded = verifyToken(token)
    if (!decoded) {
      return Response.json({ error: 'Invalid token' }, { status: 401 })
    }

    const id = params.id
    const body = await request.json()
    const validatedData = websiteVisitSchema.partial().parse(body)

    const { data, error } = await supabase
      .from('website_visits')
      .update(validatedData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return Response.json({ error: error.message }, { status: 500 })
    }

    if (!data) {
      return Response.json({ error: 'Website visit not found' }, { status: 404 })
    }

    return Response.json(data, { status: 200 })
  } catch (error) {
    if (error.name === 'ZodError') {
      return Response.json({ error: 'Invalid data', details: error.errors }, { status: 400 })
    }
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.split(' ')[1]
    const decoded = verifyToken(token)
    if (!decoded) {
      return Response.json({ error: 'Invalid token' }, { status: 401 })
    }

    const id = params.id

    const { data, error } = await supabase
      .from('website_visits')
      .delete()
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return Response.json({ error: error.message }, { status: 500 })
    }

    if (!data) {
      return Response.json({ error: 'Website visit not found' }, { status: 404 })
    }

    return Response.json({ message: 'Website visit deleted successfully' }, { status: 200 })
  } catch (error) {
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}