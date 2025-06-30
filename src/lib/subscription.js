import { supabase } from './supabase.js'

export const subscription = {
  async getSubscriptionStatus(userId) {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return data
  },

  async createCheckoutSession(userId, priceId) {
    const { data: { session } } = await supabase.auth.getSession()
    
    const { data, error } = await supabase.functions.invoke('create-checkout-session', {
      body: { priceId },
      headers: {
        Authorization: `Bearer ${session.access_token}`
      }
    })
    
    if (error) throw error
    return data
  },

  async createPortalSession(userId) {
    const { data: { session } } = await supabase.auth.getSession()
    
    const { data, error } = await supabase.functions.invoke('create-portal-session', {
      body: {},
      headers: {
        Authorization: `Bearer ${session.access_token}`
      }
    })
    
    if (error) throw error
    return data
  }
}