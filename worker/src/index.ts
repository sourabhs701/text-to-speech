import { Hono } from "hono";
import { generateUUID } from "./utils"
import { Env } from "./types";
import { middleware } from "./middleware";

export const app = new Hono<{ Bindings: Env }>();

app.post("/text-to-speech", middleware, async (c) => {
	try {
		const { text } = await c.req.json();

		if (!text || typeof text !== 'string') {
			return c.json({ error: 'Text is required' }, 400);
		}

		const audio = await c.env.AI.run('@cf/myshell-ai/melotts', {
			prompt: text,
			lang: 'en',
		});

		const id = generateUUID();
		const key = `generated-audio/${id}.mp3`;

		const base64Audio = (audio as unknown as { audio: string }).audio;
		const audioData = Uint8Array.from(atob(base64Audio), c => c.charCodeAt(0));

		await c.env.R2.put(key, audioData, {
			httpMetadata: {
				contentType: 'audio/mpeg',
			},
		});

		const r2_url = `${c.env.R2_PUBLIC_DOMAIN}${key}`;

		return c.json({ r2_url });
	} catch (error) {
		return c.json({ error: 'Failed to generate audio' }, 500);
	}
});

export default app;
