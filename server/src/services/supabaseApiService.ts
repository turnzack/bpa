import { supabase } from '../config/supabase';

export class SupabaseApiService {
  private supabaseClient;

  constructor() {
    this.supabaseClient = supabase;
  }

  async get(table: string, params?: { select?: string; filter?: Record<string, any> }) {
    let query = this.supabaseClient.from(table).select(params?.select || '*');

    if (params?.filter) {
      Object.entries(params.filter).forEach(([key, value]) => {
        query = query.eq(key, value);
      });
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  async post(table: string, data: any) {
    const { data: result, error } = await this.supabaseClient.from(table).insert(data);
    if (error) throw error;
    return result;
  }

  async put(table: string, id: string | number, data: any) {
    const { data: result, error } = await this.supabaseClient.from(table).update(data).eq('id', id);
    if (error) throw error;
    return result;
  }

  async delete(table: string, id: string | number) {
    const { error } = await this.supabaseClient.from(table).delete().eq('id', id);
    if (error) throw error;
    return true;
  }

  // Advanced query with filters
  async query(table: string, options: {
    select?: string;
    filters?: Array<{ column: string; operator: string; value: any }>;
    orderBy?: { column: string; ascending?: boolean };
    limit?: number;
  }) {
    let query = this.supabaseClient.from(table).select(options.select || '*');

    if (options.filters) {
      options.filters.forEach(filter => {
        switch (filter.operator) {
          case 'eq':
            query = query.eq(filter.column, filter.value);
            break;
          case 'neq':
            query = query.neq(filter.column, filter.value);
            break;
          case 'gt':
            query = query.gt(filter.column, filter.value);
            break;
          case 'gte':
            query = query.gte(filter.column, filter.value);
            break;
          case 'lt':
            query = query.lt(filter.column, filter.value);
            break;
          case 'lte':
            query = query.lte(filter.column, filter.value);
            break;
          case 'like':
            query = query.like(filter.column, filter.value);
            break;
          case 'ilike':
            query = query.ilike(filter.column, filter.value);
            break;
          default:
            query = query.eq(filter.column, filter.value);
        }
      });
    }

    if (options.orderBy) {
      query = query.order(options.orderBy.column, { ascending: options.orderBy.ascending ?? true });
    }

    if (options.limit) {
      query = query.limit(options.limit);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }
}

export const supabaseApiService = new SupabaseApiService();