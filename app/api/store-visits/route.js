'use server';

import { createClient } from '@/lib/supabase'
import { validateStoreVisit } from '@/lib/validation'
import { authenticateRequest } from '@/lib/jwt'

export async function GET(request) {
  try {
    const authResult = await authenticateRequest(request)
    if (!authResult.authenticated) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = (page - 1) * limit

    const supabase = createClient()

    const { data, error, count } = await supabase
      .from('store_visits')
      .select('*', { count: 'exact' })
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false })

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    return new Response(JSON.stringify({
      store_visits: data,
      pagination: {
        current_page: page,
        per_page: limit,
        total: count,
        total_pages: Math.ceil(count / limit)
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

export async function POST(request) {
  try {
    const authResult = await authenticateRequest(request)
    if (!authResult.authenticated) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const body = await request.json()
    const { success, data, error } = validateStoreVisit(body)

    if (!success) {
      return new Response(JSON.stringify({ 
        error: 'Validation failed',
        details: error.flatten()
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const supabase = createClient()

    const { data: storeVisit, error: insertError } = await supabase
      .from('store_visits')
      .insert([data])
      .select()
      .single()

    if (insertError) {
      return new Response(JSON.stringify({ error: insertError.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    return new Response(JSON.stringify(storeVisit), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

export async function PUT(request) {
  try {
    const authResult = await authenticateRequest(request)
    if (!authResult.authenticated) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const url = new URL(request.url)
    const id = url.pathname.split('/').pop()

    if (!id) {
      return new Response(JSON.stringify({ error: 'Missing store visit ID' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const body = await request.json()
    const { success, data, error } = validateStoreVisit.partial().safeParse(body)

    if (!success) {
      return new Response(JSON.stringify({ 
        error: 'Validation failed',
        details: error.flatten()
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const supabase = createClient()

    const { data: storeVisit, error: updateError } = await supabase
      .from('store_visits')
      .update(data)
      .eq('id', id)
      .select()
      .single()

    if (updateError) {
      return new Response(JSON.stringify({ error: updateError.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    if (!storeVisit) {
      return new Response(JSON.stringify({ error: 'Store visit not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    return new Response(JSON.stringify(storeVisit), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

export async function DELETE(request) {
  try {
    const authResult = await authenticateRequest(request)
    if (!authResult.authenticated) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const url = new URL(request.url)
    const id = url.pathname.split('/').pop()

    if (!id) {
      return new Response(JSON.stringify({ error: 'Missing store visit ID' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const supabase = createClient()

    const { error: deleteError } = await supabase
      .from('store_visits')
      .delete()
      .eq('id', id)

    if (deleteError) {
      return new Response(JSON.stringify({ error: deleteError.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    return new Response(null, {
      status: 204
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}