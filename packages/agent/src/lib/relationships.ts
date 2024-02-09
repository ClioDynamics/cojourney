/** create a connection
 * @todo This should only be allowable by the current user if they are connected to both userA and userB
*/
export async function createRelationship({ supabase, userA, userB}: { supabase: any, userA: string, userB: string }) {
  // create a connection
  // return the connection
  const response = supabase.from("relationships").upsert({
    user_a: userA,
    user_b: userB,
  }, { returning: "minimal" });

  const { data, error } = response;

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getRelationship({ supabase, userA, userB }: { supabase: any, userA: string, userB: string }) {
  const { data, error } = await supabase.rpc('get_relationship', { usera: userA, userb: userB });

  if (error) {
    throw new Error(error.message);
  }

  return data[0];
}

export async function getRelationships({ supabase, userId }: { supabase: any, userId: string }) {
  // Await the query to complete and get the response directly
  const { data, error } = await supabase.from("relationships").select("*")
    // Check for userId in either user_a or user_b columns
    .or(`user_a.eq.${userId},user_b.eq.${userId}`)
    .eq("status", "FRIENDS");

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

/**
 * custom function to query relationships by embedding
 * pull all actors in scene and compare their embeddings to the user's rolodex to draw in relevant matches
 * @todo Implement this function
 * @param {object} options
 * @param {object} options.supabase
 * @param {string} options.userId
 * @param {object} options.embedding
 */
// export async function searchRelationships({ supabase, userId, embedding }) {
// }

export async function createProfileEmbedding({ supabase, agent, runtime }: { supabase: any, agent: any, runtime: any }) {
  if (runtime.debugMode) {
    console.log(`Creating profile embedding for ${agent.name}`);
  }
  const embedding = await runtime.embed(agent.description);
  const { data, error } = await supabase.from("accounts").update({ profile_embedding: embedding }).eq("id", agent.id);
  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function formatRelationships({ supabase, userId }: { supabase: any, userId: string }) {
  const relationships = await getRelationships({ supabase, userId });

  const formattedRelationships = relationships.map((relationship: any) => {
    const { user_a, user_b } = relationship;

    if (user_a === userId) {
      return user_b;
    }

    return user_a;
  });

  return formattedRelationships;
}
