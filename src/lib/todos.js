import { supabase } from './supabase.js'

export const todosDb = {
  async getTodos(userId) {
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  async createTodo(userId, text) {
    const { data, error } = await supabase
      .from('todos')
      .insert([
        {
          user_id: userId,
          text,
          completed: false
        }
      ])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async updateTodo(id, updates) {
    const { data, error } = await supabase
      .from('todos')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async deleteTodo(id) {
    const { error } = await supabase
      .from('todos')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}