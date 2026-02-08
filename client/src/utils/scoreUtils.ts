import { supabase } from '../supabase';
import type { GameMode } from '../types';

export const saveScore = async (userId: string, score: number, mode: GameMode, level: number) => {
    if (!userId) {
        console.warn("Cannot save score: User ID is missing.");
        return;
    }

    // Skip saving score for guest users (mock IDs)
    if (userId.startsWith('guest-')) {
        console.log("Guest score not saved to database (local session).");
        return;
    }

    try {
        // Fetch ALL existing scores for this user and mode
        const { data: existingScores, error: fetchError } = await supabase
            .from('scores')
            .select('*')
            .eq('user_id', userId)
            .eq('mode', mode)
            .order('score', { ascending: false }); // Highest first

        if (fetchError) {
            console.error("Error fetching existing scores:", fetchError);
            return;
        }

        if (existingScores && existingScores.length > 0) {
            // Found existing records. The first one is the highest logic score (or just one of them).
            // We keep the first one as the "canonical" record.
            const bestRecord = existingScores[0];
            const duplicates = existingScores.slice(1);

            // 1. Clean up duplicates if they exist
            if (duplicates.length > 0) {
                console.warn(`Found ${duplicates.length} duplicate scores. Cleaning up...`);
                const idsToDelete = duplicates.map((r: any) => r.id);
                await supabase.from('scores').delete().in('id', idsToDelete);
            }

            // 2. Check if new score is higher than the best record
            if (score > bestRecord.score) {
                const { error: updateError } = await supabase
                    .from('scores')
                    .update({
                        score: score,
                        level: level,
                        played_at: new Date().toISOString()
                    })
                    .eq('id', bestRecord.id);

                if (updateError) console.error("Error updating high score:", updateError);
                else console.log("High score updated successfully!");
            } else {
                console.log("New score isn't higher than existing best. Keep existing.");
            }
        } else {
            // No scores exist, insert the first one
            const { error: insertError } = await supabase.from('scores').insert([
                {
                    user_id: userId,
                    score: score,
                    mode: mode,
                    level: level,
                    played_at: new Date().toISOString()
                }
            ]);

            if (insertError) console.error("Error inserting first score:", insertError);
            else console.log("First score saved successfully!");
        }
    } catch (err) {
        console.error("Unexpected error saving score:", err);
    }
};
