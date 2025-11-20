import { createClient } from '@/lib/supabase';
import { validateProduct } from '@/lib/validation';
import { getToken } from '@/lib/jwt';

export async function GET(request) {
  try {
    const token = request.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401 }
      );
    }

    const decoded = getToken(token);
    if (!decoded) {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { status: 401 }
      );
    }

    const supabase = createClient();
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500 }
      );
    }

    return new Response(
      JSON.stringify({ data }),
      { status: 200 }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const token = request.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401 }
      );
    }

    const decoded = getToken(token);
    if (!decoded) {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = validateProduct(body);

    const supabase = createClient();
    const { data, error } = await supabase
      .from('products')
      .insert([validatedData])
      .select()
      .single();

    if (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500 }
      );
    }

    return new Response(
      JSON.stringify({ data }),
      { status: 201 }
    );
  } catch (err) {
    if (err.name === 'ZodError') {
      return new Response(
        JSON.stringify({ 
          error: 'Validation failed',
          details: err.errors 
        }),
        { status: 400 }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const token = request.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401 }
      );
    }

    const decoded = getToken(token);
    if (!decoded) {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { status: 401 }
      );
    }

    const id = params.id;
    if (!id) {
      return new Response(
        JSON.stringify({ error: 'Product ID is required' }),
        { status: 400 }
      );
    }

    const body = await request.json();
    const validatedData = validateProduct.partial().parse(body);

    const supabase = createClient();
    const { data, error } = await supabase
      .from('products')
      .update(validatedData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500 }
      );
    }

    if (!data) {
      return new Response(
        JSON.stringify({ error: 'Product not found' }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ data }),
      { status: 200 }
    );
  } catch (err) {
    if (err.name === 'ZodError') {
      return new Response(
        JSON.stringify({ 
          error: 'Validation failed',
          details: err.errors 
        }),
        { status: 400 }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const token = request.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401 }
      );
    }

    const decoded = getToken(token);
    if (!decoded) {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { status: 401 }
      );
    }

    const id = params.id;
    if (!id) {
      return new Response(
        JSON.stringify({ error: 'Product ID is required' }),
        { status: 400 }
      );
    }

    const supabase = createClient();
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500 }
      );
    }

    return new Response(null, { status: 204 });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500 }
    );
  }
}