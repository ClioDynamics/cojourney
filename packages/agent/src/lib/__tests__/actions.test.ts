import { type User } from '@supabase/supabase-js'
import { type UUID } from 'crypto'
import dotenv from 'dotenv-flow'
import { getCachedEmbedding, writeCachedEmbedding } from '../../test/cache'
import { createRuntime } from '../../test/createRuntime'
import { getRelationship } from '../relationships'
import { type CojourneyRuntime } from '../runtime'
import { composeState } from '../state'
import { type Message } from '../types'

dotenv.config()

const zeroUuid = '00000000-0000-0000-0000-000000000000'

describe('User Profile', () => {
  let user: User | null
  let runtime: CojourneyRuntime
  let room_id: UUID | null

  afterAll(async () => {
    await cleanup()
  })

  beforeAll(async () => {
    const setup = await createRuntime(process.env as Record<string, string>)
    user = setup.user
    runtime = setup.runtime

    const data = await getRelationship({
      supabase: runtime.supabase,
      userA: user?.id as UUID,
      userB: zeroUuid
    })

    room_id = data?.room_id

    await cleanup()
  })

  async function cleanup () {
    await runtime.reflectionManager.removeAllMemoriesByUserIds([
      user?.id as UUID,
      zeroUuid
    ])
    await runtime.messageManager.removeAllMemoriesByUserIds([
      user?.id as UUID,
      zeroUuid
    ])
  }

  async function populateMemories (conversations: Array<(user_id: string) => Array<{ user_id: string, content: string }>>) {
    for (const conversation of conversations) {
      for (const c of conversation(user?.id as UUID)) {
        const existingEmbedding = getCachedEmbedding(c.content)
        const bakedMemory = await runtime.messageManager.addEmbeddingToMemory({
          user_id: c.user_id as UUID,
          user_ids: [user?.id as UUID, zeroUuid],
          content: {
            content: c.content
          },
          room_id: room_id as UUID,
          embedding: existingEmbedding
        })
        await runtime.messageManager.createMemory(bakedMemory)
        if (!existingEmbedding) {
          writeCachedEmbedding(c.content, bakedMemory.embedding as number[])
          await new Promise((resolve) => setTimeout(resolve, 200))
        }
      }
    }
  }

  test('Action handler test', async () => {
    const message: Message = {
      senderId: user?.id as UUID,
      agentId: zeroUuid,
      userIds: [user?.id as UUID, zeroUuid],
      content: '',
      room_id: room_id as UUID
    }

    await populateMemories([
      // continue conversation 1 (should continue)
    ])

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    // const result = (await handler(runtime, message)) as string[]
    // const resultConcatenated = result.join('\n')

    // const state = await composeState(runtime, message)

    // test continue, ignore, wait at expected times

    // test an example action being included in the template


  }, 60000)
})
