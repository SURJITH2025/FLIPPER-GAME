import { supabase } from '../supabase';
import type { GameMode } from '../types';

export const saveScore = async (userId: string, score: number, mode: GameMode, level: number) => {
    if (!userId) {
        console.warn("Cannot save score: User ID is missing.");
        return;
    }

    try {
        const { error } = await supabase.from('scores').insert([
            {
                user_id: userId,
                score: score,
                mode: mode,
                level: level,
                played_at: new Date().toISOString()
            }
        ]);

        if (error) {
            console.error("Error saving score to Supabase:", error);
            // Optional: fallback to local storage or retry
        } else {
            console.log("Score saved successfully!");
        }
    } catch (err) {
        console.error("Unexpected error saving score:", err);
    }
};
