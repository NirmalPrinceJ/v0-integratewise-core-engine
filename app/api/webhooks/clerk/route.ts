import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { createUserProfile, updateUserProfile } from '@/lib/auth/supabase-clerk'

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    return new Response('Webhook secret not configured', { status: 500 })
  }

  const headerPayload = await headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400,
    })
  }

  const body = await req.text()
  const wh = new Webhook(WEBHOOK_SECRET)

  let evt
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as any
  } catch (err) {
    console.error('[v0] Webhook signature verification failed:', err)
    return new Response('Error occured', {
      status: 400,
    })
  }

  const eventType = evt.type
  const userId = evt.data.id

  try {
    if (eventType === 'user.created') {
      const { email_addresses, first_name, last_name } = evt.data
      const email = email_addresses[0]?.email_address
      const name = `${first_name || ''} ${last_name || ''}`.trim()

      if (email) {
        await createUserProfile(userId, email, name)
        console.log(`[v0] Created user profile for ${userId}`)
      }
    } else if (eventType === 'user.updated') {
      const { email_addresses, first_name, last_name } = evt.data
      const email = email_addresses[0]?.email_address
      const name = `${first_name || ''} ${last_name || ''}`.trim()

      await updateUserProfile(userId, {
        email,
        name,
      })
      console.log(`[v0] Updated user profile for ${userId}`)
    } else if (eventType === 'user.deleted') {
      // Handle user deletion if needed
      console.log(`[v0] User deleted: ${userId}`)
    }

    return new Response('Webhook processed', { status: 200 })
  } catch (error) {
    console.error('[v0] Webhook processing error:', error)
    return new Response('Error processing webhook', { status: 500 })
  }
}
